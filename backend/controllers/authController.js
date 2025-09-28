const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendActivationEmail, sendPasswordChangeAlert } = require('../utils/email');
const { sendForgottenPasswordEmail } = require('../utils/email');
const crypto = require('crypto');

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    const { username, email, phone, nationality, fullname, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmailOrUsername(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'Registration failed',
        message: 'User with this email or username already exists'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      phone,
      nationality,
      fullname,
      password
    });

    // Generate activation key
    const activationKey = user.generateActivationKey();
    await user.save();

    // Send activation email
    try {
      await sendActivationEmail(user.email, {
        userName: user.fullname,
        activationKey
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue with registration even if email fails
    }

    res.status(201).json({
      message: 'Registration successful',
      data: {
        user: user.profile,
        message: 'Please check your email for activation instructions'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Internal server error'
    });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email or username
    const user = await User.findByEmailOrUsername(identifier);
    if (!user) {
      return res.status(401).json({
        error: 'Login failed',
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Login failed',
        message: 'Invalid credentials'
      });
    }

    // Check if account is activated
    if (!user.isActivated) {
      return res.status(403).json({
        error: 'Account not activated',
        message: 'Please activate your account before logging in'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Add login notification
    // await user.addNotification('login', `Successful login from ${req.ip}`);

    res.json({
      message: 'Login successful',
      data: {
        user: user.profile,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Internal server error'
    });
  }
};

/**
 * Get current authenticated user
 */
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware (should contain userId)
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized', message: 'No user found in token' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User fetched successfully',
      data: { user: user.profile }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to fetch user', message: 'Internal server error' });
  }
};

/**
 * Activate user account
 */
const activate = async (req, res) => {
  try {
    const { activationKey } = req.body;

    if (!activationKey) {
      return res.status(400).json({
        error: 'Activation failed',
        message: 'Activation key is required'
      });
    }

    // Find user with this activation key
    const user = await User.findOne({ activationKey });
    console.log({ user })
    if (!user) {
      return res.status(400).json({
        error: 'Activation failed',
        message: 'Invalid activation key'
      });
    }

    // Check if already activated
    if (user.isActivated) {
      return res.status(400).json({
        error: 'Activation failed',
        message: 'Account is already activated'
      });
    }
    console.log({ active: user.isActivated })
    // Activate account
    user.isActivated = true;
    user.activationKey = null;
    console.log({ active: user.isActivated })

    await user.save();
    console.log({ active: user.isActivated })


    // Add activation notification
    await user.addNotification('activation', 'Account activated successfully');

    res.json({
      message: 'Account activated successfully',
      data: {
        user: user.profile
      }
    });
  } catch (error) {
    console.error('Activation error:', error);
    res.status(500).json({
      error: 'Activation failed',
      message: 'Internal server error'
    });
  }
};

/**
 * Request activation key
 */
const requestActivationKey = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No account found with this email address'
      });
    }

    if (user.isActivated) {
      return res.status(400).json({
        error: 'Account already activated',
        message: 'This account is already activated'
      });
    }

    // Generate new activation key
    const activationKey = user.generateActivationKey();
    await user.save();

    // Send activation email
    try {
      await sendActivationEmail(user.email, {
        userName: user.fullname,
        activationKey
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        error: 'Email sending failed',
        message: 'Failed to send activation email'
      });
    }

    res.json({
      message: 'Activation key sent successfully',
      data: {
        message: 'Please check your email for the activation key'
      }
    });
  } catch (error) {
    console.error('Activation key request error:', error);
    res.status(500).json({
      error: 'Request failed',
      message: 'Internal server error'
    });
  }
};

/**
 * Forgot password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log({ email });

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        message: 'If an account with this email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = user.generateResetToken();
    await user.save();

    // Build password reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send password reset email
    await sendForgottenPasswordEmail(user.email, {
      userName: user.fullname || user.username || 'User',
      resetLink
    });

    res.json({
      message: 'Password reset instructions sent',
      data: {
        message: 'Please check your email for password reset instructions',
        // Remove this in production - only for testing
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      }
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Request failed',
      message: 'Internal server error'
    });
  }
};

/**
 * Change password with reset token
 */
const changePassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        error: 'Password change failed',
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    // Add password change notification
    await user.addNotification('password-change', 'Password changed via reset token');

    // Send password change alert email
    try {
      await sendPasswordChangeAlert(user.email, {
        userName: user.fullname,
        ipAddress: req.ip,
        timestamp: new Date().toISOString(),
        deviceInfo: req.get('User-Agent')
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json({
      message: 'Password changed successfully',
      data: {
        message: 'Your password has been updated'
      }
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Password change failed',
      message: 'Internal server error'
    });
  }
};

/**
 * Update password from authenticated session
 */
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const requestedUser = req.user;
    const user = await User.findById(requestedUser._id);
    console.log({ user, password: user.password, currentPassword, newPassword })
    // Check if user has a password set
    if (!user.password) {
      return res.status(400).json({
        error: 'Password update failed',
        message: 'No password is set for this user. Please reset your password.'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Password update failed',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Add password change notification
    await user.addNotification('password-change', 'Password changed from authenticated session');

    // Send password change alert email
    try {
      await sendPasswordChangeAlert(user.email, {
        userName: user.fullname,
        ipAddress: req.ip,
        timestamp: new Date().toISOString(),
        deviceInfo: req.get('User-Agent')
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json({
      message: 'Password updated successfully',
      data: {
        message: 'Your password has been updated'
      }
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      error: 'Password update failed',
      message: 'Internal server error'
    });
  }
};

/**
 * Update user information
 */
const updateInfo = async (req, res) => {
  try {
    const { phone, nationality, fullname } = req.body;
    const user = req.user;

    // Update allowed fields
    if (phone) user.phone = phone;
    if (nationality) user.nationality = nationality;
    if (fullname) user.fullname = fullname;

    await user.save();

    res.json({
      message: 'User information updated successfully',
      data: {
        user: user.profile
      }
    });
  } catch (error) {
    console.error('Update info error:', error);
    res.status(500).json({
      error: 'Update failed',
      message: 'Internal server error'
    });
  }
};

/**
 * Delete a single notification by ID for the current user
 */
const deleteNotification = async (req, res) => {
  try {
    const user = req.user;
    const notificationId = req.params.id;
    if (!notificationId) {
      return res.status(400).json({ error: 'Notification ID required' });
    }
    user.notifications = user.notifications.filter(n => n._id.toString() !== notificationId);
    await user.save();
    res.json({ message: 'Notification deleted', data: { user: user.profile } });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification', message: 'Internal server error' });
  }
};

/**
 * Delete (clear) all notifications for the current user
 */
const clearNotifications = async (req, res) => {
  try {
    const user = req.user;
    user.notifications = [];
    await user.save();
    res.json({ message: 'All notifications cleared', data: { user: user.profile } });
  } catch (error) {
    console.error('Clear notifications error:', error);
    res.status(500).json({ error: 'Failed to clear notifications', message: 'Internal server error' });
  }
};

module.exports = {
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
};