const {
  sendPromotionalEmail,
  sendWithdrawalNotification,
  sendDepositConfirmation,
  sendPasswordChangeAlert,
  sendActivationEmail,
  sendEmail
} = require('../utils/email');

/**
 * Send forgotten password reset email
 */
const sendForgottenPasswordNotice = async (req, res) => {
  try {
    const { to, userName, resetLink } = req.body;

    // Prepare props for template
    const props = {
      userName: userName || 'Valued Customer',
      resetLink
    };

    // Use the forgot-password.html template
    const { sendEmail, loadTemplate } = require('../utils/email');
    const html = await loadTemplate('forgot-password', props);

    await sendEmail(
      to,
      '🔑 Password Reset Request - QuantumPartnersandCo',
      html
    );

    res.json({
      message: 'Forgotten password reset email sent successfully',
      data: {
        recipient: to,
        type: 'forgot-password'
      }
    });
  } catch (error) {
    console.error('Forgotten password email error:', error);
    res.status(500).json({
      error: 'Email sending failed',
      message: 'Failed to send forgotten password reset email'
    });
  }
};

/**
 * Send promotional email
 */
const sendPromotional = async (req, res) => {
  try {
    const { to, userName, customData } = req.body;

    await sendPromotionalEmail(to, {
      userName,
      ...customData
    });

    res.json({
      message: 'Promotional email sent successfully',
      data: {
        recipient: to,
        type: 'promotional'
      }
    });
  } catch (error) {
    console.error('Promotional email error:', error);
    res.status(500).json({
      error: 'Email sending failed',
      message: 'Failed to send promotional email'
    });
  }
};

/**
 * Send withdrawal notification
 */
const sendWithdrawalNotice = async (req, res) => {
  try {
    const { to, userName, transactionId, amount, currency, date, status } = req.body;

    await sendWithdrawalNotification(to, {
      userName,
      transactionId,
      amount,
      currency,
      date,
      status
    });

    res.json({
      message: 'Withdrawal notification sent successfully',
      data: {
        recipient: to,
        transactionId,
        type: 'withdrawal'
      }
    });
  } catch (error) {
    console.error('Withdrawal notification error:', error);
    res.status(500).json({
      error: 'Email sending failed',
      message: 'Failed to send withdrawal notification'
    });
  }
};

/**
 * Send deposit confirmation
 */
const sendDepositNotice = async (req, res) => {
  try {
    const { to, userName, amount, currency, walletId, date } = req.body;

    await sendDepositConfirmation(to, {
      userName,
      amount,
      currency,
      walletId,
      date
    });

    res.json({
      message: 'Deposit confirmation sent successfully',
      data: {
        recipient: to,
        amount,
        currency,
        type: 'deposit'
      }
    });
  } catch (error) {
    console.error('Deposit confirmation error:', error);
    res.status(500).json({
      error: 'Email sending failed',
      message: 'Failed to send deposit confirmation'
    });
  }
};

/**
 * Send password change alert
 */
const sendPasswordAlert = async (req, res) => {
  try {
    const { to, userName, ipAddress, timestamp, deviceInfo } = req.body;

    await sendPasswordChangeAlert(to, {
      userName,
      ipAddress,
      timestamp,
      deviceInfo
    });

    res.json({
      message: 'Password change alert sent successfully',
      data: {
        recipient: to,
        type: 'password-change'
      }
    });
  } catch (error) {
    console.error('Password change alert error:', error);
    res.status(500).json({
      error: 'Email sending failed',
      message: 'Failed to send password change alert'
    });
  }
};

/**
 * Send activation key email
 */
const sendActivationNotice = async (req, res) => {
  try {
    const { to, userName, activationKey } = req.body;

    await sendActivationEmail(to, {
      userName,
      activationKey
    });

    res.json({
      message: 'Activation email sent successfully',
      data: {
        recipient: to,
        type: 'activation'
      }
    });
  } catch (error) {
    console.error('Activation email error:', error);
    res.status(500).json({
      error: 'Email sending failed',
      message: 'Failed to send activation email'
    });
  }
};

/**
 * Send custom email
 */
const sendCustomEmail = async (req, res) => {
  try {
    const { to, subject, html, attachments } = req.body;

    await sendEmail(to, subject, html, attachments);

    res.json({
      message: 'Custom email sent successfully',
      data: {
        recipient: to,
        subject,
        type: 'custom'
      }
    });
  } catch (error) {
    console.error('Custom email error:', error);
    res.status(500).json({
      error: 'Email sending failed',
      message: 'Failed to send custom email'
    });
  }
};

/**
 * Send bulk promotional emails
 */
const sendBulkPromotional = async (req, res) => {
  try {
    const { recipients, customData } = req.body;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        error: 'Invalid recipients',
        message: 'Recipients must be a non-empty array'
      });
    }

    const results = [];
    const errors = [];

    // Send emails in parallel with rate limiting
    const emailPromises = recipients.map(async (recipient, index) => {
      try {
        // Add small delay to avoid overwhelming the email server
        await new Promise(resolve => setTimeout(resolve, index * 100));
        
        await sendPromotionalEmail(recipient.email, {
          userName: recipient.userName || 'Valued Customer',
          ...customData
        });

        results.push({
          email: recipient.email,
          status: 'sent'
        });
      } catch (error) {
        errors.push({
          email: recipient.email,
          error: error.message
        });
      }
    });

    await Promise.all(emailPromises);

    res.json({
      message: 'Bulk promotional emails processed',
      data: {
        total: recipients.length,
        sent: results.length,
        failed: errors.length,
        results,
        errors
      }
    });
  } catch (error) {
    console.error('Bulk promotional email error:', error);
    res.status(500).json({
      error: 'Bulk email sending failed',
      message: 'Failed to send bulk promotional emails'
    });
  }
};

/**
 * Get email templates list
 */
const getEmailTemplates = async (req, res) => {
  try {
    const templates = [
      {
        name: 'promotional',
        description: 'Promotional email for crypto investment opportunities',
        requiredFields: ['to', 'userName'],
        optionalFields: ['customData']
      },
      {
        name: 'withdrawal',
        description: 'Withdrawal notification with transaction details',
        requiredFields: ['to', 'userName', 'transactionId', 'amount', 'currency', 'date', 'status'],
        optionalFields: []
      },
      {
        name: 'deposit',
        description: 'Deposit confirmation with wallet details',
        requiredFields: ['to', 'userName', 'amount', 'currency', 'walletId', 'date'],
        optionalFields: []
      },
      {
        name: 'password-change',
        description: 'Password change security alert',
        requiredFields: ['to', 'userName', 'ipAddress', 'timestamp'],
        optionalFields: ['deviceInfo']
      },
      {
        name: 'activation',
        description: 'Account activation with activation key',
        requiredFields: ['to', 'userName', 'activationKey'],
        optionalFields: []
      }
    ];

    res.json({
      message: 'Email templates retrieved successfully',
      data: {
        templates
      }
    });
  } catch (error) {
    console.error('Get email templates error:', error);
    res.status(500).json({
      error: 'Failed to retrieve email templates',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  sendPromotional,
  sendWithdrawalNotice,
  sendDepositNotice,
  sendPasswordAlert,
  sendActivationNotice,
  sendCustomEmail,
  sendBulkPromotional,
  getEmailTemplates,
  sendForgottenPasswordNotice
}; 