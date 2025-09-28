const express = require('express');
const router = express.Router();

// Import controllers
const {
  initiateTrade,
  getTrades,
  createDeposit,
  createWithdrawal,
  getActivities,
  markNotificationsAsRead,
  getTradingStats
} = require('../controllers/tradingController');

// Import middleware
const { authenticateToken } = require('../middlewares/auth');
const {
  validateTrade,
  validateTransaction
} = require('../middlewares/validation');

/**
 * @route   POST /api/trading/inittrade
 * @desc    Initiate a new trade
 * @access  Private
 */
router.post('/inittrade', authenticateToken, validateTrade, initiateTrade);

/**
 * @route   GET /api/trading/trades
 * @desc    Get user's trading history
 * @access  Private
 */
router.get('/trades', authenticateToken, getTrades);

/**
 * @route   POST /api/trading/deposit
 * @desc    Create a deposit request
 * @access  Private
 */
router.post('/deposit', authenticateToken, validateTransaction, createDeposit);

/**
 * @route   POST /api/trading/withdraw
 * @desc    Create a withdrawal request
 * @access  Private
 */
router.post('/withdraw', authenticateToken, validateTransaction, createWithdrawal);

/**
 * @route   GET /api/trading/activities
 * @desc    Get user's account activities
 * @access  Private
 */
router.get('/activities', authenticateToken, getActivities);

/**
 * @route   POST /api/trading/notifications/read
 * @desc    Mark notifications as read
 * @access  Private
 */
router.post('/notifications/read', authenticateToken, markNotificationsAsRead);

/**
 * @route   GET /api/trading/stats
 * @desc    Get user's trading statistics
 * @access  Private
 */
router.get('/stats', authenticateToken, getTradingStats);

module.exports = router; 