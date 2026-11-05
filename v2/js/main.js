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
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(function (el) { observer.observe(el); });
})();
