/* ============================================
   SIMPLE SPA ROUTER
   ============================================ */

const Router = {
  currentPage: 'home',
  listeners: [],

  init() {
    // Handle all data-page link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-page]');
      if (link) {
        e.preventDefault();
        const page = link.dataset.page;
        this.navigate(page);
      }
    });
  },

  navigate(page) {
    if (page === this.currentPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });

    // Close mobile nav
    const navLinks = document.getElementById('nav-links');
    const navToggle = document.getElementById('nav-toggle');
    if (navLinks) navLinks.classList.remove('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');

    // Notify listeners
    this.listeners.forEach(fn => fn(page));
  },

  onNavigate(fn) {
    this.listeners.push(fn);
  }
};
