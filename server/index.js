require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');

const app = express();

/* --- Middleware --- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* --- API Routes --- */
app.use('/api', require('./routes/public'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/admin', require('./routes/admin'));

/* --- Serve admin panel --- */
app.use('/admin', express.static(path.join(__dirname, 'admin')));

/* --- Serve frontend static files --- */
app.use(express.static(path.join(__dirname, '..')));

/* --- Catch-all: serve index.html for SPA --- */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

/* --- Error handler --- */
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

/* --- Start server --- */
app.listen(config.PORT, () => {
  console.log(`\n🏥 Medifort Wellness Hospital Server`);
  console.log(`   Frontend:  http://localhost:${config.PORT}`);
  console.log(`   Admin:     http://localhost:${config.PORT}/admin`);
  console.log(`   API:       http://localhost:${config.PORT}/api\n`);
});
