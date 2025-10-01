const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

/**
 * Send forgotten password reset email
 */
const sendForgottenPasswordEmail = async (to, data) => {
  const html = await loadTemplate('forgot-password', {
    userName: data.userName || 'Valued Customer',
    resetLink: data.resetLink
  });
  return sendEmail(
    to,
    '🔑 Password Reset Request - QuantumPartnersandCo',
    html
  );
};

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Load email template
 */
const loadTemplate = async (templateName, data = {}) => {
  try {
    const templatePath = path.join(__dirname, '../emails/templates', `${templateName}.html`);
    let template = await fs.readFile(templatePath, 'utf8');
    
    // Replace placeholders with data
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, data[key]);
    });
    
    return template;
  } catch (error) {
    console.error('Error loading email template:', error);
    throw new Error('Email template not found');
  }
};

/**
 * Send email
 */
const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send promotional email
 */
const sendPromotionalEmail = async (to, data = {}) => {
  const html = await loadTemplate('promotional', {
    userName: data.userName || 'Valued Customer',
    companyName: 'QuantumPartnersandCo',
    ...data
  });
  
  return sendEmail(
    to,
    '🚀 Exclusive Investment Opportunities with QuantumPartnersandCo',
    html
  );
};

/**
 * Send withdrawal notification
 */
const sendWithdrawalNotification = async (to, data) => {
  const html = await loadTemplate('withdrawal', {
    userName: data.userName,
    transactionId: data.transactionId,
    amount: data.amount,
    currency: data.currency || 'USD',
    date: data.date,
    status: data.status
  });
  
  return sendEmail(
    to,
    `💰 Withdrawal ${data.status} - Transaction ${data.transactionId}`,
    html
  );
};

/**
 * Send deposit confirmation
 */
const sendDepositConfirmation = async (to, data) => {
  const html = await loadTemplate('deposit', {
    userName: data.userName,
    amount: data.amount,
    currency: data.currency || 'USD',
    walletId: data.walletId,
    date: data.date
  });
  
  return sendEmail(
    to,
    `✅ Deposit Confirmed - ${data.amount} ${data.currency || 'USD'}`,
    html
  );
};

/**
 * Send password change alert
 */
const sendPasswordChangeAlert = async (to, data) => {
  const html = await loadTemplate('password-change', {
    userName: data.userName,
    ipAddress: data.ipAddress,
    timestamp: data.timestamp,
    deviceInfo: data.deviceInfo || 'Unknown device'
  });
  
  return sendEmail(
    to,
    '🔒 Password Changed - Security Alert',
    html
  );
};

/**
 * Send activation key email
 */
const sendActivationEmail = async (to, data) => {
  const html = await loadTemplate('activation', {
    email: to,
    userName: data.userName,
    activationKey: data.activationKey,
    companyName: 'QUANTUM PARTNERS AND CO'
  });
  
  return sendEmail(
    to,
    '🔑 Activate Your QUANTUM PARTNERS AND CO Account',
    html
  );
};

/**
 * Send admin notification email
 */
const sendAdminNotificationEmail = async (to, data) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const html = await loadTemplate('admin-notification', {
    userName: data.userName,
    notificationTitle: data.title,
    notificationMessage: data.message,
    companyName: 'QuantumPartnersandCo',
    currentDate,
    currentTime
  });
  
  return sendEmail(
    to,
    `📢 ${data.title} - QuantumPartnersandCo`,
    html
  );
};

module.exports = {
  sendEmail,
  sendPromotionalEmail,
  sendWithdrawalNotification,
  sendDepositConfirmation,
  sendPasswordChangeAlert,
  sendActivationEmail,
  sendForgottenPasswordEmail,
  sendAdminNotificationEmail,
  loadTemplate
};