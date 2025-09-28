const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal'],
    required: [true, 'Transaction type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.0000001, 'Amount must be greater than 0']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  method: {
    type: String,
    required: [true, 'Payment method is required'],
    trim: true
  },
  currency: {
    type: String,
    default: 'USD',
    trim: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  walletAddress: {
    type: String,
    trim: true
  },
  reference: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ transactionId: 1 });

// Generate transaction ID before saving
transactionSchema.pre('save', function(next) {
  if (this.isNew && !this.transactionId) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.transactionId = `TXN${timestamp}${random}`;
  }
  next();
});

// Virtual for transaction summary
transactionSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    type: this.type,
    amount: this.amount,
    currency: this.currency,
    status: this.status,
    method: this.method,
    transactionId: this.transactionId,
    createdAt: this.createdAt
  };
});

// Static method to get user's transaction statistics
transactionSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        totalCount: { $sum: 1 },
        pendingAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] }
        },
        approvedAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0] }
        },
        rejectedAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, '$amount', 0] }
        }
      }
    }
  ]);

  const result = {
    deposits: { totalAmount: 0, totalCount: 0, pendingAmount: 0, approvedAmount: 0, rejectedAmount: 0 },
    withdrawals: { totalAmount: 0, totalCount: 0, pendingAmount: 0, approvedAmount: 0, rejectedAmount: 0 }
  };

  stats.forEach(stat => {
    if (stat._id === 'deposit') {
      result.deposits = stat;
    } else if (stat._id === 'withdrawal') {
      result.withdrawals = stat;
    }
  });

  return result;
};

// Static method to get recent transactions
transactionSchema.statics.getRecentTransactions = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('type amount currency status method transactionId createdAt');
};

// Method to approve transaction
transactionSchema.methods.approve = function(processedBy) {
  this.status = 'approved';
  this.processedAt = new Date();
  this.processedBy = processedBy;
  return this.save();
};

// Method to reject transaction
transactionSchema.methods.reject = function(processedBy, notes = '') {
  this.status = 'rejected';
  this.processedAt = new Date();
  this.processedBy = processedBy;
  if (notes) this.notes = notes;
  return this.save();
};

module.exports = mongoose.model('Transaction', transactionSchema); 