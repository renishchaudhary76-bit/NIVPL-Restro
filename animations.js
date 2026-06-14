/**
 * NIVPL — animations.js
 * Handles: page transitions, scroll reveals, staggered cards,
 * nav scroll behaviour, counter animation, cursor glow,
 * hover tilt on cards, hero parallax, mobile nav drawer.
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. PAGE TRANSITION — fade out on leave,
        fade in on arrive
  ───────────────────────────────────────────── */
  const overlay = document.createElement('div');
  overlay.id = 'page-overlay';
  document.body.appendChild(overlay);

  // Fade in on load
  window.addEventListener('load', () => {
    overlay.classList.add('fade-out');
    setTimeout(() => { overlay.style.display = 'none'; }, 500);
  });

  // Intercept internal links
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;
    // Skip: external, hash-only, mailto, tel, target=_blank
    if (
      link.target === '_blank' ||
      href.startsWith('http') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      href.startsWith('#')
    ) return;

    e.preventDefault();
    overlay.style.display = 'block';
    overlay.classList.remove('fade-out');
    overlay.classList.add('fade-in');
    setTimeout(() => { window.location.href = href; }, 380);
  });


  /* ─────────────────────────────────────────────
     2. NAVBAR — shrink + shadow on scroll
  ───────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled', 'nav-shrunk');
      } else {
        navbar.classList.remove('scrolled', 'nav-shrunk');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ─────────────────────────────────────────────
     3. MOBILE NAV DRAWER
  ───────────────────────────────────────────── */
  const toggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    // Build drawer if mobile
    const drawer = document.createElement('div');
    drawer.className = 'mobile-drawer';
    drawer.innerHTML = navLinks.innerHTML;
    document.body.appendChild(drawer);

    const drawerOverlay = document.createElement('div');
    drawerOverlay.className = 'drawer-overlay';
    document.body.appendChild(drawerOverlay);

    let drawerOpen = false;

    function openDrawer() {
      drawerOpen = true;
      drawer.classList.add('open');
      drawerOverlay.classList.add('visible');
      toggle.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawerOpen = false;
      drawer.classList.remove('open');
      drawerOverlay.classList.remove('visible');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => drawerOpen ? closeDrawer() : openDrawer());
    drawerOverlay.addEventListener('click', closeDrawer);

    // Close on link click inside drawer
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeDrawer);
    });

    // Animated hamburger lines
    toggle.innerHTML = `<span></span><span></span><span></span>`;
  }


  /* ─────────────────────────────────────────────
     4. SCROLL REVEAL — staggered per group
  ───────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;

      // Stagger siblings in the same parent grid/flex container
      const parent = entry.target.parentElement;
      const siblings = parent ? [...parent.querySelectorAll('.reveal:not(.visible)')] : [];
      const idx = siblings.indexOf(entry.target);
      const delay = idx >= 0 ? idx * 80 : 0;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));


  /* ─────────────────────────────────────────────
     5. COUNTER ANIMATION
  ───────────────────────────────────────────── */
  const counters = document.querySelectorAll('.count');
  let countersRun = false;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function runCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const dec = parseInt(el.dataset.decimals || 0);
    const dur = 1600;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = (target * easeOutExpo(p)).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (counters.length) {
    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) {
      const counterObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !countersRun) {
          countersRun = true;
          counters.forEach((c, i) => setTimeout(() => runCounter(c), i * 120));
        }
      }, { threshold: 0.3 });
      counterObs.observe(statsEl);
    }
  }


  /* ─────────────────────────────────────────────
     6. TILT ON HOVER — brand tiles, cards
  ───────────────────────────────────────────── */
  const tiltTargets = document.querySelectorAll(
    '.brand-tile, .brand-overview-card, .diff-card, .pillar-card, .careers-why-card, .news-card, .outlet-card'
  );

  tiltTargets.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotX = (-y * 5).toFixed(2);
      const rotY = (x * 5).toFixed(2);
      el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
      el.style.transition = 'transform 0.05s linear';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s ease';
    });
  });


  /* ─────────────────────────────────────────────
     7. HERO PARALLAX — right panel on scroll
  ───────────────────────────────────────────── */
  const heroRight = document.querySelector('.hero-right');
  if (heroRight) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroRight.style.transform = `translateY(${y * 0.12}px)`;
    }, { passive: true });
  }


  /* ─────────────────────────────────────────────
     8. SMOOTH ANCHOR SCROLL
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  /* ─────────────────────────────────────────────
     9. CURSOR GLOW — desktop only
  ───────────────────────────────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);

    let mx = -200, my = -200;
    let cx = -200, cy = -200;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    function animateCursor() {
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Grow on interactive elements
    const interactives = document.querySelectorAll('a, button, .brand-tile, .brand-overview-card, .outlet-card');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => glow.classList.add('hover'));
      el.addEventListener('mouseleave', () => glow.classList.remove('hover'));
    });
  }


  /* ─────────────────────────────────────────────
     10. SECTION HEADING UNDERLINE WIPE
         — animates .divider width on scroll-in
  ───────────────────────────────────────────── */
  const dividers = document.querySelectorAll('.divider');
  const dividerObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('divider-animate');
        dividerObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  dividers.forEach(d => dividerObs.observe(d));


  /* ─────────────────────────────────────────────
     11. NEWS FILTER — animated hide/show
  ───────────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.news-filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.news-card').forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          if (show) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              card.style.opacity = '1';
              card.style.transform = '';
            });
          } else {
            card.style.transition = 'opacity 0.2s ease';
            card.style.opacity = '0';
            setTimeout(() => { card.style.display = 'none'; }, 200);
          }
        });
      });
    });
  }


  /* ─────────────────────────────────────────────
     12. TRUST STRIP — number ticker on enter
  ───────────────────────────────────────────── */
  const trustIcons = document.querySelectorAll('.trust-item-icon');
  const trustObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('trust-pop');
        trustObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  trustIcons.forEach(t => trustObs.observe(t));

})();
