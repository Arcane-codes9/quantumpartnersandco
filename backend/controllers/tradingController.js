const Trade = require('../models/Trade');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

/**
 * Initiate a new trade
 */
const initiateTrade = async (req, res) => {
  try {
    const { type, amount, fee, duration, maturity_amount, maturity_date, profit, date, invoice, notes } = req.body;
    const userId = req.user._id;

    // Deduct trade amount from user's balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const currentBalance = parseFloat(user.balance || '0');
    if (currentBalance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    user.balance = (currentBalance - amount).toFixed(2);
    await user.save();

    // Create new trade
    const trade = new Trade({
      userId, type, amount, fee, duration, maturity_amount, maturity_date, profit, date, invoice, notes
    });

    await trade.save();

    // Add trade notification to user
    await req.user.addNotification('trade', `New ${type} trade initiated for ${amount} with invoice ${invoice}.`);

    res.status(201).json({
      message: 'Trade initiated successfully',
      data: {
        trade: trade.summary
      }
    });
  } catch (error) {
    console.error('Trade initiation error:', error);
    res.status(500).json({
      error: 'Trade initiation failed',
      message: 'Internal server error'
    });
  }
};

/**
 * Get user's trading history
 */
const getTrades = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status, type } = req.query;

    // Build query
    const query = { userId };
    if (status) query.status = status;
    if (type) query.type = type;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get trades with pagination
    const trades = await Trade.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('type amount duration maturity_amount maturity_date profit date invoice notes status totalValue fees createdAt');

    // Get total count
    const total = await Trade.countDocuments(query);

    // Get trading statistics
    const stats = await Trade.getUserStats(userId);

    res.json({
      message: 'Trades retrieved successfully',
      data: {
        trades,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        stats
      }
    });
  } catch (error) {
    console.error('Get trades error:', error);
    res.status(500).json({
      error: 'Failed to retrieve trades',
      message: 'Internal server error'
    });
  }
};

/**
 * Create a deposit request
 */
const createDeposit = async (req, res) => {
  try {
    const { amount, method, currency = 'USD', walletAddress, reference } = req.body;
    const userId = req.user._id;

    // Create deposit transaction
    const deposit = new Transaction({
      userId,
      type: 'deposit',
      amount,
      method,
      currency,
      walletAddress,
      reference
    });

    await deposit.save();

    // Add deposit notification to user
    await req.user.addNotification('deposit', `Deposit request of ${amount} ${currency} via ${method}`);

    res.status(201).json({
      message: 'Deposit request created successfully',
      data: {
        transaction: deposit.summary
      }
    });
  } catch (error) {
    console.error('Deposit creation error:', error);
    res.status(500).json({
      error: 'Deposit creation failed',
      message: 'Internal server error'
    });
  }
};

/**
 * Create a withdrawal request
 */
const createWithdrawal = async (req, res) => {
  try {
    const { amount, usdAmount, method, accountType, currency = 'USD', walletAddress, reference } = req.body;
    console.log({ amount, method, accountType, currency, walletAddress, reference })
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Create withdrawal transaction
    const withdrawal = new Transaction({ userId, type: 'withdrawal', amount, method, currency, walletAddress, reference });

    if (accountType === 'balance') {
      user.balance = (parseFloat(user.balance || '0') - usdAmount).toFixed(7);
    } else if (accountType === 'profit') {
      user.profit = (parseFloat(user.profit || '0') - usdAmount).toFixed(7);
    }

    await user.save();
    await withdrawal.save();

    // Add withdrawal notification to user
    await req.user.addNotification('withdrawal', `Withdrawal request of ${amount} ${currency} via ${method}`);

    res.status(201).json({
      message: 'Withdrawal request created successfully',
      data: {
        transaction: withdrawal.summary
      }
    });
  } catch (error) {
    console.error('Withdrawal creation error:', error);
    res.status(500).json({
      error: 'Withdrawal creation failed',
      message: 'Internal server error'
    });
  }
};

/**
 * Get user's account activities
 */
const getActivities = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, type } = req.query;

    // Get user with notifications
    const user = await User.findById(userId).select('notifications');

    // Filter notifications by type if specified
    let notifications = user.notifications;
    if (type) {
      notifications = notifications.filter(n => n.type === type);
    }

    // Sort by date (newest first)
    notifications.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedNotifications = notifications.slice(skip, skip + parseInt(limit));

    // Get recent trades
    const recentTrades = await Trade.getRecentTrades(userId, 5);

    // Get recent transactions
    const recentTransactions = await Transaction.getRecentTransactions(userId, 5);

    // Get transaction statistics
    const transactionStats = await Transaction.getUserStats(userId);

    res.json({
      message: 'Activities retrieved successfully',
      data: {
        notifications: paginatedNotifications,
        recentTrades,
        recentTransactions,
        transactionStats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: notifications.length,
          pages: Math.ceil(notifications.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      error: 'Failed to retrieve activities',
      message: 'Internal server error'
    });
  }
};

/**
 * Mark notifications as read
 */
const markNotificationsAsRead = async (req, res) => {
  try {
    const user = req.user;
    await user.markNotificationsAsRead();

    res.json({
      message: 'Notifications marked as read',
      data: {
        message: 'All notifications have been marked as read'
      }
    });
  } catch (error) {
    console.error('Mark notifications as read error:', error);
    res.status(500).json({
      error: 'Failed to mark notifications as read',
      message: 'Internal server error'
    });
  }
};

/**
 * Get user's trading statistics
 */
const getTradingStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get trade statistics
    const tradeStats = await Trade.getUserStats(userId);

    // Get transaction statistics
    const transactionStats = await Transaction.getUserStats(userId);

    res.json({
      message: 'Trading statistics retrieved successfully',
      data: {
        trades: tradeStats,
        transactions: transactionStats
      }
    });
  } catch (error) {
    console.error('Get trading stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve trading statistics',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  initiateTrade,
  getTrades,
  createDeposit,
  createWithdrawal,
  getActivities,
  markNotificationsAsRead,
  getTradingStats
}; 