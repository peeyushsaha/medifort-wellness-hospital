/**
 * Seed script — migrates hardcoded data from the frontend into SQLite.
 * Run once: npm run seed
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const bcrypt = require('bcryptjs');
const { initDb, run, get } = require('./database');
const config = require('../config');

async function seed() {
  await initDb();

  console.log('🌱 Seeding database...\n');

  /* --- Helper --- */
  function insertMany(table, rows) {
    if (rows.length === 0) return;
    const cols = Object.keys(rows[0]);
    const placeholders = cols.map(() => '?').join(', ');
    let count = 0;
    for (const item of rows) {
      try {
        run(`INSERT OR IGNORE INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`,
          cols.map(c => item[c]));
        count++;
      } catch (e) {
        // Ignore duplicates
      }
    }
    console.log(`  ✅ ${table}: ${count} rows`);
  }

  /* --- Doctors --- */
  const doctors = [
    { id: 1, name: 'Dr. Aisha Sharma', specialty: 'Cardiology', department: 'Cardiology', qualifications: 'MD, DM (Cardiology), FACC', experience: 18, availability: 'available', availability_text: 'Available Today', bio: 'Leading interventional cardiologist with expertise in complex angioplasty, structural heart disease, and preventive cardiology.', avatar: '👩‍⚕️' },
    { id: 2, name: 'Dr. Rajesh Kumar', specialty: 'Orthopedics', department: 'Orthopedics', qualifications: 'MS (Ortho), DNB, Fellowship in Joint Replacement', experience: 22, availability: 'available', availability_text: 'Available Today', bio: 'Renowned orthopedic surgeon specializing in total joint replacement, sports medicine, and minimally invasive surgery.', avatar: '👨‍⚕️' },
    { id: 3, name: 'Dr. Priya Patel', specialty: 'Neurology', department: 'Neurology', qualifications: 'MD, DM (Neurology), Fellowship in Epilepsy', experience: 15, availability: 'available', availability_text: 'Available Tomorrow', bio: 'Expert neurologist specializing in epilepsy management, stroke care, and neurodegenerative disorders.', avatar: '👩‍⚕️' },
    { id: 4, name: 'Dr. Vikram Singh', specialty: 'Pediatrics', department: 'Pediatrics', qualifications: 'MD (Pediatrics), Fellowship in Neonatology', experience: 20, availability: 'available', availability_text: 'Available Today', bio: 'Compassionate pediatrician with special interest in neonatal care, childhood development, and pediatric critical care.', avatar: '👨‍⚕️' },
    { id: 5, name: 'Dr. Meera Joshi', specialty: 'Gynecology', department: 'Gynecology', qualifications: 'MS (OB/GYN), DNB, Fellowship in Reproductive Medicine', experience: 16, availability: 'available', availability_text: 'Available Today', bio: 'Expert gynecologist and obstetrician specializing in high-risk pregnancies, laparoscopic surgery, and fertility treatments.', avatar: '👩‍⚕️' },
    { id: 6, name: 'Dr. Arjun Reddy', specialty: 'Dermatology', department: 'Dermatology', qualifications: 'MD (Dermatology), Fellowship in Cosmetic Dermatology', experience: 12, availability: 'busy', availability_text: 'Next Available: Mon', bio: 'Board-certified dermatologist specializing in clinical and cosmetic dermatology, skin cancer screening, and laser treatments.', avatar: '👨‍⚕️' },
    { id: 7, name: 'Dr. Sneha Gupta', specialty: 'Oncology', department: 'Oncology', qualifications: 'MD, DM (Medical Oncology), Fellowship in Precision Medicine', experience: 14, availability: 'available', availability_text: 'Available Today', bio: 'Leading oncologist with expertise in targeted therapy, immunotherapy, and comprehensive cancer care management.', avatar: '👩‍⚕️' },
    { id: 8, name: 'Dr. Karthik Nair', specialty: 'Gastroenterology', department: 'Gastroenterology', qualifications: 'MD, DM (Gastro), Fellowship in Advanced Endoscopy', experience: 17, availability: 'available', availability_text: 'Available Tomorrow', bio: 'Expert gastroenterologist specializing in therapeutic endoscopy, inflammatory bowel disease, and liver disorders.', avatar: '👨‍⚕️' }
  ];
  insertMany('doctors', doctors);

  /* --- Departments --- */
  const departments = [
    { id: 1, slug: 'cardiology', name: 'Cardiology', icon: '❤️', description: 'Comprehensive cardiac care from diagnosis to intervention, including advanced catheterization and cardiac rehabilitation.', doctor_count: 5, tests_json: JSON.stringify(['ECG / EKG', 'Echocardiogram', 'Stress Test', 'Cardiac Catheterization', 'Holter Monitoring', 'CT Angiography', 'Lipid Profile', 'Troponin Test']) },
    { id: 2, slug: 'orthopedics', name: 'Orthopedics', icon: '🦴', description: 'Advanced bone and joint care including joint replacement, sports medicine, and minimally invasive orthopedic surgery.', doctor_count: 4, tests_json: JSON.stringify(['X-Ray', 'MRI Scan', 'Bone Density (DEXA)', 'Arthroscopy', 'CT Scan', 'Joint Aspiration', 'EMG / NCV', 'Ultrasound']) },
    { id: 3, slug: 'neurology', name: 'Neurology', icon: '🧠', description: 'Expert neurological care for stroke, epilepsy, Parkinson\'s, Alzheimer\'s, and all conditions of the nervous system.', doctor_count: 3, tests_json: JSON.stringify(['EEG', 'MRI Brain', 'CT Head', 'Nerve Conduction Study', 'Lumbar Puncture', 'Carotid Doppler', 'PET Scan', 'Neuropsych Testing']) },
    { id: 4, slug: 'pediatrics', name: 'Pediatrics', icon: '👶', description: 'Compassionate child healthcare from newborns to adolescents, including well-child care, immunizations, and developmental assessment.', doctor_count: 4, tests_json: JSON.stringify(['Growth Assessment', 'Vaccination Panel', 'Complete Blood Count', 'Allergy Tests', 'Developmental Screening', 'Vision / Hearing Screen', 'Urine Analysis', 'Thyroid Panel']) },
    { id: 5, slug: 'gynecology', name: 'Gynecology & Obstetrics', icon: '🤱', description: 'Complete women\'s health services: prenatal care, high-risk pregnancy management, laparoscopic surgery, and fertility treatments.', doctor_count: 5, tests_json: JSON.stringify(['Ultrasound (OB)', 'Pap Smear', 'Mammography', 'Hormone Panel', 'Amniocentesis', 'Non-Stress Test', 'TORCH Panel', 'Bone Density']) },
    { id: 6, slug: 'dermatology', name: 'Dermatology', icon: '🩺', description: 'Clinical and cosmetic skin care including acne treatment, skin cancer screening, laser therapy, and aesthetic procedures.', doctor_count: 3, tests_json: JSON.stringify(['Skin Biopsy', 'Patch Test', 'Dermoscopy', 'KOH Test', 'Wood\'s Lamp', 'Allergy Panel', 'ANA Test', 'Photo-testing']) },
    { id: 7, slug: 'oncology', name: 'Oncology', icon: '🎗️', description: 'Comprehensive cancer diagnosis and treatment with state-of-the-art chemotherapy, immunotherapy, and targeted therapies.', doctor_count: 4, tests_json: JSON.stringify(['Tumor Markers', 'PET-CT Scan', 'Biopsy', 'Bone Marrow Aspiration', 'Genetic Testing', 'MRI', 'CBC with Differential', 'Flow Cytometry']) },
    { id: 8, slug: 'gastroenterology', name: 'Gastroenterology', icon: '🫁', description: 'Digestive health expertise covering endoscopy, colonoscopy, liver disease, IBD, and advanced GI interventions.', doctor_count: 3, tests_json: JSON.stringify(['Endoscopy', 'Colonoscopy', 'Liver Function Tests', 'H. Pylori Test', 'Stool Analysis', 'Abdominal Ultrasound', 'ERCP', 'FibroScan']) }
  ];
  insertMany('departments', departments);

  /* --- Services --- */
  const services = [
    { id: 1, name: 'Emergency Care', icon: '🚑', description: 'Round-the-clock emergency medical services with a dedicated trauma center, critical care team, and rapid response capabilities.', features_json: JSON.stringify(['24/7 Emergency Room', 'Trauma Center', 'Ambulance Services', 'Critical Care Unit']) },
    { id: 2, name: 'Diagnostic Imaging', icon: '📷', description: 'State-of-the-art imaging technology including MRI, CT, X-Ray, ultrasound, and nuclear medicine for accurate diagnostics.', features_json: JSON.stringify(['3T MRI Scanner', 'CT Angiography', 'Digital X-Ray', 'Doppler Ultrasound']) },
    { id: 3, name: 'Laboratory Services', icon: '🔬', description: 'NABL-accredited pathology lab offering comprehensive blood work, microbiology, histopathology, and molecular diagnostics.', features_json: JSON.stringify(['Automated Analyzers', 'Quick Turnaround', 'Home Sample Collection', 'Online Reports']) },
    { id: 4, name: 'Surgical Excellence', icon: '🏥', description: 'Advanced surgical suites equipped for minimally invasive, robotic-assisted, and complex multi-organ surgical procedures.', features_json: JSON.stringify(['Robotic Surgery', 'Laparoscopic Suite', 'Modular ICU', 'Post-op Recovery']) },
    { id: 5, name: 'Rehabilitation Center', icon: '🏃', description: 'Holistic rehabilitation programs including physiotherapy, occupational therapy, speech therapy, and cardiac rehabilitation.', features_json: JSON.stringify(['Physiotherapy', 'Occupational Therapy', 'Speech Therapy', 'Cardiac Rehab']) },
    { id: 6, name: 'Health Checkups', icon: '💊', description: 'Comprehensive preventive health packages tailored for different age groups, risk profiles, and corporate wellness needs.', features_json: JSON.stringify(['Executive Packages', 'Women\'s Health Checks', 'Cardiac Screening', 'Cancer Screening']) },
    { id: 7, name: 'Telemedicine', icon: '💻', description: 'Virtual consultations with our specialists from the comfort of your home, with digital prescriptions and follow-up scheduling.', features_json: JSON.stringify(['Video Consultations', 'E-Prescriptions', 'Follow-up Scheduling', 'Secure Platform']) },
    { id: 8, name: 'Pharmacy', icon: '💉', description: 'In-house pharmacy with a wide range of medicines, surgical supplies, and health essentials available 24/7 for inpatients and outpatients.', features_json: JSON.stringify(['24/7 Availability', 'Home Delivery', 'Generic Options', 'Insurance Support']) }
  ];
  insertMany('services', services);

  /* --- Testimonials --- */
  const testimonials = [
    { id: 1, name: 'Ananya Verma', initials: 'AV', treatment: 'Cardiac Surgery', rating: 5, text: 'The cardiac team at Medifort saved my father\'s life. From the emergency admission to post-surgery care, every single person was professional, caring, and reassuring. We couldn\'t have asked for better treatment.', is_visible: 1 },
    { id: 2, name: 'Mohammed Ali', initials: 'MA', treatment: 'Knee Replacement', rating: 5, text: 'Dr. Rajesh Kumar performed my total knee replacement and the results are incredible. I\'m walking pain-free for the first time in years. The rehab team was equally amazing. Truly world-class orthopedic care.', is_visible: 1 },
    { id: 3, name: 'Sunita Devi', initials: 'SD', treatment: 'Maternity Care', rating: 5, text: 'My entire pregnancy journey with Medifort was wonderful. Dr. Meera Joshi and her team provided exceptional prenatal care through a high-risk pregnancy. The delivery suite and NICU facilities are outstanding.', is_visible: 1 }
  ];
  insertMany('testimonials', testimonials);

  /* --- FAQ --- */
  const faqData = [
    { id: 1, question: 'How do I book an appointment?', answer: 'You can book an appointment through our AI-assisted booking system on this website, by calling +91-11-4567-8900, or by visiting our reception desk. Our online booking is available 24/7 and provides instant confirmation.', sort_order: 1 },
    { id: 2, question: 'What insurance plans do you accept?', answer: 'We accept all major insurance providers including Star Health, Max Bupa, ICICI Lombard, HDFC Ergo, and many more. Our dedicated insurance desk assists with cashless claims and pre-authorization. Please bring your insurance card during your visit.', sort_order: 2 },
    { id: 3, question: 'What are your visiting hours?', answer: 'General visiting hours are from 10:00 AM to 12:00 PM and 4:00 PM to 6:00 PM daily. ICU visiting is limited to 11:00 AM – 12:00 PM and 5:00 PM – 6:00 PM with a maximum of two visitors. Special accommodations can be made for critical patients.', sort_order: 3 },
    { id: 4, question: 'Do you offer emergency services?', answer: 'Yes, our Emergency Department operates 24 hours a day, 7 days a week, 365 days a year. We have a fully equipped trauma center, dedicated emergency physicians, and ambulance services. For emergencies, call our emergency helpline at +91-11-4567-8911.', sort_order: 4 },
    { id: 5, question: 'How can I access my medical records?', answer: 'Medical records can be accessed through our Patient Portal (launching soon). In the meantime, you can request records at our Medical Records department on the ground floor, or email medicalrecords@medifortwellness.com. Records are typically ready within 48 business hours.', sort_order: 5 },
    { id: 6, question: 'Do you provide home sample collection for lab tests?', answer: 'Yes, we offer home sample collection services across the city. You can book a home collection through our website, call our lab helpline, or schedule during your outpatient visit. Samples are collected by trained phlebotomists and reports are available online within 24 hours.', sort_order: 6 },
    { id: 7, question: 'What telemedicine options are available?', answer: 'We offer video consultations with most of our specialists through our secure telemedicine platform. You can book a virtual appointment the same way as an in-person visit. E-prescriptions and digital reports are provided after each consultation.', sort_order: 7 },
    { id: 8, question: 'Is parking available at the hospital?', answer: 'Yes, we have a multi-level parking facility with over 500 spaces, including accessible parking spots near the entrance. Parking is complimentary for the first 2 hours for outpatient visits. Valet parking is also available at the main entrance.', sort_order: 8 }
  ];
  insertMany('faq', faqData);

  /* --- Admin user --- */
  const existing = get('SELECT id FROM users WHERE email = ?', [config.ADMIN.email]);
  if (!existing) {
    const adminHash = bcrypt.hashSync(config.ADMIN.password, 10);
    run('INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      ['Admin', config.ADMIN.email, '+91-11-4567-8900', adminHash, 'admin']);
    console.log(`  ✅ users: admin (${config.ADMIN.email})`);
  } else {
    console.log(`  ℹ️  users: admin already exists`);
  }

  console.log('\n🎉 Seed complete!');
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
