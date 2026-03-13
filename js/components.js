/* ============================================
   REUSABLE COMPONENT RENDERERS
   ============================================ */

const Components = {

  /* --- Check icon SVG --- */
  checkIcon() {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  },

  arrowRight() {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  },

  searchIcon() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`;
  },

  chevronDown() {
    return `<svg class="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>`;
  },

  micIcon() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18.5V23M8 23h8"/></svg>`;
  },

  sendIcon() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/></svg>`;
  },

  userIcon() {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  },

  /* --- Doctor Card --- */
  doctorCard(doctor) {
    return `
      <article class="doctor-card reveal" tabindex="0" aria-label="Dr. ${doctor.name}, ${doctor.specialty}">
        <div class="doctor-card-image">
          <span class="doctor-avatar">${doctor.avatar}</span>
        </div>
        <div class="doctor-card-body">
          <h3 class="doctor-name">${doctor.name}</h3>
          <div class="doctor-specialty">${doctor.specialty}</div>
          <p class="doctor-qualifications">${doctor.qualifications}</p>
          <div class="doctor-meta">
            <span class="doctor-availability">
              <span class="availability-dot ${doctor.availability}"></span>
              ${doctor.availabilityText}
            </span>
            <button class="doctor-book-btn" data-page="appointment" aria-label="Book appointment with ${doctor.name}">
              Book Now
            </button>
          </div>
        </div>
      </article>
    `;
  },

  /* --- Department Card --- */
  departmentCard(dept) {
    const testsHTML = dept.tests.map(t => `<li>${t}</li>`).join('');
    return `
      <article class="department-card reveal" tabindex="0">
        <div class="department-card-header">
          <div class="department-icon"><span>${dept.icon}</span></div>
          <div class="department-header-text">
            <h3>${dept.name}</h3>
            <p>${dept.description}</p>
          </div>
        </div>
        <div class="department-tests">
          <h5>Available Tests & Procedures</h5>
          <ul>${testsHTML}</ul>
        </div>
        <div class="department-card-footer">
          <span class="department-doctor-count">
            ${Components.userIcon()} ${dept.doctorCount} Doctors
          </span>
          <a href="#" class="department-link" data-page="doctors">
            View Doctors ${Components.arrowRight()}
          </a>
        </div>
      </article>
    `;
  },

  /* --- Service Card (full) --- */
  serviceCard(service) {
    const featuresHTML = service.features.map(f =>
      `<div class="service-feature">${Components.checkIcon()} ${f}</div>`
    ).join('');
    return `
      <article class="service-full-card reveal">
        <div class="service-full-icon"><span>${service.icon}</span></div>
        <h3>${service.name}</h3>
        <p>${service.description}</p>
        <div class="service-features">${featuresHTML}</div>
      </article>
    `;
  },

  /* --- Testimonial Card --- */
  testimonialCard(t) {
    const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
    return `
      <article class="testimonial-card reveal">
        <div class="testimonial-stars">${stars}</div>
        <p class="testimonial-text">${t.text}</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${t.initials}</div>
          <div class="testimonial-author-info">
            <h5>${t.name}</h5>
            <span>${t.treatment}</span>
          </div>
        </div>
      </article>
    `;
  },

  /* --- FAQ Item --- */
  faqItem(item, index) {
    return `
      <div class="faq-item" id="faq-${index}">
        <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${index}" onclick="Components.toggleFaq(${index})">
          <span>${item.question}</span>
          ${Components.chevronDown()}
        </button>
        <div class="faq-answer" id="faq-answer-${index}" role="region">
          <p>${item.answer}</p>
        </div>
      </div>
    `;
  },

  toggleFaq(index) {
    const item = document.getElementById(`faq-${index}`);
    const btn = item.querySelector('.faq-question');
    const isOpen = item.classList.contains('open');
    item.classList.toggle('open');
    btn.setAttribute('aria-expanded', !isOpen);
  },

  /* --- Scroll Reveal Observer --- */
  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      observer.observe(el);
    });
  }
};
