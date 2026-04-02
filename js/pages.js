/* ============================================
   PAGE RENDERERS
   ============================================ */

const Pages = {

  /* ========== HOME ========== */
  home() {
    return `
      <div class="page-content">
        <!-- TRUST BAR -->
        <section class="trust-bar" aria-label="Trust indicators">
          <div class="container">
            <div class="trust-items">
              <div class="trust-item reveal">
                <div class="trust-icon">🏆</div>
                <div class="trust-text">
                  <h4>Multi-Speciality</h4>
                  <p>7 specialist departments</p>
                </div>
              </div>
              <div class="trust-item reveal">
                <div class="trust-icon">👨‍⚕️</div>
                <div class="trust-text">
                  <h4>Expert Specialists</h4>
                  <p>Experienced doctors across specialties</p>
                </div>
              </div>
              <div class="trust-item reveal">
                <div class="trust-icon">🕐</div>
                <div class="trust-text">
                  <h4>24/7 Care</h4>
                  <p>Emergency services around the clock</p>
                </div>
              </div>
              <div class="trust-item reveal">
                <div class="trust-icon">💳</div>
                <div class="trust-text">
                  <h4>Insurance Support</h4>
                  <p>Cashless claims & insurance assistance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SERVICES PREVIEW -->
        <section class="section services-preview" aria-label="Our services">
          <div class="container">
            <div class="section-header">
              <div class="section-label">What We Offer</div>
              <h2 class="section-title">Our Core Services</h2>
              <p class="section-subtitle">Comprehensive healthcare solutions powered by advanced technology and compassionate expertise.</p>
            </div>
            <div class="services-grid">
              ${SERVICES.slice(0, 6).map(s => `
                <div class="service-preview-card reveal">
                  <div class="service-preview-icon"><span>${s.icon}</span></div>
                  <h3>${s.name}</h3>
                  <p>${s.description.substring(0, 120)}…</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- WHY CHOOSE US -->
        <section class="section why-us" aria-label="Why choose Medifort">
          <div class="container">
            <div class="why-us-grid">
              <div class="why-us-content reveal-left">
                <div class="section-label">Why Medifort</div>
                <h2>Why Patients Trust Us</h2>
                <p>For over two decades, Medifort Wellness has been the region's most trusted name in healthcare, combining clinical excellence with genuine compassion.</p>
                <div class="why-us-items">
                  <div class="why-us-item">
                    <div class="why-us-item-icon">🎯</div>
                    <div>
                      <h4>Precision Medicine</h4>
                      <p>Personalized treatment plans using the latest diagnostic technology</p>
                    </div>
                  </div>
                  <div class="why-us-item">
                    <div class="why-us-item-icon">🤝</div>
                    <div>
                      <h4>Patient-First Approach</h4>
                      <p>Every decision centered around patient comfort and recovery</p>
                    </div>
                  </div>
                  <div class="why-us-item">
                    <div class="why-us-item-icon">🌟</div>
                    <div>
                      <h4>Expert Team</h4>
                      <p>Internationally trained doctors with decades of experience</p>
                    </div>
                  </div>
                  <div class="why-us-item">
                    <div class="why-us-item-icon">🏗️</div>
                    <div>
                      <h4>Modern Infrastructure</h4>
                      <p>State-of-the-art facilities designed for optimal patient outcomes</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="why-us-visual reveal-right">
                <div class="why-us-image-wrapper">
                  <span class="placeholder-visual">🏥</span>
                </div>
                <div class="why-us-floating-card">
                  <div class="number">98%</div>
                  <div>
                    <div class="label" style="font-weight:600; color:var(--text);">Patient Satisfaction</div>
                    <div class="label">Based on 10,000+ reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- DEPARTMENT HIGHLIGHTS (Interactive hover) -->
        <section class="section" style="background:var(--surface);" aria-label="Departments">
          <div class="container">
            <div class="section-header">
              <div class="section-label">Our Specialties</div>
              <h2 class="section-title">Departments of Excellence</h2>
              <p class="section-subtitle">Hover over any department to explore available tests and procedures.</p>
            </div>
            <div class="departments-grid">
              ${DEPARTMENTS.slice(0, 4).map(d => Components.departmentCard(d)).join('')}
            </div>
            <div style="text-align:center; margin-top:var(--space-8);">
              <a href="#" class="btn btn-primary" data-page="departments">View All Departments</a>
            </div>
          </div>
        </section>

        <!-- TESTIMONIALS -->
        <section class="section testimonials" aria-label="Patient testimonials">
          <div class="container">
            <div class="section-header">
              <div class="section-label">Patient Stories</div>
              <h2 class="section-title">What Our Patients Say</h2>
              <p class="section-subtitle">Real stories from real patients who trusted us with their care.</p>
            </div>
            <div class="testimonial-grid">
              ${TESTIMONIALS.map(t => Components.testimonialCard(t)).join('')}
            </div>
          </div>
        </section>

        <!-- CTA BANNER -->
        <section class="cta-banner" aria-label="Book appointment call to action">
          <div class="container">
            <h2>Ready to Experience Better Healthcare?</h2>
            <p>Book your appointment today — online in under 2 minutes with our AI assistant.</p>
            <a href="#" class="btn btn-accent btn-lg" data-page="appointment">
              Book Your Appointment Now
            </a>
          </div>
        </section>
      </div>
    `;
  },

  /* ========== ABOUT ========== */
  about() {
    return `
      <div class="page-content about-page">
        <div class="container section">
          <div class="about-banner reveal-scale">
            <h1>About Medifort Wellness</h1>
            <p>Two decades of healing, innovation, and unwavering commitment to our community's health.</p>
          </div>

          <div class="about-story">
            <div class="about-story-content reveal-left">
              <div class="section-label">Our Story</div>
              <h2>A Mission for Complete Wellbeing</h2>
              <p>Medifort Wellness Hospital is a 75-bed multi-speciality hospital established with a singular mission — to establish a healthy society through excellent delivery of the most advanced healthcare services and promote preventive healthcare awareness.</p>
              <p>Our vision is a healthy society powered by initiatives that protect both the body and the mind. We combine modern facilities with advanced minimally invasive procedures to deliver the best patient outcomes.</p>
              <p>Today, we are one of Bhagalpur's most trusted healthcare institutions, housing a fully equipped life-saving NICU, advanced diagnostic facilities, and specialist departments covering Cardiology, Pediatrics & Neonatology, Oncology, Gastroenterology, Nephrology, and more.</p>
            </div>
            <div class="about-story-visual reveal-right">
              <span class="placeholder-visual">🏥</span>
            </div>
          </div>

          <div class="about-values">
            <div class="section-header">
              <div class="section-label">Our Values</div>
              <h2 class="section-title">What Drives Us</h2>
            </div>
            <div class="values-grid">
              <div class="value-card reveal">
                <div class="value-icon">💖</div>
                <h3>Compassion</h3>
                <p>We treat every patient like family, providing empathetic care that addresses not just the body, but the mind and spirit.</p>
              </div>
              <div class="value-card reveal">
                <div class="value-icon">🔬</div>
                <h3>Innovation</h3>
                <p>We continually invest in the latest medical technology and research to offer our patients the most advanced treatments available.</p>
              </div>
              <div class="value-card reveal">
                <div class="value-icon">🤲</div>
                <h3>Integrity</h3>
                <p>Transparency and honesty guide every clinical decision, ensuring our patients always receive care they can trust.</p>
              </div>
            </div>
          </div>

          <div class="section-header">
            <div class="section-label">By the Numbers</div>
            <h2 class="section-title">Our Milestones</h2>
          </div>
          <div class="milestones-grid">
            <div class="milestone-card reveal">
              <div class="milestone-number">75</div>
              <div class="milestone-label">Hospital Beds</div>
            </div>
            <div class="milestone-card reveal">
              <div class="milestone-number">7</div>
              <div class="milestone-label">Specialist Departments</div>
            </div>
            <div class="milestone-card reveal">
              <div class="milestone-number">50+</div>
              <div class="milestone-label">Health Tests Available</div>
            </div>
            <div class="milestone-card reveal">
              <div class="milestone-number">24/7</div>
              <div class="milestone-label">Emergency Services</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* ========== DEPARTMENTS ========== */
  departments() {
    return `
      <div class="page-content departments-page">
        <div class="container section">
          <div class="section-header">
            <div class="section-label">Specialties</div>
            <h1 class="section-title">Our Departments</h1>
            <p class="section-subtitle">Explore our world-class departments — hover over any card to see available tests and procedures.</p>
          </div>
          <div class="departments-grid">
            ${DEPARTMENTS.map(d => Components.departmentCard(d)).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /* ========== DOCTORS ========== */
  doctors() {
    return `
      <div class="page-content doctors-page">
        <div class="container section">
          <div class="section-header">
            <div class="section-label">Our Team</div>
            <h1 class="section-title">Find a Doctor</h1>
            <p class="section-subtitle">Search by name, specialty, or department to find the right doctor for you.</p>
          </div>
          <div class="doctors-filters">
            <div class="filter-search">
              ${Components.searchIcon()}
              <input type="text" id="doctor-search" placeholder="Search by doctor name..." aria-label="Search doctors by name" />
            </div>
            <select class="filter-select" id="doctor-specialty-filter" aria-label="Filter by specialty">
              <option value="">All Specialties</option>
              ${[...new Set(DOCTORS.map(d => d.specialty))].map(s =>
                `<option value="${s}">${s}</option>`
              ).join('')}
            </select>
            <select class="filter-select" id="doctor-dept-filter" aria-label="Filter by department">
              <option value="">All Departments</option>
              ${[...new Set(DOCTORS.map(d => d.department))].map(d =>
                `<option value="${d}">${d}</option>`
              ).join('')}
            </select>
          </div>
          <div class="doctors-grid" id="doctors-grid">
            ${DOCTORS.map(d => Components.doctorCard(d)).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /* ========== SERVICES ========== */
  services() {
    return `
      <div class="page-content services-page">
        <div class="container section">
          <div class="section-header">
            <div class="section-label">Healthcare Solutions</div>
            <h1 class="section-title">Our Services</h1>
            <p class="section-subtitle">From emergency care to telemedicine, we offer comprehensive services to meet every healthcare need.</p>
          </div>
          <div class="services-full-grid">
            ${SERVICES.map(s => Components.serviceCard(s)).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /* ========== APPOINTMENT ========== */
  appointment() {
    return `
      <div class="page-content appointment-page">
        <div class="container section">
          <div class="section-header">
            <div class="section-label">Schedule a Visit</div>
            <h1 class="section-title">Book an Appointment</h1>
            <p class="section-subtitle">Chat with our AI assistant or fill out the form below. It takes less than 2 minutes.</p>
          </div>
          <div class="appointment-tabs">
            <button class="appointment-tab active" id="tab-chat" onclick="AppointmentEngine.switchTab('chat')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              AI Assistant
            </button>
            <button class="appointment-tab" id="tab-form" onclick="AppointmentEngine.switchTab('form')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              Manual Form
            </button>
          </div>

          <div class="appointment-layout">
            <div>
              <!-- CHAT -->
              <div class="chat-container" id="chat-container">
                <div class="chat-header">
                  <div class="chat-bot-avatar">🤖</div>
                  <div class="chat-header-info">
                    <h4>Medifort AI Assistant</h4>
                    <span>Here to help you book</span>
                  </div>
                  <div class="chat-online-dot"></div>
                </div>
                <div class="chat-messages" id="chat-messages"></div>
                <div class="chat-input-area">
                  <button class="chat-mic-btn" id="chat-mic-btn" aria-label="Use voice input" title="Speak your response">
                    ${Components.micIcon()}
                  </button>
                  <input type="text" class="chat-input" id="chat-input" placeholder="Type your response..." aria-label="Type your response" />
                  <button class="chat-send-btn" id="chat-send-btn" aria-label="Send message">
                    ${Components.sendIcon()}
                  </button>
                </div>
              </div>

              <!-- FORM -->
              <div class="form-container" id="form-container">
                <h3 style="margin-bottom:var(--space-6);">Appointment Details</h3>
                <form id="manual-appointment-form" onsubmit="AppointmentEngine.submitForm(event)">
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="form-name">Full Name *</label>
                      <input class="form-input" type="text" id="form-name" required placeholder="Enter your full name" />
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="form-phone">Phone Number *</label>
                      <input class="form-input" type="tel" id="form-phone" required placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="form-department">Department *</label>
                      <select class="form-select" id="form-department" required>
                        <option value="">Select Department</option>
                        ${DEPARTMENTS.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="form-doctor">Preferred Doctor</label>
                      <select class="form-select" id="form-doctor">
                        <option value="">Any Available Doctor</option>
                        ${DOCTORS.map(d => `<option value="${d.name}">${d.name} — ${d.specialty}</option>`).join('')}
                      </select>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="form-date">Preferred Date *</label>
                      <input class="form-input" type="date" id="form-date" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="form-time">Preferred Time</label>
                      <select class="form-select" id="form-time">
                        <option value="Morning (9-12)">Morning (9 AM – 12 PM)</option>
                        <option value="Afternoon (12-3)">Afternoon (12 – 3 PM)</option>
                        <option value="Evening (3-6)">Evening (3 – 6 PM)</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="form-notes">Additional Notes</label>
                    <textarea class="form-textarea" id="form-notes" placeholder="Describe your symptoms or reason for visit (optional)"></textarea>
                  </div>
                  <button type="submit" class="form-submit-btn">Confirm Appointment</button>
                </form>
              </div>
            </div>

            <!-- SIDEBAR -->
            <div class="appointment-sidebar">
              <div class="sidebar-card">
                <h4>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  How It Works
                </h4>
                <ul>
                  <li>${Components.checkIcon()} Tell us your name and concern</li>
                  <li>${Components.checkIcon()} Choose a department and doctor</li>
                  <li>${Components.checkIcon()} Pick your preferred date and time</li>
                  <li>${Components.checkIcon()} Confirm and receive your appointment details</li>
                </ul>
              </div>
              <div class="sidebar-card">
                <h4>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Your Privacy
                </h4>
                <ul>
                  <li>${Components.checkIcon()} Voice data is processed in-browser only</li>
                  <li>${Components.checkIcon()} No personal data is stored on servers</li>
                  <li>${Components.checkIcon()} Microphone requires explicit consent</li>
                  <li>${Components.checkIcon()} Demo mode — no real bookings created</li>
                </ul>
              </div>
              <div class="sidebar-card" style="background:var(--gradient-primary); color:#fff; border:none;">
                <h4 style="color:#fff;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>
                  Need Help?
                </h4>
                <p style="font-size:var(--fs-sm); opacity:0.85; margin-bottom:var(--space-3);">Prefer to book by phone? Call us anytime.</p>
                <p style="font-size:var(--fs-xl); font-weight:700;"><a href="tel:+917631432007" style="color:inherit; text-decoration:none;">+91 76314 32007</a> / <a href="tel:+918935966820" style="color:inherit; text-decoration:none;">+91 89359 66820</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* ========== FAQ ========== */
  faq() {
    return `
      <div class="page-content faq-page">
        <div class="container section">
          <div class="section-header">
            <div class="section-label">Help Center</div>
            <h1 class="section-title">Frequently Asked Questions</h1>
            <p class="section-subtitle">Find answers to common questions about our services, visiting hours, and more.</p>
          </div>
          <div class="faq-list">
            ${FAQ_DATA.map((item, i) => Components.faqItem(item, i)).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /* ========== CONTACT ========== */
  contact() {
    return `
      <div class="page-content contact-page">
        <div class="container section">
          <div class="section-header">
            <div class="section-label">Get in Touch</div>
            <h1 class="section-title">Contact Us</h1>
            <p class="section-subtitle">We're here to help. Reach out to us through any of the channels below.</p>
          </div>
          <div class="contact-layout">
            <div>
              <div class="contact-info-cards">
                <div class="contact-card reveal">
                  <div class="contact-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <h4>Visit Us</h4>
                    <p><a href="https://maps.google.com/maps?q=Medifort+Wellness+Hospital,+Tilkamanjhi+Chowk,+Narayana+Colony,+Bhagalpur,+Bihar+812001" target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:none;">Hotel Shishmahal Lane, Tilkamanjhi Chowk<br/>Narayana Colony, Bhagalpur, Bihar 812001</a></p>
                  </div>
                </div>
                <div class="contact-card reveal">
                  <div class="contact-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                    <h4>Call Us</h4>
                    <p><a href="tel:+917631432007" style="color:inherit; text-decoration:none;">General: +91 76314 32007</a> / <a href="tel:+918935966820" style="color:inherit; text-decoration:none;">+91 89359 66820</a></p>
                  </div>
                </div>
                <div class="contact-card reveal">
                  <div class="contact-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <div>
                    <h4>Email Us</h4>
                    <p><a href="https://mail.google.com/mail/?view=cm&to=info@medifortwellness.com" target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:none;">General: info@medifortwellness.com</a><br/><a href="https://mail.google.com/mail/?view=cm&to=appointments@medifortwellness.com" target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:none;">Appointments: appointments@medifortwellness.com</a></p>
                  </div>
                </div>
                <div class="contact-card reveal">
                  <div class="contact-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div>
                    <h4>Working Hours</h4>
                    <p>Mon–Sat: 9:00 AM – 6:00 PM<br/>Sunday: Emergency Only</p>
                  </div>
                </div>
              </div>
              <div class="contact-map reveal">
                <span class="placeholder-visual">📍 Map</span>
              </div>
            </div>
            <div class="contact-form-card reveal-right">
              <h3>Send Us a Message</h3>
              <form onsubmit="event.preventDefault(); alert('Thank you! Your message has been sent. We\\'ll get back to you within 24 hours.');">
                <div class="form-group">
                  <label class="form-label" for="contact-name">Your Name *</label>
                  <input class="form-input" type="text" id="contact-name" required placeholder="Enter your full name" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-email">Email Address *</label>
                  <input class="form-input" type="email" id="contact-email" required placeholder="your@email.com" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-subject">Subject</label>
                  <input class="form-input" type="text" id="contact-subject" placeholder="What is this regarding?" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-message">Message *</label>
                  <textarea class="form-textarea" id="contact-message" required placeholder="Type your message here..."></textarea>
                </div>
                <button type="submit" class="form-submit-btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
