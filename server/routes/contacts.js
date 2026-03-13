const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { run } = require('../db/database');
const { sendContactNotification } = require('../services/email');

/* --- POST /api/contacts --- */
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('subject').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, subject, message } = req.body;

  const result = run(
    'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name, email, subject || null, message]
  );

  sendContactNotification({ name, email, subject, message }).catch(() => {});

  res.status(201).json({
    message: 'Your message has been sent. We\'ll get back to you within 24 hours.',
    id: result.lastInsertRowid
  });
});

module.exports = router;
