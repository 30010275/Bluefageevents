const { sendEmail } = require('../config/nodemailer');

const EMAIL_FROM = process.env.EMAIL_FROM || 'Bluefage Events <noreply@bluefageevents.com>';

const sendBookingConfirmation = async ({ email, name, booking }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; text-align: center;">
        <h1 style="color: #fff; margin: 0;">Booking Confirmed!</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <p>Dear ${name},</p>
        <p>Your event booking has been received successfully. Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Event Type:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${booking.eventType}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Date:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${new Date(booking.eventDate).toLocaleDateString()}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Location:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${booking.location}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Guests:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${booking.guestCount}</td></tr>
          <tr><td style="padding: 10px;"><strong>Status:</strong></td><td style="padding: 10px;">${booking.status}</td></tr>
        </table>
        <p>We will review your booking and get back to you shortly.</p>
        <p>Best regards,<br/>Bluefage Events Team</p>
      </div>
    </div>
  `;
  return sendEmail({ to: email, subject: 'Booking Confirmation - Bluefage Events', html });
};

const sendBookingStatusUpdate = async ({ email, name, booking, status }) => {
  const statusColors = { APPROVED: '#4CAF50', REJECTED: '#f44336', COMPLETED: '#2196F3' };
  const color = statusColors[status] || '#667eea';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: ${color}; padding: 30px; text-align: center;">
        <h1 style="color: #fff; margin: 0;">Booking ${status}</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <p>Dear ${name},</p>
        <p>Your booking status has been updated to <strong>${status}</strong>.</p>
        ${booking.adminNotes ? `<p><strong>Admin Note:</strong> ${booking.adminNotes}</p>` : ''}
        <p>You can view your booking details on your dashboard.</p>
        <p>Best regards,<br/>Bluefage Events Team</p>
      </div>
    </div>
  `;
  return sendEmail({ to: email, subject: `Booking ${status} - Bluefage Events`, html });
};

const sendQuoteConfirmation = async ({ email, name, quote }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; text-align: center;">
        <h1 style="color: #fff; margin: 0;">Quote Request Received</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <p>Dear ${name},</p>
        <p>Your quotation request has been received successfully.</p>
        <p><strong>Event Type:</strong> ${quote.eventType}</p>
        <p>We will review your request and get back to you with a personalized quote within 24-48 hours.</p>
        <p>Best regards,<br/>Bluefage Events Team</p>
      </div>
    </div>
  `;
  return sendEmail({ to: email, subject: 'Quote Request Received - Bluefage Events', html });
};

const sendNewsletterConfirmation = async ({ email, name }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; text-align: center;">
        <h1 style="color: #fff; margin: 0;">Welcome to Bluefage Events!</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <p>Dear ${name || 'Subscriber'},</p>
        <p>Thank you for subscribing to our newsletter! You'll now receive updates about our latest events, packages, and offers.</p>
        <p>Stay tuned for exciting updates!</p>
        <p>Best regards,<br/>Bluefage Events Team</p>
      </div>
    </div>
  `;
  return sendEmail({ to: email, subject: 'Welcome to Bluefage Events Newsletter!', html });
};

module.exports = { sendBookingConfirmation, sendBookingStatusUpdate, sendQuoteConfirmation, sendNewsletterConfirmation };
