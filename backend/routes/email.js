const express = require('express');
const router = express.Router();

// Import controllers
const {
  sendPromotional,
  sendWithdrawalNotice,
  sendDepositNotice,
  sendPasswordAlert,
  sendActivationNotice,
  sendCustomEmail,
  sendBulkPromotional,
  getEmailTemplates
} = require('../controllers/emailController');

// Import middleware
const { authenticateToken } = require('../middlewares/auth');
const { validateEmail } = require('../middlewares/validation');

/**
 * @route   POST /api/email/promotional
 * @desc    Send promotional email
 * @access  Private
 */
router.post('/promotional', authenticateToken, sendPromotional);

/**
 * @route   POST /api/email/withdrawal
 * @desc    Send withdrawal notification
 * @access  Private
 */
router.post('/withdrawal', authenticateToken, sendWithdrawalNotice);

/**
 * @route   POST /api/email/deposit
 * @desc    Send deposit confirmation
 * @access  Private
 */
router.post('/deposit', authenticateToken, sendDepositNotice);

/**
 * @route   POST /api/email/password-alert
 * @desc    Send password change alert
 * @access  Private
 */
router.post('/password-alert', authenticateToken, sendPasswordAlert);

/**
 * @route   POST /api/email/activation
 * @desc    Send activation email
 * @access  Private
 */
router.post('/activation', authenticateToken, sendActivationNotice);

/**
 * @route   POST /api/email/custom
 * @desc    Send custom email
 * @access  Private
 */
router.post('/custom', authenticateToken, validateEmail, sendCustomEmail);

/**
 * @route   POST /api/email/bulk-promotional
 * @desc    Send bulk promotional emails
 * @access  Private
 */
router.post('/bulk-promotional', authenticateToken, sendBulkPromotional);

/**
 * @route   GET /api/email/templates
 * @desc    Get available email templates
 * @access  Private
 */
router.get('/templates', authenticateToken, getEmailTemplates);

module.exports = router; 