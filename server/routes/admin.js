const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { run, get, all } = require('../db/database');
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// All admin routes require auth + admin role
router.use(auth, admin);

/* ========== DASHBOARD STATS ========== */
router.get('/stats', (req, res) => {
  const stats = {
    totalDoctors: get('SELECT COUNT(*) as c FROM doctors').c,
    totalAppointments: get('SELECT COUNT(*) as c FROM appointments').c,
    pendingAppointments: get("SELECT COUNT(*) as c FROM appointments WHERE status = 'pending'").c,
    confirmedAppointments: get("SELECT COUNT(*) as c FROM appointments WHERE status = 'confirmed'").c,
    totalContacts: get('SELECT COUNT(*) as c FROM contacts').c,
    unreadContacts: get('SELECT COUNT(*) as c FROM contacts WHERE is_read = 0').c,
    totalPatients: get("SELECT COUNT(*) as c FROM users WHERE role = 'patient'").c,
    totalDepartments: get('SELECT COUNT(*) as c FROM departments').c,
    recentAppointments: all(`
      SELECT a.*, d.name as doctor_name
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.created_at DESC LIMIT 5
    `)
  };
  res.json(stats);
});

/* ========== APPOINTMENTS ========== */
router.get('/appointments', (req, res) => {
  const { status, department } = req.query;
  let sql = `
    SELECT a.*, d.name as doctor_name
    FROM appointments a
    LEFT JOIN doctors d ON a.doctor_id = d.id
    WHERE 1=1
  `;
  const params = [];
  if (status) { sql += ' AND a.status = ?'; params.push(status); }
  if (department) { sql += ' AND a.department = ?'; params.push(department); }
  sql += ' ORDER BY a.created_at DESC';

  res.json(all(sql, params));
});

router.patch('/appointments/:id', [
  body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const result = run('UPDATE appointments SET status = ? WHERE id = ?', [req.body.status, parseInt(req.params.id)]);
  if (result.changes === 0) return res.status(404).json({ error: 'Appointment not found.' });

  const appointment = get('SELECT * FROM appointments WHERE id = ?', [parseInt(req.params.id)]);
  res.json({ message: 'Appointment updated.', appointment });
});

router.delete('/appointments/:id', (req, res) => {
  const result = run('DELETE FROM appointments WHERE id = ?', [parseInt(req.params.id)]);
  if (result.changes === 0) return res.status(404).json({ error: 'Appointment not found.' });
  res.json({ message: 'Appointment deleted.' });
});

/* ========== CONTACTS ========== */
router.get('/contacts', (req, res) => {
  const contacts = all('SELECT * FROM contacts ORDER BY created_at DESC');
  res.json(contacts);
});

router.patch('/contacts/:id', (req, res) => {
  const result = run('UPDATE contacts SET is_read = 1 WHERE id = ?', [parseInt(req.params.id)]);
  if (result.changes === 0) return res.status(404).json({ error: 'Contact not found.' });
  res.json({ message: 'Contact marked as read.' });
});

router.delete('/contacts/:id', (req, res) => {
  const result = run('DELETE FROM contacts WHERE id = ?', [parseInt(req.params.id)]);
  if (result.changes === 0) return res.status(404).json({ error: 'Contact not found.' });
  res.json({ message: 'Contact deleted.' });
});

/* ========== DOCTORS ========== */
router.post('/doctors', [
  body('name').trim().notEmpty(),
  body('specialty').trim().notEmpty(),
  body('department').trim().notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, specialty, department, qualifications, experience, availability, availability_text, bio, avatar } = req.body;
  const result = run(
    `INSERT INTO doctors (name, specialty, department, qualifications, experience, availability, availability_text, bio, avatar)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, specialty, department, qualifications || '', experience || 0, availability || 'available', availability_text || 'Available Today', bio || '', avatar || '👨‍⚕️']
  );

  const doctor = get('SELECT * FROM doctors WHERE id = ?', [result.lastInsertRowid]);
  res.status(201).json({ message: 'Doctor added.', doctor });
});

router.put('/doctors/:id', (req, res) => {
  const { name, specialty, department, qualifications, experience, availability, availability_text, bio, avatar } = req.body;
  const result = run(
    `UPDATE doctors SET name=?, specialty=?, department=?, qualifications=?, experience=?, availability=?, availability_text=?, bio=?, avatar=?
     WHERE id=?`,
    [name, specialty, department, qualifications, experience, availability, availability_text, bio, avatar, parseInt(req.params.id)]
  );

  if (result.changes === 0) return res.status(404).json({ error: 'Doctor not found.' });
  const doctor = get('SELECT * FROM doctors WHERE id = ?', [parseInt(req.params.id)]);
  res.json({ message: 'Doctor updated.', doctor });
});

router.delete('/doctors/:id', (req, res) => {
  const result = run('DELETE FROM doctors WHERE id = ?', [parseInt(req.params.id)]);
  if (result.changes === 0) return res.status(404).json({ error: 'Doctor not found.' });
  res.json({ message: 'Doctor deleted.' });
});

module.exports = router;
