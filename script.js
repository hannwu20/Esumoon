/* ==========================================================================
   ESUMOON Interactive JavaScript Modules
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initThemeToggle();
  initAccentPicker();
  initLiveClock();
  initCounterAnimation();
  initPortfolioFilter();
  initScrollReveal();
  initContactForm();
  initMobileMenu();
});

/* --------------------------------------------------------------------------
   1. Interactive Particle Canvas Background
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse attraction / interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? `rgba(147, 197, 253, ${this.alpha})` : `rgba(99, 102, 241, ${this.alpha * 0.7})`;
      ctx.fill();
    }
  }

  // Generate particle pool
  const particleCount = Math.min(Math.floor((width * height) / 15000), 80);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between close particles
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const lineColor = isDark ? 'rgba(99, 102, 241, ' : 'rgba(79, 70, 229, ';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `${lineColor}${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. Dark / Light Theme Toggle & Persistence
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('esumoon_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('esumoon_theme', newTheme);
  });
}

/* --------------------------------------------------------------------------
   3. Accent Color Customizer
   -------------------------------------------------------------------------- */
function initAccentPicker() {
  const colorDots = document.querySelectorAll('.color-dot');
  
  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      const colorName = dot.getAttribute('data-color');
      if (colorName === 'indigo') {
        document.documentElement.removeAttribute('data-accent');
      } else {
        document.documentElement.setAttribute('data-accent', colorName);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Live Clock & Dynamic Metrics Widget
   -------------------------------------------------------------------------- */
function initLiveClock() {
  const timeElem = document.getElementById('live-time');
  const dateElem = document.getElementById('live-date');

  if (!timeElem || !dateElem) return;

  function updateTime() {
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeElem.textContent = `${hours}:${minutes}:${seconds}`;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const dayName = days[now.getDay()];

    dateElem.textContent = `${year}-${month}-${date} (${dayName})`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* --------------------------------------------------------------------------
   5. Number Counter Animation on Scroll
   -------------------------------------------------------------------------- */
function initCounterAnimation() {
  const metricValues = document.querySelectorAll('.metric-value');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        metricValues.forEach(elem => {
          const target = parseFloat(elem.getAttribute('data-target'));
          const isPercent = elem.textContent.includes('%');
          const isPlus = elem.textContent.includes('+');
          const isFps = elem.textContent.includes('FPS');

          let start = 0;
          const duration = 1500;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              start = target;
              clearInterval(timer);
            }

            let suffix = '';
            if (isPercent) suffix = '%';
            if (isPlus) suffix = '+';
            if (isFps) suffix = ' FPS';

            elem.textContent = `${Number.isInteger(target) ? Math.floor(start) : start.toFixed(1)}${suffix}`;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsGrid = document.querySelector('.metrics-grid');
  if (metricsGrid) observer.observe(metricsGrid);
}

/* --------------------------------------------------------------------------
   6. Portfolio Category Filter Tabs
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || filter === category) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Scroll Reveal Animation Observer
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const fadeElems = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeElems.forEach(elem => observer.observe(elem));
}

/* --------------------------------------------------------------------------
   8. Interactive Contact Form Submission
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>發送中...</span>';

    setTimeout(() => {
      status.className = 'form-status success';
      status.textContent = '🎉 感謝您的聯繫！我們已收到您的需求，將盡快回覆您。';
      form.reset();

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      setTimeout(() => {
        status.textContent = '';
        status.className = 'form-status';
      }, 5000);
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   9. Mobile Navigation Drawer Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}
