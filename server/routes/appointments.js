const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { run, get, all } = require('../db/database');
const { auth, optionalAuth } = require('../middleware/auth');
const { sendAppointmentConfirmation } = require('../services/email');

/* --- POST /api/appointments --- */
router.post('/', optionalAuth, [
  body('patient_name').trim().notEmpty().withMessage('Patient name is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('preferred_date').trim().notEmpty().withMessage('Preferred date is required'),
  body('patient_phone').optional().trim(),
  body('patient_email').optional().isEmail().withMessage('Valid email is required'),
  body('doctor_id').optional().isInt(),
  body('preferred_time').optional().trim(),
  body('notes').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    patient_name, patient_phone, patient_email,
    department, doctor_id, preferred_date, preferred_time, notes
  } = req.body;

  const userId = req.user ? req.user.id : null;

  const result = run(
    `INSERT INTO appointments (user_id, patient_name, patient_phone, patient_email, department, doctor_id, preferred_date, preferred_time, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [userId, patient_name, patient_phone || null, patient_email || null,
     department, doctor_id || null, preferred_date, preferred_time || null, notes || null]
  );

  const appointment = get('SELECT * FROM appointments WHERE id = ?', [result.lastInsertRowid]);

  if (patient_email) {
    sendAppointmentConfirmation(appointment).catch(() => {});
  }

  res.status(201).json({
    message: 'Appointment booked successfully!',
    appointment
  });
});

/* --- GET /api/appointments (auth required) --- */
router.get('/', auth, (req, res) => {
  let appointments;

  if (req.user.role === 'admin') {
    appointments = all(`
      SELECT a.*, d.name as doctor_name
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.created_at DESC
    `);
  } else {
    appointments = all(`
      SELECT a.*, d.name as doctor_name
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `, [req.user.id]);
  }

  res.json(appointments);
});

/* --- GET /api/appointments/:id --- */
router.get('/:id', auth, (req, res) => {
  const appointment = get(`
    SELECT a.*, d.name as doctor_name
    FROM appointments a
    LEFT JOIN doctors d ON a.doctor_id = d.id
    WHERE a.id = ?
  `, [parseInt(req.params.id)]);

  if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });

  if (req.user.role !== 'admin' && appointment.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied.' });
  }

  res.json(appointment);
});

module.exports = router;
