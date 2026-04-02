/* ============================================
   DATA LAYER — Fetches from API with fallback
   to hardcoded data for static file:// usage
   ============================================ */

/* --- Hardcoded fallback data (Real hospital data) --- */
const DOCTORS_FALLBACK = [
  { id: 1, name: 'Dr. Birendra Kumar', specialty: 'Cardiology', department: 'Cardiology', qualifications: 'DM Cardiology', experience: 15, availability: 'available', availabilityText: 'Available Today', bio: 'Expert cardiologist specializing in Adult Cardiology, Pediatric Cardiology, Interventional Cardiology, and Non-invasive Cardiology. Provides best-in-class cardiac care including complex angioplasty and preventive cardiology.', avatar: '👨‍⚕️' },
  { id: 2, name: 'Dr. Kiran S', specialty: 'Pediatrics & Neonatology', department: 'Pediatrics & Neonatology', qualifications: 'DCH, MD Pediatrics, Fellowship in Neonatology, Early Nutrition Specialist (Germany)', experience: 18, availability: 'available', availabilityText: 'Available Today', bio: 'Senior Consultant Neonatologist & Pediatrician with specialized training in neonatal intensive care, early childhood nutrition, and developmental pediatrics. Fellowship-trained from Germany in Early Nutrition.', avatar: '👨‍⚕️' }
];

const DEPARTMENTS_FALLBACK = [
  { id: 'cardiology', name: 'Cardiology', icon: '❤️', description: 'Comprehensive cardiac care including Adult Cardiology, Pediatric Cardiology, Interventional Cardiology, and Non-invasive Cardiology. Best cardiology care for all heart problems.', doctorCount: 1, tests: ['ECG / EKG', 'Echocardiogram', 'Stress Test', 'Cardiac Catheterization', 'Holter Monitoring', 'CT Angiography', 'Lipid Profile', 'Troponin Test'] },
  { id: 'pediatrics-neonatology', name: 'Pediatrics & Neonatology', icon: '👶', description: 'Specialized care for infants, children, and critically ill newborns with a fully equipped life-saving NICU. From routine check-ups to neonatal intensive care.', doctorCount: 1, tests: ['Growth Assessment', 'Vaccination Panel', 'Complete Blood Count', 'Allergy Tests', 'Developmental Screening', 'Vision / Hearing Screen', 'Urine Analysis', 'Thyroid Panel'] },
  { id: 'oncology', name: 'Oncology', icon: '🎗️', description: 'Comprehensive cancer diagnosis and treatment with advanced chemotherapy, immunotherapy, and targeted therapies for all types of cancers.', doctorCount: 1, tests: ['Tumor Markers', 'PET-CT Scan', 'Biopsy', 'Bone Marrow Aspiration', 'Genetic Testing', 'MRI', 'CBC with Differential', 'Flow Cytometry'] },
  { id: 'gastroenterology', name: 'Gastroenterology', icon: '🫁', description: 'Expert digestive system care covering endoscopy, colonoscopy, liver disease, inflammatory bowel disease, and advanced GI interventions.', doctorCount: 1, tests: ['Endoscopy', 'Colonoscopy', 'Liver Function Tests', 'H. Pylori Test', 'Stool Analysis', 'Abdominal Ultrasound', 'ERCP', 'FibroScan'] },
  { id: 'nephrology', name: 'Nephrology', icon: '🫘', description: 'Comprehensive kidney care including dialysis, kidney disease management, electrolyte disorders, and renal transplant support.', doctorCount: 1, tests: ['Kidney Function Tests', 'Urinalysis', 'Renal Ultrasound', 'Creatinine Clearance', 'Electrolyte Panel', 'Renal Biopsy', 'GFR Test', 'Urine Protein'] },
  { id: 'general-surgery', name: 'General Surgery', icon: '🏥', description: 'Advanced surgical care with modern minimally invasive procedures, laparoscopic surgery, and comprehensive pre- and post-operative management.', doctorCount: 2, tests: ['Pre-operative Assessment', 'Blood Typing', 'Coagulation Profile', 'Chest X-Ray', 'ECG', 'Ultrasound', 'CT Scan', 'Biopsy'] },
  { id: 'general-medicine', name: 'General Medicine', icon: '🩺', description: 'Comprehensive internal medicine services covering diagnosis and treatment of a wide range of conditions, preventive care, and chronic disease management.', doctorCount: 2, tests: ['Complete Blood Count', 'Metabolic Panel', 'Thyroid Function', 'Blood Sugar (FBS/PP)', 'HbA1c', 'Vitamin D', 'Lipid Profile', 'Liver Function Tests'] }
];

const SERVICES_FALLBACK = [
  { id: 1, name: 'Emergency Care', icon: '🚑', description: 'Round-the-clock emergency medical services with dedicated trauma care, critical care team, and rapid response capabilities. Always open, 24/7.', features: ['24/7 Emergency Room', 'Trauma Care', 'Ambulance Services', 'Critical Care Unit'] },
  { id: 2, name: 'Pharmacy', icon: '💊', description: 'In-house pharmacy with a wide range of medicines, surgical supplies, and health essentials available for inpatients and outpatients.', features: ['Wide Medicine Range', 'Surgical Supplies', 'Health Essentials', 'Insurance Support'] },
  { id: 3, name: 'Master Health Checks', icon: '🔬', description: 'Comprehensive preventive health packages tailored for different age groups and risk profiles. Executive Package: 50 Tests for ₹3199.', features: ['Lipid Profile', 'HbA1c & Blood Sugar', 'Thyroid Panel (T3, T4, TSH)', 'Vitamin D & Electrolytes'] },
  { id: 4, name: 'Rehabilitation Services', icon: '🏃', description: 'Holistic rehabilitation programs including physiotherapy, occupational therapy, and post-surgical recovery to help patients return to normal life.', features: ['Physiotherapy', 'Occupational Therapy', 'Post-Surgery Rehab', 'Pain Management'] },
  { id: 5, name: 'Laboratory Tests', icon: '🧪', description: 'Fully equipped laboratory offering comprehensive blood work, microbiology, and diagnostic testing with quick turnaround times.', features: ['Automated Analyzers', 'Quick Turnaround', 'Wide Test Range', 'Online Reports'] },
  { id: 6, name: 'Ambulance Facility', icon: '🚑', description: 'Well-equipped ambulance service available round the clock for emergency patient transport with trained paramedic staff.', features: ['24/7 Availability', 'Trained Paramedics', 'Life Support Equipment', 'GPS Tracked'] },
  { id: 7, name: 'International Patient Services', icon: '🌍', description: 'Dedicated support for international patients including visa assistance, language support, accommodation, and personalized care coordination.', features: ['Visa Assistance', 'Language Support', 'Accommodation Help', 'Care Coordination'] },
  { id: 8, name: 'Insurance Support', icon: '💳', description: 'Dedicated insurance desk assisting with cashless claims, pre-authorization, and support for all major insurance providers.', features: ['Cashless Claims', 'Pre-authorization', 'Insurance Guidance', 'Multiple Providers'] }
];

const TESTIMONIALS_FALLBACK = [
  { id: 1, name: 'Ramesh Kumar', initials: 'RK', treatment: 'Cardiac Care', rating: 5, text: 'The cardiac team at Medifort Wellness Hospital provided exceptional care for my heart condition. Dr. Birendra Kumar and his team were thorough in their diagnosis and treatment. The NICU facility is truly world-class.' },
  { id: 2, name: 'Priya Singh', initials: 'PS', treatment: 'Pediatric Care', rating: 5, text: 'Dr. Kiran S saved our premature baby\'s life with his expertise in neonatology. The NICU at Medifort is equipped with the latest technology. We are forever grateful to the entire pediatric team.' },
  { id: 3, name: 'Sunita Devi', initials: 'SD', treatment: 'General Medicine', rating: 5, text: 'Medifort Wellness Hospital has been our family\'s trusted healthcare partner. The Master Health Check package is comprehensive and affordable. The staff is always caring and professional.' }
];

const FAQ_DATA_FALLBACK = [
  { question: 'How do I book an appointment?', answer: 'You can book an appointment through our AI-assisted booking system on this website, by calling +91 76314 32007 / +91 89359 66820, or by visiting our reception desk at Tilkamanjhi Chowk, Bhagalpur. Our online booking is available 24/7 and provides instant confirmation.' },
  { question: 'What insurance plans do you accept?', answer: 'We accept all major insurance providers. Our dedicated insurance desk assists with cashless claims and pre-authorization. Please bring your insurance card during your visit for seamless processing.' },
  { question: 'What are your working hours?', answer: 'Our OPD working hours are Monday to Saturday, 9:00 AM to 6:00 PM. Sunday is Emergency Only. Our Emergency Department operates 24 hours a day, 7 days a week, 365 days a year.' },
  { question: 'Do you offer emergency services?', answer: 'Yes, our Emergency Department operates 24 hours a day, 7 days a week, 365 days a year. We have dedicated emergency physicians, ambulance services, and life-saving equipment. For emergencies, call +91 76314 32007 / +91 89359 66820.' },
  { question: 'What health checkup packages do you offer?', answer: 'We offer comprehensive Master Health Check packages. Our Executive Package includes 50 tests for ₹3199, covering Lipid Profile, FBS, HbA1c, BUN, Creatinine, Electrolytes, Vitamin D, T3, T4, TSH, and more.' },
  { question: 'Do you have a NICU facility?', answer: 'Yes, we have a fully equipped life-saving NICU (Neonatal Intensive Care Unit) managed by our Senior Consultant Neonatologist Dr. Kiran S. The NICU is equipped with the latest technology for caring for critically ill newborns.' },
  { question: 'What specialties are available?', answer: 'We offer multi-specialty care including Cardiology, Pediatrics & Neonatology, Oncology, Gastroenterology, Nephrology, General Surgery, and General Medicine. Each department is staffed with experienced specialists.' },
  { question: 'Where is the hospital located?', answer: 'Medifort Wellness Hospital is located at Hotel Shishmahal Lane, Tilkamanjhi Chowk, Narayana Colony, Bhagalpur, Bihar 812001. We are easily accessible and have parking facilities available.' }
];

/* --- Live data (populated from API or fallback) --- */
let DOCTORS = DOCTORS_FALLBACK;
let DEPARTMENTS = DEPARTMENTS_FALLBACK;
let SERVICES = SERVICES_FALLBACK;
let TESTIMONIALS = TESTIMONIALS_FALLBACK;
let FAQ_DATA = FAQ_DATA_FALLBACK;

/* --- API helper --- */
const API_BASE = window.location.protocol === 'file:' ? null : window.location.origin + '/api';

async function fetchData(endpoint, fallback) {
  if (!API_BASE) return fallback;
  try {
    const res = await fetch(`${API_BASE}/${endpoint}`);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    return fallback;
  }
}

/**
 * Load all data from API (or fallback to hardcoded).
 * Normalizes API field names to match what frontend components expect.
 */
async function loadAllData() {
  const [doctors, departments, services, testimonials, faq] = await Promise.all([
    fetchData('doctors', DOCTORS_FALLBACK),
    fetchData('departments', DEPARTMENTS_FALLBACK),
    fetchData('services', SERVICES_FALLBACK),
    fetchData('testimonials', TESTIMONIALS_FALLBACK),
    fetchData('faq', FAQ_DATA_FALLBACK)
  ]);

  // Normalize API response field names to match what components expect
  DOCTORS = doctors.map(d => ({
    ...d,
    availabilityText: d.availabilityText || d.availability_text || 'Available',
  }));
  DEPARTMENTS = departments.map(d => ({
    ...d,
    doctorCount: d.doctorCount || d.doctor_count || 0,
    tests: d.tests || JSON.parse(d.tests_json || '[]')
  }));
  SERVICES = services.map(s => ({
    ...s,
    features: s.features || JSON.parse(s.features_json || '[]')
  }));
  TESTIMONIALS = testimonials;
  FAQ_DATA = faq;
}

/* --- Auth state --- */
const Auth = {
  token: localStorage.getItem('medifort_token'),
  user: JSON.parse(localStorage.getItem('medifort_user') || 'null'),

  isLoggedIn() { return !!this.token; },

  setSession(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('medifort_token', token);
    localStorage.setItem('medifort_user', JSON.stringify(user));
  },

  clearSession() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('medifort_token');
    localStorage.removeItem('medifort_user');
  },

  headers() {
    const h = { 'Content-Type': 'application/json' };
    if (this.token) h['Authorization'] = `Bearer ${this.token}`;
    return h;
  }
};
