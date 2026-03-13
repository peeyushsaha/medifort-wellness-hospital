const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!config.EMAIL.user || !config.EMAIL.pass) {
    console.log('📧 Email not configured — skipping email notifications');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: config.EMAIL.host,
    port: config.EMAIL.port,
    secure: false,
    auth: {
      user: config.EMAIL.user,
      pass: config.EMAIL.pass
    }
  });
  return transporter;
}

/**
 * Send appointment confirmation email to patient.
 */
async function sendAppointmentConfirmation(appointment) {
  const t = getTransporter();
  if (!t) return;

  try {
    await t.sendMail({
      from: `"Medifort Wellness Hospital" <${config.EMAIL.from}>`,
      to: appointment.patient_email,
      subject: `Appointment Confirmation — Medifort Wellness Hospital`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0e7490, #06b6d4); padding: 32px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">🏥 Medifort Wellness Hospital</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Your appointment is confirmed!</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #0e7490; margin-top: 0;">Appointment Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #64748b;">Patient</td><td style="padding: 8px 0; font-weight: 600;">${appointment.patient_name}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Department</td><td style="padding: 8px 0; font-weight: 600;">${appointment.department}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Date</td><td style="padding: 8px 0; font-weight: 600;">${appointment.preferred_date}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Time</td><td style="padding: 8px 0; font-weight: 600;">${appointment.preferred_time || 'To be confirmed'}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Status</td><td style="padding: 8px 0; font-weight: 600; color: #f59e0b;">Pending Confirmation</td></tr>
            </table>
            <p style="margin-top: 24px; color: #64748b; font-size: 14px;">Our team will contact you shortly to confirm your appointment. For any queries, call <strong>+91-11-4567-8900</strong>.</p>
          </div>
          <div style="background: #0f172a; padding: 16px; text-align: center; color: rgba(255,255,255,0.6); font-size: 12px;">
            © 2026 Medifort Wellness Hospital Pvt Ltd. All rights reserved.
          </div>
        </div>
      `
    });
    console.log(`📧 Appointment confirmation sent to ${appointment.patient_email}`);
  } catch (err) {
    console.error('📧 Email error:', err.message);
  }
}

/**
 * Send contact form notification to admin.
 */
async function sendContactNotification(contact) {
  const t = getTransporter();
  if (!t) return;

  try {
    await t.sendMail({
      from: `"Medifort Website" <${config.EMAIL.from}>`,
      to: config.EMAIL.user,
      subject: `New Contact Message: ${contact.subject || 'No Subject'}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0e7490;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #64748b;">Name</td><td style="padding: 8px 0; font-weight: 600;">${contact.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Email</td><td style="padding: 8px 0; font-weight: 600;">${contact.email}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Subject</td><td style="padding: 8px 0; font-weight: 600;">${contact.subject || 'N/A'}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f1f5f9; border-radius: 8px;">
            <p style="margin: 0; color: #334155;">${contact.message}</p>
          </div>
        </div>
      `
    });
    console.log(`📧 Contact notification sent`);
  } catch (err) {
    console.error('📧 Email error:', err.message);
  }
}

module.exports = { sendAppointmentConfirmation, sendContactNotification };
