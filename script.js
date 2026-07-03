/* =====================================================
   Premier Plumbing — script.js
   Features: navbar scroll, mobile menu, gallery
   lightbox, reviews carousel, scroll reveal,
   form handler, back-to-top
   ===================================================== */

(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    document.getElementById('backTop').classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  /* ---- Mobile burger ---- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ---- Smooth scroll with navbar offset ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - navbar.offsetHeight - 8, behavior: 'smooth' });
    });
  });

  /* ---- Back to top ---- */
  document.getElementById('backTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll(
    '.service-card, .gallery-item, .review-card, .trust-item, .ab-badge, .stat-card'
  );
  revealEls.forEach(el => el.classList.add('reveal'));
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObs.observe(el));

  /* ---- Lightbox ---- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  let currentIdx = 0;

  function openLightbox(idx) {
    currentIdx = idx;
    const item = items[idx];
    lbImg.src = item.querySelector('img').src;
    lbImg.alt = item.querySelector('img').alt;
    lbCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navLightbox(dir) {
    currentIdx = (currentIdx + dir + items.length) % items.length;
    openLightbox(currentIdx);
  }

  items.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', () => navLightbox(-1));
  document.getElementById('lbNext').addEventListener('click', () => navLightbox(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  /* ---- Reviews Carousel ---- */
  const track = document.getElementById('reviewsTrack');
  const cards = Array.from(track.querySelectorAll('.review-card'));
  const dotsContainer = document.getElementById('ccDots');
  let currentSlide = 0;
  let autoTimer;

  function getVisible() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }

  function totalSlides() {
    return Math.max(1, cards.length - getVisible() + 1);
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides(); i++) {
      const d = document.createElement('button');
      d.className = 'cc-dot' + (i === currentSlide ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(d);
    }
  }

  function goTo(idx) {
    currentSlide = Math.max(0, Math.min(idx, totalSlides() - 1));
    const cardW = cards[0].offsetWidth + 24; // gap=24
    track.style.transform = `translateX(-${currentSlide * cardW}px)`;
    dotsContainer.querySelectorAll('.cc-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo((currentSlide + 1) % totalSlides()), 5000);
  }

  document.getElementById('revPrev').addEventListener('click', () => goTo(currentSlide - 1));
  document.getElementById('revNext').addEventListener('click', () => goTo(currentSlide + 1));

  buildDots();
  resetAuto();
  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  /* Touch swipe for carousel */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(currentSlide + (diff > 0 ? 1 : -1));
  });

  /* ---- Contact Form ---- */
  document.getElementById('ctaForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const orig = btn.textContent;
    btn.textContent = '✅ Request Sent! We\'ll call you shortly.';
    btn.style.background = 'linear-gradient(135deg,#00C853,#00A040)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
      e.target.reset();
    }, 5000);
  });

})();
