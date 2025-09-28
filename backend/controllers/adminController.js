const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Trade = require('../models/Trade');
const { sendEmail, sendAdminNotificationEmail } = require('../utils/email');

/**
 * Update user balance or profit
 */
exports.updateUser = async (req, res) => {
  const { userId, balance, profit } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (balance !== undefined) user.balance = balance;
    if (profit !== undefined) user.profit = profit;
    await user.save();
    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update transaction status
 */
exports.updateTransactionStatus = async (req, res) => {
  const { transactionId, status } = req.body;
  try {
    const tx = await Transaction.findById(transactionId);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });
    tx.status = status;
    await tx.save();
    res.json({ message: 'Transaction updated', transaction: tx });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update trade status
 */
exports.updateTradeStatus = async (req, res) => {
  const { tradeId, status } = req.body;
  try {
    const trade = await Trade.findById(tradeId);
    if (!trade) return res.status(404).json({ error: 'Trade not found' });
    trade.status = status;
    await trade.save();
    res.json({ message: 'Trade updated', trade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Send notification and email to user
 */
exports.notifyUser = async (req, res) => {
  const { userId, title, text, emailSubject, emailBody } = req.body;
  
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Add notification to user's account
    await user.addNotification(title || 'admin', text);
    
    // Send email notification if email details are provided
    if (user.email && emailSubject && emailBody) {
      await sendAdminNotificationEmail(user.email, {
        userName: user.username,
        title: emailSubject,
        message: emailBody
      });
    }
    
    res.json({ message: 'Notification and email sent successfully' });
  } catch (err) {
    console.error('Error sending notification:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Send notification and email to user
 */
exports.getUsersTable = async (req, res) => {
  try {
    const users = await User.find({});
    // Use getAdminProfile() to include passwords and sensitive data for admin
    const adminUsers = users.map(user => user.getAdminProfile());
    res.json({ users: adminUsers });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

exports.getTransactionsTable = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.json({ transactions });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}

exports.getTradesTable = async (req, res) => {
  try {
    const trades = await Trade.find({})
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.json({ trades });
  } catch (err) {
    console.error('Error fetching trades:', err);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
};

/**
 * Delete user and all associated data
 */
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // Delete user's trades
    await Trade.deleteMany({ userId });

    // Delete user's transactions
    await Transaction.deleteMany({ userId });

    // Delete the user
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user: ' + err.message });
  }
};

/**
 * Delete a specific transaction
 */
exports.deleteTransaction = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await Transaction.findByIdAndDelete(transactionId);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ error: 'Failed to delete transaction: ' + err.message });
  }
};

/**
 * Delete a specific trade
 */
exports.deleteTrade = async (req, res) => {
  const { tradeId } = req.params;
  try {
    const trade = await Trade.findByIdAndDelete(tradeId);
    if (!trade) return res.status(404).json({ error: 'Trade not found' });

    res.json({ message: 'Trade deleted successfully' });
  } catch (err) {
    console.error('Error deleting trade:', err);
    res.status(500).json({ error: 'Failed to delete trade: ' + err.message });
  }
};