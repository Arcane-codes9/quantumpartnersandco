const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  balance: {
    type: String,
    default: "0"
  },
  profit: {
    type: String,
    default: "0"
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  nationality: {
    type: String,
    required: [true, 'Nationality is required'],
    trim: true
  },
  fullname: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  isActivated: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  activationKey: {
    type: String,
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetTokenExpiry: {
    type: Date,
    default: null
  },
  notifications: [{
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'login', 'password-change', 'trade', 'activation', 'general', 'admin'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ resetPasswordToken: 1 });

// Virtual for user's full profile (excluding sensitive data)
userSchema.virtual('profile').get(function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    phone: this.phone,
    nationality: this.nationality,
    fullname: this.fullname,
    isActivated: this.isActivated,
    balance: this.balance,
    profit: this.profit,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    isAdmin: this.isAdmin
  };
});

// Admin-only method to get user with password
userSchema.methods.getAdminProfile = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    phone: this.phone,
    nationality: this.nationality,
    fullname: this.fullname,
    isActivated: this.isActivated,
    balance: this.balance,
    profit: this.profit,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    isAdmin: this.isAdmin,
    password: this.password,
    activationKey: this.activationKey,
    resetPasswordToken: this.resetPasswordToken,
    resetTokenExpiry: this.resetTokenExpiry,
    notifications: this.notifications
  };
};

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate activation key
userSchema.methods.generateActivationKey = function () {
  const key = Math.random().toString(36).substring(2, 8).toUpperCase();
  this.activationKey = key;
  return key;
};

// Method to generate reset token
userSchema.methods.generateResetToken = function () {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = token;
  this.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  return token;
};

// Method to add notification
userSchema.methods.addNotification = function (type, message) {
  this.notifications.push({
    type,
    message,
    date: new Date(),
    read: false
  });
  return this.save();
};

// Method to mark notifications as read
userSchema.methods.markNotificationsAsRead = function () {
  this.notifications.forEach(notification => {
    notification.read = true;
  });
  return this.save();
};

// Static method to find user by email or username
userSchema.statics.findByEmailOrUsername = function (identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  });
};

// Static method to clean up invalid notification types
userSchema.statics.cleanupNotificationTypes = async function () {
  const validTypes = ['deposit', 'withdrawal', 'login', 'password-change', 'trade', 'activation', 'general', 'admin'];

  // Update all users with invalid notification types
  const result = await this.updateMany(
    { 'notifications.type': { $nin: validTypes } },
    [
      {
        $set: {
          notifications: {
            $map: {
              input: '$notifications',
              as: 'notification',
              in: {
                $cond: {
                  if: { $in: ['$$notification.type', validTypes] },
                  then: '$$notification',
                  else: {
                    $mergeObjects: [
                      '$$notification',
                      { type: 'general' } // Default to 'general' for invalid types
                    ]
                  }
                }
              }
            }
          }
        }
      }
    ]
  );

  return result;
};

// Static method to fix case sensitivity in notification types
userSchema.statics.fixNotificationTypeCase = async function () {
  const typeMappings = {
    'Trade': 'trade',
    'Deposit': 'deposit',
    'Withdrawal': 'withdrawal',
    'Login': 'login',
    'Activation': 'activation',
    'General': 'general',
    'Admin': 'admin'
  };

  for (const [wrongCase, correctCase] of Object.entries(typeMappings)) {
    await this.updateMany(
      { 'notifications.type': wrongCase },
      { $set: { 'notifications.$.type': correctCase } }
    );
  }

  return { message: 'Notification type case sensitivity fixed' };
};

module.exports = mongoose.model('User', userSchema); 