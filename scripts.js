// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  /* ================= HERO SLIDER ================= */
  const slider = document.querySelector('.hero-slider');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const wrapper = slider.querySelector('.slides-wrapper');
    const dotsWrap = slider.querySelector('.slider-dots');
    const prevBtn = slider.querySelector('.slider-arrow.prev');
    const nextBtn = slider.querySelector('.slider-arrow.next');

    let current = 0;
    const interval = 5000;
    let timer;

    // create dots
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Slide ' + (i + 1));
      btn.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(btn);
    });
    const dots = Array.from(dotsWrap.children);

    function updateUI() {
      // move wrapper
      wrapper.style.transform = `translateX(-${current * 100}%)`;
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === current);
        s.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(index, fromUser) {
      const total = slides.length;
      current = (index + total) % total;
      updateUI();
      if (fromUser) restart();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function start() {
      stop();
      timer = setInterval(next, interval);
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }
    function restart() {
      stop();
      start();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restart(); });

    // pause on hover
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);

    // swipe support
    let startX = 0;
    slider.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    });
    slider.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      const delta = startX - endX;
      if (Math.abs(delta) > 40) {
        delta > 0 ? next() : prev();
        restart();
      }
      startX = 0;
    });

    updateUI();
    start();
  }

  /* ================= ACCORDION ================= */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const accordion = item.parentElement;

      accordion.querySelectorAll('.accordion-item').forEach(i => {
        if (i !== item) i.classList.remove('active');
      });

      item.classList.toggle('active');
    });
  });

  /* ================= MOBILE NAV ================= */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ================= CONTACT FORM → EMAIL ================= */
  const form = document.getElementById('contactForm');
  const msgEl = document.getElementById('formMessage');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        if (msgEl) {
          msgEl.textContent = 'Please fill in Name, Email and Message.';
          msgEl.className = 'form-message error';
          msgEl.hidden = false;
        }
        return;
      }

      const subject = encodeURIComponent(`New enquiry from ${name}`);
      const bodyText =
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`;
      const body = encodeURIComponent(bodyText);

      const gmailUrl =
        `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=henshedressmakersklm@gmail.com&su=${subject}&body=${body}`;
      const mailtoUrl =
        `mailto:henshedressmakersklm@gmail.com?subject=${subject}&body=${body}`;

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      // On phones: go straight to mailto (Gmail app usually handles this)
      if (isMobile) {
        window.location.href = mailtoUrl;
      } else {
        // On desktop: try Gmail web first
        const newWin = window.open(gmailUrl, '_blank');

        // If blocked or failed, fall back to mailto
        setTimeout(() => {
          if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
            window.location.href = mailtoUrl;
          }
        }, 400);
      }

      if (msgEl) {
        msgEl.textContent =
          'We are opening your email app. Please review the message and press Send.';
        msgEl.className = 'form-message info';
        msgEl.hidden = false;
      }

      form.reset();
    });
  }

  /* auto-update footer year */
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});