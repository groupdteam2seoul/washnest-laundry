/* ====================================
   WASHNEST BY BERSIH.IN — script.js
   ==================================== */

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
    scrollTopBtn.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    scrollTopBtn.classList.remove('visible');
  }
}, { passive: true });

/* ---- Scroll to top ---- */
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- Hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.classList.toggle('open', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', true);
  });
});

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 76; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- AOS (Animate on Scroll) ---- */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ---- Form Validation & Submission ---- */
function initForm() {
  const form = document.getElementById('daftarForm');
  const formSuccess = document.getElementById('formSuccess');
  const successName = document.getElementById('successName');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  const validators = {
    nama: (val) => {
      if (!val.trim()) return 'Nama lengkap wajib diisi.';
      if (val.trim().length < 3) return 'Nama minimal 3 karakter.';
      return '';
    },
    phone: (val) => {
      const clean = val.replace(/\s/g, '');
      if (!clean) return 'Nomor WhatsApp wajib diisi.';
      if (!/^(\+62|08)\d{8,12}$/.test(clean)) return 'Format nomor tidak valid. Contoh: 08123456789';
      return '';
    },
    email: (val) => {
      if (!val.trim()) return 'Email wajib diisi.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Format email tidak valid.';
      return '';
    },
    agree: (val, el) => {
      if (!el.checked) return 'Anda harus menyetujui syarat & ketentuan.';
      return '';
    }
  };

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + '-error');
    if (field) field.classList.toggle('error', !!message);
    if (error) error.textContent = message;
  }

  function validateField(id) {
    const el = document.getElementById(id);
    if (!el || !validators[id]) return true;
    const msg = validators[id](el.value, el);
    showError(id, msg);
    return !msg;
  }

  // Live validation
  ['nama', 'phone', 'email'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur', () => validateField(id));
      el.addEventListener('input', () => {
        if (el.classList.contains('error')) validateField(id);
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = ['nama', 'phone', 'email', 'agree'];
    let allValid = true;
    fields.forEach(id => { if (!validateField(id)) allValid = false; });
    if (!allValid) return;

    // Simulate submission
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    submitBtn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';

    setTimeout(() => {
      const nama = document.getElementById('nama').value.trim().split(' ')[0];
      if (successName) successName.textContent = nama;
      form.style.display = 'none';
      formSuccess.style.display = 'block';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
  });
}

/* ---- Counter animation ---- */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-item strong');
  counters.forEach(counter => {
    const text = counter.textContent;
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return;
    const suffix = text.replace(/[0-9.]/g, '');
    let start = 0;
    const duration = 1500;
    const step = 16;
    const increment = num / (duration / step);
    const timer = setInterval(() => {
      start = Math.min(start + increment, num);
      if (num < 10) {
        counter.textContent = start.toFixed(1) + suffix;
      } else {
        counter.textContent = Math.floor(start) + suffix;
      }
      if (start >= num) clearInterval(timer);
    }, step);
  });
}

/* ---- Init counters on hero visibility ---- */
function initCounters() {
  const hero = document.querySelector('.hero-stats');
  if (!hero) return;
  let triggered = false;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true;
      animateCounters();
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  obs.observe(hero);
}

/* ---- Active nav highlight ---- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }, { passive: true });
}

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initForm();
  initCounters();
  initActiveNav();
});
