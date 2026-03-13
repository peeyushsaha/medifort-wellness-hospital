const express = require('express');
const router = express.Router();
const { all, get } = require('../db/database');

/* --- GET /api/doctors --- */
router.get('/doctors', (req, res) => {
  const { specialty, department, search } = req.query;

  let sql = 'SELECT * FROM doctors WHERE 1=1';
  const params = [];

  if (specialty) {
    sql += ' AND specialty = ?';
    params.push(specialty);
  }
  if (department) {
    sql += ' AND department = ?';
    params.push(department);
  }
  if (search) {
    sql += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  sql += ' ORDER BY name';
  const doctors = all(sql, params);
  res.json(doctors);
});

/* --- GET /api/doctors/:id --- */
router.get('/doctors/:id', (req, res) => {
  const doctor = get('SELECT * FROM doctors WHERE id = ?', [parseInt(req.params.id)]);
  if (!doctor) return res.status(404).json({ error: 'Doctor not found.' });
  res.json(doctor);
});

/* --- GET /api/departments --- */
router.get('/departments', (req, res) => {
  const departments = all('SELECT * FROM departments ORDER BY name');
  const result = departments.map(d => ({
    ...d,
    tests: JSON.parse(d.tests_json || '[]')
  }));
  res.json(result);
});

/* --- GET /api/services --- */
router.get('/services', (req, res) => {
  const services = all('SELECT * FROM services ORDER BY id');
  const result = services.map(s => ({
    ...s,
    features: JSON.parse(s.features_json || '[]')
  }));
  res.json(result);
});

/* --- GET /api/testimonials --- */
router.get('/testimonials', (req, res) => {
  const testimonials = all('SELECT * FROM testimonials WHERE is_visible = 1 ORDER BY id');
  res.json(testimonials);
});

/* --- GET /api/faq --- */
router.get('/faq', (req, res) => {
  const faq = all('SELECT * FROM faq ORDER BY sort_order');
  res.json(faq);
});

module.exports = router;
