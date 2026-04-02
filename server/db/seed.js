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
    { id: 1, name: 'Dr. Birendra Kumar', specialty: 'Cardiology', department: 'Cardiology', qualifications: 'DM Cardiology', experience: 15, availability: 'available', availability_text: 'Available Today', bio: 'Expert cardiologist specializing in Adult Cardiology, Pediatric Cardiology, Interventional Cardiology, and Non-invasive Cardiology. Provides best-in-class cardiac care.', avatar: '👨‍⚕️' },
    { id: 2, name: 'Dr. Kiran S', specialty: 'Pediatrics & Neonatology', department: 'Pediatrics & Neonatology', qualifications: 'DCH, MD Pediatrics, Fellowship in Neonatology, Early Nutrition Specialist (Germany)', experience: 18, availability: 'available', availability_text: 'Available Today', bio: 'Senior Consultant Neonatologist & Pediatrician with specialized training in neonatal intensive care, early childhood nutrition, and developmental pediatrics.', avatar: '👨‍⚕️' }
  ];
  insertMany('doctors', doctors);

  /* --- Departments --- */
  const departments = [
    { id: 1, slug: 'cardiology', name: 'Cardiology', icon: '❤️', description: 'Comprehensive cardiac care including Adult Cardiology, Pediatric Cardiology, Interventional Cardiology, and Non-invasive Cardiology.', doctor_count: 1, tests_json: JSON.stringify(['ECG / EKG', 'Echocardiogram', 'Stress Test', 'Cardiac Catheterization', 'Holter Monitoring', 'CT Angiography', 'Lipid Profile', 'Troponin Test']) },
    { id: 2, slug: 'pediatrics-neonatology', name: 'Pediatrics & Neonatology', icon: '👶', description: 'Specialized care for infants, children, and critically ill newborns with a fully equipped life-saving NICU.', doctor_count: 1, tests_json: JSON.stringify(['Growth Assessment', 'Vaccination Panel', 'Complete Blood Count', 'Allergy Tests', 'Developmental Screening', 'Vision / Hearing Screen', 'Urine Analysis', 'Thyroid Panel']) },
    { id: 3, slug: 'oncology', name: 'Oncology', icon: '🎗️', description: 'Comprehensive cancer diagnosis and treatment with advanced chemotherapy, immunotherapy, and targeted therapies.', doctor_count: 1, tests_json: JSON.stringify(['Tumor Markers', 'PET-CT Scan', 'Biopsy', 'Bone Marrow Aspiration', 'Genetic Testing', 'MRI', 'CBC with Differential', 'Flow Cytometry']) },
    { id: 4, slug: 'gastroenterology', name: 'Gastroenterology', icon: '🫁', description: 'Expert digestive system care covering endoscopy, colonoscopy, liver disease, and advanced GI interventions.', doctor_count: 1, tests_json: JSON.stringify(['Endoscopy', 'Colonoscopy', 'Liver Function Tests', 'H. Pylori Test', 'Stool Analysis', 'Abdominal Ultrasound', 'ERCP', 'FibroScan']) },
    { id: 5, slug: 'nephrology', name: 'Nephrology', icon: '🫘', description: 'Comprehensive kidney care including dialysis, kidney disease management, and renal transplant support.', doctor_count: 1, tests_json: JSON.stringify(['Kidney Function Tests', 'Urinalysis', 'Renal Ultrasound', 'Creatinine Clearance', 'Electrolyte Panel', 'Renal Biopsy', 'GFR Test', 'Urine Protein']) },
    { id: 6, slug: 'general-surgery', name: 'General Surgery', icon: '🏥', description: 'Advanced surgical care with modern minimally invasive procedures, laparoscopic surgery, and comprehensive management.', doctor_count: 2, tests_json: JSON.stringify(['Pre-operative Assessment', 'Blood Typing', 'Coagulation Profile', 'Chest X-Ray', 'ECG', 'Ultrasound', 'CT Scan', 'Biopsy']) },
    { id: 7, slug: 'general-medicine', name: 'General Medicine', icon: '🩺', description: 'Comprehensive internal medicine services covering diagnosis, preventive care, and chronic disease management.', doctor_count: 2, tests_json: JSON.stringify(['Complete Blood Count', 'Metabolic Panel', 'Thyroid Function', 'Blood Sugar (FBS/PP)', 'HbA1c', 'Vitamin D', 'Lipid Profile', 'Liver Function Tests']) }
  ];
  insertMany('departments', departments);

  /* --- Services --- */
  const services = [
    { id: 1, name: 'Emergency Care', icon: '🚑', description: 'Round-the-clock emergency medical services with dedicated trauma care, critical care team, and rapid response capabilities.', features_json: JSON.stringify(['24/7 Emergency Room', 'Trauma Care', 'Ambulance Services', 'Critical Care Unit']) },
    { id: 2, name: 'Pharmacy', icon: '💊', description: 'In-house pharmacy with a wide range of medicines, surgical supplies, and health essentials for inpatients and outpatients.', features_json: JSON.stringify(['Wide Medicine Range', 'Surgical Supplies', 'Health Essentials', 'Insurance Support']) },
    { id: 3, name: 'Master Health Checks', icon: '🔬', description: 'Comprehensive preventive health packages. Executive Package: 50 Tests for ₹3199 including Lipid Profile, HbA1c, Thyroid Panel, and more.', features_json: JSON.stringify(['Lipid Profile', 'HbA1c & Blood Sugar', 'Thyroid Panel (T3, T4, TSH)', 'Vitamin D & Electrolytes']) },
    { id: 4, name: 'Rehabilitation Services', icon: '🏃', description: 'Holistic rehabilitation programs including physiotherapy, occupational therapy, and post-surgical recovery.', features_json: JSON.stringify(['Physiotherapy', 'Occupational Therapy', 'Post-Surgery Rehab', 'Pain Management']) },
    { id: 5, name: 'Laboratory Tests', icon: '🧪', description: 'Fully equipped laboratory offering comprehensive blood work, microbiology, and diagnostic testing.', features_json: JSON.stringify(['Automated Analyzers', 'Quick Turnaround', 'Wide Test Range', 'Online Reports']) },
    { id: 6, name: 'Ambulance Facility', icon: '🚑', description: 'Well-equipped ambulance service available round the clock for emergency patient transport with trained paramedics.', features_json: JSON.stringify(['24/7 Availability', 'Trained Paramedics', 'Life Support Equipment', 'GPS Tracked']) },
    { id: 7, name: 'International Patient Services', icon: '🌍', description: 'Dedicated support for international patients including visa assistance, language support, and care coordination.', features_json: JSON.stringify(['Visa Assistance', 'Language Support', 'Accommodation Help', 'Care Coordination']) },
    { id: 8, name: 'Insurance Support', icon: '💳', description: 'Dedicated insurance desk assisting with cashless claims, pre-authorization, and support for all major providers.', features_json: JSON.stringify(['Cashless Claims', 'Pre-authorization', 'Insurance Guidance', 'Multiple Providers']) }
  ];
  insertMany('services', services);

  /* --- Testimonials --- */
  const testimonials = [
    { id: 1, name: 'Ramesh Kumar', initials: 'RK', treatment: 'Cardiac Care', rating: 5, text: 'The cardiac team at Medifort Wellness Hospital provided exceptional care for my heart condition. Dr. Birendra Kumar and his team were thorough in their diagnosis and treatment.', is_visible: 1 },
    { id: 2, name: 'Priya Singh', initials: 'PS', treatment: 'Pediatric Care', rating: 5, text: 'Dr. Kiran S saved our premature baby\'s life with his expertise in neonatology. The NICU at Medifort is equipped with the latest technology. We are forever grateful.', is_visible: 1 },
    { id: 3, name: 'Sunita Devi', initials: 'SD', treatment: 'General Medicine', rating: 5, text: 'Medifort Wellness Hospital has been our family\'s trusted healthcare partner. The Master Health Check package is comprehensive and affordable. The staff is always caring.', is_visible: 1 }
  ];
  insertMany('testimonials', testimonials);

  /* --- FAQ --- */
  const faqData = [
    { id: 1, question: 'How do I book an appointment?', answer: 'You can book an appointment through our AI-assisted booking system on this website, by calling +91 76314 32007 / +91 89359 66820, or by visiting our reception desk at Tilkamanjhi Chowk, Bhagalpur.', sort_order: 1 },
    { id: 2, question: 'What insurance plans do you accept?', answer: 'We accept all major insurance providers. Our dedicated insurance desk assists with cashless claims and pre-authorization. Please bring your insurance card during your visit.', sort_order: 2 },
    { id: 3, question: 'What are your working hours?', answer: 'OPD hours are Monday to Saturday, 9:00 AM to 6:00 PM. Sunday is Emergency Only. Our Emergency Department operates 24/7/365.', sort_order: 3 },
    { id: 4, question: 'Do you offer emergency services?', answer: 'Yes, our Emergency Department operates 24 hours a day, 7 days a week, 365 days a year. We have dedicated emergency physicians, ambulance services, and life-saving equipment. Call +91 76314 32007 / +91 89359 66820.', sort_order: 4 },
    { id: 5, question: 'What health checkup packages do you offer?', answer: 'We offer comprehensive Master Health Check packages. Our Executive Package includes 50 tests for ₹3199, covering Lipid Profile, FBS, HbA1c, BUN, Creatinine, Electrolytes, Vitamin D, T3, T4, TSH, and more.', sort_order: 5 },
    { id: 6, question: 'Do you have a NICU facility?', answer: 'Yes, we have a fully equipped life-saving NICU managed by our Senior Consultant Neonatologist Dr. Kiran S. The NICU is equipped with the latest technology for critically ill newborns.', sort_order: 6 },
    { id: 7, question: 'What specialties are available?', answer: 'We offer multi-specialty care including Cardiology, Pediatrics & Neonatology, Oncology, Gastroenterology, Nephrology, General Surgery, and General Medicine.', sort_order: 7 },
    { id: 8, question: 'Where is the hospital located?', answer: 'Medifort Wellness Hospital is located at Hotel Shishmahal Lane, Tilkamanjhi Chowk, Narayana Colony, Bhagalpur, Bihar 812001.', sort_order: 8 }
  ];
  insertMany('faq', faqData);

  /* --- Admin user --- */
  const existing = get('SELECT id FROM users WHERE email = ?', [config.ADMIN.email]);
  if (!existing) {
    const adminHash = bcrypt.hashSync(config.ADMIN.password, 10);
    run('INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      ['Admin', config.ADMIN.email, '+91 76314 32007', adminHash, 'admin']);
    console.log(`  ✅ users: admin (${config.ADMIN.email})`);
  } else {
    console.log(`  ℹ️  users: admin already exists`);
  }

  console.log('\n🎉 Seed complete!');
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
