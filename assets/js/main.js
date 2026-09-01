(function () {
  'use strict';

  /* ============ HEADER: sticky shadow on scroll + scroll-to-top ============ */
  var header = document.getElementById('masthead');
  var scrollTopBtn = document.getElementById('scroll-top');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (scrollTopBtn) scrollTopBtn.hidden = y < 400;
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============ MOBILE MENU ============ */
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('primary-navigation');
  var overlay = document.getElementById('mobile-overlay');

  function closeMenu() {
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  if (toggle && nav && overlay) {
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });
    overlay.addEventListener('click', closeMenu);
    nav.querySelectorAll('.menu-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ============ COUNTDOWN TIMER ============ */
  var countdownWrapper = document.querySelector('.countdown-wrapper');
  if (countdownWrapper) {
    var dueDate = parseInt(countdownWrapper.getAttribute('data-due-date'), 10) * 1000;
    var elDays = document.getElementById('cd-days');
    var elHours = document.getElementById('cd-hours');
    var elMinutes = document.getElementById('cd-minutes');
    var elSeconds = document.getElementById('cd-seconds');

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      var diff = dueDate - Date.now();
      if (diff <= 0) {
        elDays.textContent = '00';
        elHours.textContent = '00';
        elMinutes.textContent = '00';
        elSeconds.textContent = '00';
        return;
      }
      var totalSeconds = Math.floor(diff / 1000);
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds % 86400) / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;

      elDays.textContent = pad(days);
      elHours.textContent = pad(hours);
      elMinutes.textContent = pad(minutes);
      elSeconds.textContent = pad(seconds);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ============ ANIMATED HERO COUNTER ($0 -> $1.000.000) ============ */
  var counterEl = document.getElementById('hero-counter');
  if (counterEl && 'IntersectionObserver' in window) {
    var toValue = parseInt(counterEl.getAttribute('data-to'), 10) || 0;
    var animated = false;

    function formatCL(n) {
      return n.toLocaleString('es-CL');
    }

    function animateCounter() {
      if (animated) return;
      animated = true;
      var duration = 2000;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * toValue);
        counterEl.textContent = formatCL(current);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counterEl.textContent = formatCL(toValue);
        }
      }
      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter();
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(counterEl);
  }

  /* ============ FAQ ACCORDION ============ */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      }
    });
  });

  /* ============ PRICING CARDS: visual selection (no real checkout) ============ */
  var cardLinks = document.querySelectorAll('.card-link');
  cardLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      cardLinks.forEach(function (l) { l.querySelector('.card').classList.remove('selected'); });
      link.querySelector('.card').classList.add('selected');
      document.getElementById('contacto') && document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ============ CONTACT FORM (client-side only demo) ============ */
  var form = document.getElementById('contact-form');
  if (form) {
    var msgBox = document.getElementById('form-message');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll('.form-row').forEach(function (row) {
        var field = row.querySelector('input, textarea');
        row.classList.remove('error');
        if (field.hasAttribute('required') && !field.value.trim()) {
          row.classList.add('error');
          valid = false;
        }
        if (field.type === 'email' && field.value.trim()) {
          var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(field.value.trim())) {
            row.classList.add('error');
            valid = false;
          }
        }
      });

      msgBox.hidden = false;
      if (valid) {
        msgBox.className = 'form-message success';
        msgBox.textContent = '¡Gracias! Tu mensaje quedó registrado. Te responderemos por correo o WhatsApp.';
        form.reset();
      } else {
        msgBox.className = 'form-message error';
        msgBox.textContent = 'Hubo un error al intentar enviar su formulario. Por favor, inténtelo de nuevo.';
      }
    });
  }

})();
