/* ==========================================================================
   Esumoon 易善美 — Wix Original Website Interactive JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFAQAccordion();
  initContactForm();
  initMobileMenu();
});

/* --------------------------------------------------------------------------
   1. FAQ Accordion Toggle
   -------------------------------------------------------------------------- */
function initFAQAccordion() {
  const faqBtns = document.querySelectorAll('.faq-btn');

  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.parentElement;
      const isActive = card.classList.contains('active');

      document.querySelectorAll('.faq-card').forEach(c => c.classList.remove('active'));

      if (!isActive) {
        card.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. Contact Form Submission
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const msg = document.getElementById('form-msg');

  if (!form || !msg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = '發送中...';

    setTimeout(() => {
      msg.textContent = '感謝您的來訊！我們將盡快回覆您。';
      form.reset();

      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      setTimeout(() => {
        msg.textContent = '';
      }, 4000);
    }, 1000);
  });
}

/* --------------------------------------------------------------------------
   3. Mobile Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}
