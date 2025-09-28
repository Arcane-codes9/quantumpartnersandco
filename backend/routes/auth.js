const express = require('express');
const router = express.Router();

// Import controllers
const {
  register,
  login,
  getCurrentUser,
  activate,
  requestActivationKey,
  forgotPassword,
  changePassword,
  updatePassword,
  updateInfo,
  deleteNotification,
  clearNotifications
} = require('../controllers/authController');

// Import middleware
const { authenticateToken } = require('../middlewares/auth');
const {
  validateRegistration,
  validateLogin,
  validatePasswordChange,
  validatePasswordReset,
  validateUserUpdate
} = require('../middlewares/validation');

/**
 * @route   DELETE /api/auth/notifications/:id
 * @desc    Delete a single notification by ID
 * @access  Private
 */
router.delete('/notifications/:id', authenticateToken, deleteNotification);

/**
 * @route   POST /api/auth/notifications/clear
 * @desc    Clear all notifications
 * @access  Private
 */
router.post('/notifications/clear', authenticateToken, clearNotifications);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegistration, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', authenticateToken, getCurrentUser);

/**
 * @route   POST /api/auth/activate
 * @desc    Activate user account
 * @access  Public
 */
router.post('/activate', activate);

/**
 * @route   POST /api/auth/actkeyrequest
 * @desc    Request activation key
 * @access  Public
 */
router.post('/actkeyrequest', requestActivationKey);

/**
 * @route   POST /api/auth/forgotpwd
 * @desc    Send password reset link
 * @access  Public
 */
router.post('/forgotpwd', forgotPassword);

/**
 * @route   POST /api/auth/changepwd
 * @desc    Change password with reset token
 * @access  Public
 */
router.post('/changepwd', validatePasswordReset, changePassword);

/**
 * @route   POST /api/auth/updatepwd
 * @desc    Update password from authenticated session
 * @access  Private
 */
router.post('/updatepwd', authenticateToken, validatePasswordChange, updatePassword);

/**
 * @route   POST /api/auth/updateinfo
 * @desc    Update user account info
 * @access  Private
 */
router.post('/updateinfo', authenticateToken, validateUserUpdate, updateInfo);

module.exports = router; 