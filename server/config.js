require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'medifort-dev-secret',
  JWT_EXPIRES_IN: '7d',

  EMAIL: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@medifortwellness.com'
  },

  ADMIN: {
    email: process.env.ADMIN_EMAIL || 'admin@medifortwellness.com',
    password: process.env.ADMIN_PASSWORD || 'Admin123!'
  }
};
