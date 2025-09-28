const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    enum: ['Starter', 'Pro', 'Elite'],
    required: [true, 'Trade type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.0001, 'Amount must be greater than 0']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  maturity_amount: {
    type: Number,
    required: [true, 'Maturity amount is required']
  },
  maturity_date: {
    type: Date,
    required: [true, 'Maturity date is required']
  },
  profit: {
    type: Number,
    required: [true, 'Profit is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  invoice: {
    type: String,
    required: [true, 'Invoice is required'],
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'failed'],
    default: 'pending'
  },
  totalValue: {
    type: Number,
    required: false,
    default: 0
  },
  fees: {
    type: Number,
    required: false,
    default: 0
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
tradeSchema.index({ userId: 1, createdAt: -1 });
tradeSchema.index({ status: 1 });
tradeSchema.index({ asset: 1 });

// Calculate total value before saving (if needed)
tradeSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('maturity_amount')) {
    this.totalValue = this.maturity_amount;
  }
  next();
});

// Virtual for trade summary
tradeSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    type: this.type,
    amount: this.amount,
    duration: this.duration,
    maturity_amount: this.maturity_amount,
    maturity_date: this.maturity_date,
    profit: this.profit,
    date: this.date,
    invoice: this.invoice,
    notes: this.notes,
    totalValue: this.totalValue,
    fees: this.fees,
    status: this.status,
    createdAt: this.createdAt
  };
});

// Static method to get user's trading statistics
tradeSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalTrades: { $sum: 1 },
        totalVolume: { $sum: '$totalValue' },
        totalFees: { $sum: '$fees' },
        completedTrades: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        pendingTrades: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        buyTrades: {
          $sum: { $cond: [{ $eq: ['$type', 'buy'] }, 1, 0] }
        },
        sellTrades: {
          $sum: { $cond: [{ $eq: ['$type', 'sell'] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalTrades: 0,
    totalVolume: 0,
    totalFees: 0,
    completedTrades: 0,
    pendingTrades: 0,
    buyTrades: 0,
    sellTrades: 0
  };
};

// Static method to get recent trades
tradeSchema.statics.getRecentTrades = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('type amount duration maturity_amount maturity_date profit date invoice notes status totalValue fees createdAt');
};

module.exports = mongoose.model('Trade', tradeSchema); 