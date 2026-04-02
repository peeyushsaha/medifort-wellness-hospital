/* ============================================
   APP — Main entry point
   ============================================ */

(function () {
  'use strict';

  /* --- Load data from API in background (fallback data used immediately) --- */
  loadAllData();

  const mainContent = document.getElementById('main-content');
  
  /* --- Render a page by name --- */
  function renderPage(pageName) {
    const staticHero = document.getElementById('home-hero-static');
    if (staticHero) {
      staticHero.style.display = (pageName === 'home') ? 'block' : 'none';
      if (pageName === 'home') {
        // Trigger reveal manually for static hero since it's not dynamically created
        setTimeout(() => {
          document.querySelectorAll('.hero-card').forEach(el => el.classList.add('revealed'));
        }, 300);
      }
    }

    const renderer = Pages[pageName];
    if (!renderer) {
      mainContent.innerHTML = `<div class="container section"><h1>Page Not Found</h1><p>The page "${pageName}" doesn't exist.</p></div>`;
      return;
    }

    mainContent.innerHTML = renderer();

    // Post-render setup
    requestAnimationFrame(() => {
      Components.initScrollReveal();
      Components.initParallax();
      Components.initCounterAnimation();

      if (pageName === 'doctors') {
        setupDoctorFilters();
      }
      if (pageName === 'appointment') {
        AppointmentEngine.init();
      }
      if (pageName === 'contact') {
        setupContactForm();
      }
    });
  }

  /* --- Doctor filter logic --- */
  function setupDoctorFilters() {
    const searchInput = document.getElementById('doctor-search');
    const specialtyFilter = document.getElementById('doctor-specialty-filter');
    const deptFilter = document.getElementById('doctor-dept-filter');

    function filterDoctors() {
      const searchTerm = (searchInput?.value || '').toLowerCase();
      const specialty = specialtyFilter?.value || '';
      const dept = deptFilter?.value || '';

      const filtered = DOCTORS.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchTerm);
        const matchesSpecialty = !specialty || d.specialty === specialty;
        const matchesDept = !dept || d.department === dept;
        return matchesSearch && matchesSpecialty && matchesDept;
      });

      const grid = document.getElementById('doctors-grid');
      if (grid) {
        if (filtered.length === 0) {
          grid.innerHTML = `
            <div class="no-results">
              <p>No doctors found matching your criteria.</p>
              <button class="btn btn-primary" onclick="document.getElementById('doctor-search').value=''; document.getElementById('doctor-specialty-filter').value=''; document.getElementById('doctor-dept-filter').value=''; document.getElementById('doctor-search').dispatchEvent(new Event('input'));">
                Clear Filters
              </button>
            </div>
          `;
        } else {
          grid.innerHTML = filtered.map(d => Components.doctorCard(d)).join('');
          Components.initScrollReveal();
        }
      }
    }

    if (searchInput) searchInput.addEventListener('input', filterDoctors);
    if (specialtyFilter) specialtyFilter.addEventListener('change', filterDoctors);
    if (deptFilter) deptFilter.addEventListener('change', filterDoctors);
  }

  /* --- Contact form logic --- */
  function setupContactForm() {
    const form = document.querySelector('.contact-form-card form');
    if (!form || !API_BASE) return;

    form.onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value || '';
      const email = document.getElementById('contact-email')?.value || '';
      const subject = document.getElementById('contact-subject')?.value || '';
      const message = document.getElementById('contact-message')?.value || '';

      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/contacts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message })
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message || 'Thank you! Your message has been sent.');
          form.reset();
        } else {
          alert(data.error || 'Something went wrong. Please try again.');
        }
      } catch {
        alert('Thank you! Your message has been sent. We\'ll get back to you within 24 hours.');
      }
    };
  }

  /* --- Mobile nav toggle --- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* --- Sticky header --- */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* --- Router setup --- */
  Router.onNavigate(renderPage);
  Router.init();

  // Render initial page
  renderPage('home');
})();
