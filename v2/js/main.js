(function () {
  // Make sure the premium layer and mobile action bar exist on every page.
  if (!document.querySelector('link[href*="premium.css"]')) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'css/premium.css?v=1';
    document.head.appendChild(l);
  }

  if (!document.querySelector('.m-bar')) {
    var bar = document.createElement('div');
    bar.className = 'm-bar';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Quick contact');
    bar.innerHTML =
      '<a href="tel:0741008160" aria-label="Call us"><i class="fas fa-phone" aria-hidden="true"></i> Call</a>' +
      '<a class="m-wa" href="https://wa.me/94741008160?text=Hello%20Elegant%20Enterprises%2C%20I%20would%20like%20to%20make%20an%20enquiry." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i> Chat</a>' +
      '<a class="m-quote" href="contact.html">Get a quote</a>';
    document.body.appendChild(bar);

    // Hide the bar while scrolling down, show it when scrolling up.
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (Math.abs(y - lastY) < 8) return;
      bar.classList.toggle('is-hidden', y > lastY && y > 400);
      lastY = y;
    }, { passive: true });
  }
})();

(function () {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('menu-backdrop');
  const header = document.querySelector('header');

  if (!toggle || !menu) return;
  if (header) header.classList.add('relative');

  function setOpen(open) {
    menu.classList.toggle('open', open);
    menu.classList.toggle('hidden', !open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (backdrop) backdrop.classList.toggle('hidden', !open);
  }

  toggle.addEventListener('click', function () {
    setOpen(!menu.classList.contains('open'));
  });

  if (backdrop) {
    backdrop.addEventListener('click', function () {
      setOpen(false);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setOpen(false);
    });
  });
})();

(function () {
  const header = document.querySelector('header');
  if (header) {
    const onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // Drop the reveal class afterwards so elements get their own hover transitions back.
  function settle(el) {
    el.addEventListener('transitionend', function done(e) {
      if (e.propertyName !== 'transform') return;
      el.classList.remove('reveal', 'is-visible');
      el.removeEventListener('transitionend', done);
    });
  }

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(function (el) { el.classList.remove('reveal'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      settle(entry.target);
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(function (el) { observer.observe(el); });
})();
