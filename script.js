/* ══════════════════════════════════════════
   HEMANTH AVAGADDA — Portfolio Script
   
   FIX: document.body gets .js-ready FIRST
   so all content is visible before any
   animation classes are applied. This means
   the site never goes blank even if the
   IntersectionObserver fires late.
══════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────
   STEP 1 — mark body as JS-ready
   CSS rule: body.js-ready .reveal { opacity:0 }
   Without this class, .reveal elements are
   fully visible (safe fallback).
──────────────────────────────────────── */
document.body.classList.add('js-ready');

/* ════════════════════════════════════════
   1. THEME TOGGLE
════════════════════════════════════════ */
(function initTheme() {
  const html    = document.documentElement;
  const btn     = document.getElementById('themeBtn');
  const icon    = document.getElementById('themeIcon');
  const STORAGE = 'ha_theme';

  function applyTheme(theme) {
    html.dataset.theme = theme;
    icon.className = theme === 'dark'
      ? 'fa-solid fa-moon'
      : 'fa-solid fa-sun';
  }

  // Restore saved or default to dark
  applyTheme(localStorage.getItem(STORAGE) || 'dark');

  btn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE, next);
  });
})();

/* ════════════════════════════════════════
   2. NAVBAR — scroll shadow + active link
════════════════════════════════════════ */
(function initNavbar() {
  const header   = document.getElementById('header');
  const links    = document.querySelectorAll('.nl');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    // Scroll shadow
    header.classList.toggle('scrolled', window.scrollY > 10);

    // Active section highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 110) {
        current = sec.id;
      }
    });
    links.forEach(a => {
      a.classList.toggle(
        'active',
        a.getAttribute('href') === '#' + current
      );
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();

/* ════════════════════════════════════════
   3. MOBILE MENU
════════════════════════════════════════ */
(function initMenu() {
  const menuBtn  = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  menuBtn.addEventListener('click', () => {
    const open = menuBtn.classList.toggle('open');
    navLinks.classList.toggle('open', open);
  });

  // Close when a link is tapped
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
      menuBtn.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
})();

/* ════════════════════════════════════════
   4. TYPEWRITER
════════════════════════════════════════ */
(function initTyped() {
  const el = document.getElementById('typed');
  if (!el) return;

  const words   = ['CS Student', 'AI Enthusiast', 'Web Developer', 'Python Coder', 'Problem Solver'];
  let wi        = 0;
  let ci        = 0;
  let deleting  = false;

  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);

    if (!deleting && ci === word.length) {
      deleting = true;
      setTimeout(tick, 1800);
      return;
    }
    if (deleting && ci === 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
    }
    setTimeout(tick, deleting ? 55 : 95);
  }
  setTimeout(tick, 600);
})();

/* ════════════════════════════════════════
   5. SCROLL REVEAL
   Elements only hidden AFTER js-ready class
   is added, so they're always visible.
════════════════════════════════════════ */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length || !('IntersectionObserver' in window)) {
    // Fallback: make everything visible immediately
    items.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Stagger cards in the same parent
      const siblings = Array.from(
        entry.target.parentElement.querySelectorAll('.reveal')
      );
      const delay = siblings.indexOf(entry.target) * 0.08;
      entry.target.style.transitionDelay = delay + 's';
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
})();

/* ════════════════════════════════════════
   6. SKILL BAR ANIMATION
════════════════════════════════════════ */
(function initBars() {
  const bars = document.querySelectorAll('.sk-fill');
  if (!bars.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: animate immediately
    bars.forEach(b => { b.style.width = (b.dataset.w || 0) + '%'; });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      setTimeout(() => {
        bar.style.width = (bar.dataset.w || 0) + '%';
      }, 200);
      io.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(b => io.observe(b));
})();

/* ════════════════════════════════════════
   7. CONTACT FORM VALIDATION
════════════════════════════════════════ */
(function initForm() {
  const form  = document.getElementById('contactForm');
  const toast = document.getElementById('fToast');
  if (!form) return;

  const rules = {
    fName:  { err: 'errName',  msg: 'Please enter your name.' },
    fEmail: { err: 'errEmail', msg: 'Please enter a valid email.' },
    fMsg:   { err: 'errMsg',   msg: 'Please enter a message.' }
  };

  function check(id) {
    const el  = document.getElementById(id);
    const err = document.getElementById(rules[id].err);
    const val = el.value.trim();
    let ok = true;

    if (!val) {
      err.textContent = rules[id].msg; el.classList.add('err'); ok = false;
    } else if (id === 'fEmail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      err.textContent = rules[id].msg; el.classList.add('err'); ok = false;
    } else {
      err.textContent = ''; el.classList.remove('err');
    }
    return ok;
  }

  Object.keys(rules).forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('blur',  () => check(id));
    el.addEventListener('input', () => { if (el.classList.contains('err')) check(id); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const valid = Object.keys(rules).every(id => check(id));
    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      form.reset();
      Object.keys(rules).forEach(id => {
        document.getElementById(rules[id].err).textContent = '';
        document.getElementById(id).classList.remove('err');
      });
      btn.disabled  = false;
      btn.innerHTML = orig;
      toast.textContent = '✅ Message sent! I\'ll get back to you soon.';
      toast.className   = 'ftoast ok';
      setTimeout(() => { toast.className = 'ftoast'; }, 6000);
    }, 1500);
  });
})();

/* ════════════════════════════════════════
   8. RESUME BUTTON
════════════════════════════════════════ */
(function initResume() {
  const btn = document.getElementById('resumeBtn');
  if (!btn) return;

  btn.addEventListener('click', e => {
    e.preventDefault();
    // TO USE: set btn.setAttribute('href','your-resume.pdf') and btn.setAttribute('download','')
    // Demo feedback:
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Ready to download!';
    btn.style.pointerEvents = 'none';
    setTimeout(() => {
      btn.innerHTML         = orig;
      btn.style.pointerEvents = '';
    }, 2500);
  });
})();

/* ════════════════════════════════════════
   9. SMOOTH SCROLL (all anchor links)
════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ════════════════════════════════════════
   10. BACK TO TOP
════════════════════════════════════════ */
(function initBTT() {
  const btn = document.getElementById('btt');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ════════════════════════════════════════
   11. SUBTLE CARD TILT on mouse move
════════════════════════════════════════ */
(function initTilt() {
  document.querySelectorAll('.proj-card, .extra-card, .ti').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 8;
      card.style.transform =
        `perspective(700px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

// Console easter egg
console.log(
  '%c < HA /> %cHemanth Avagadda · CS Student · AI & Web Dev',
  'color:#22d3ee;font-size:16px;font-weight:bold;',
  'color:#818cf8;font-size:13px;'
);
