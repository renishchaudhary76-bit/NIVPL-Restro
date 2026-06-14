/* ============================================================
   NIVPL Enhanced Animations
   Modern, smooth, performant animations
   ============================================================ */

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScrollTop = scrollTop;
});

// Intersection Observer for reveal animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all reveal elements
document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
  });
}

// Smooth counter animation
const countElements = document.querySelectorAll('.count');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const finalValue = parseInt(target.getAttribute('data-target'));
      const suffix = target.getAttribute('data-suffix') || '';
      const decimals = target.getAttribute('data-decimals') || '0';
      
      animateCounter(target, finalValue, suffix, decimals);
      counterObserver.unobserve(target);
    }
  });
}, { threshold: 0.5 });

countElements.forEach(el => counterObserver.observe(el));

function animateCounter(element, target, suffix, decimals) {
  const duration = 2000;
  const startValue = 0;
  const startTime = Date.now();
  
  const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);
  
  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeOutQuad(progress);
    const current = startValue + (target - startValue) * easeProgress;
    
    if (decimals > 0) {
      element.textContent = current.toFixed(decimals) + suffix;
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  update();
}

// Button ripple effect
const buttons = document.querySelectorAll('.btn-primary, .btn-outline');

buttons.forEach(button => {
  button.addEventListener('mousedown', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Parallax effect for hero section (subtle)
const heroSection = document.querySelector('.hero-right');
if (heroSection) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxAmount = scrolled * 0.5;
    heroSection.style.backgroundPosition = `0 ${parallaxAmount}px`;
  });
}

// Add CSS for animations if not present
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 40px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translate3d(-30px, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translate3d(30px, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .reveal {
    animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    opacity: 0;
  }

  .reveal.revealed {
    opacity: 1;
  }

  .brand-tile {
    animation-delay: 0.1s;
  }

  .outlet-card {
    animation-delay: 0.05s;
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .nav-links.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 76px;
    left: 0;
    right: 0;
    background: rgba(248,243,236,0.98);
    backdrop-filter: blur(16px);
    padding: 1.5rem;
    gap: 1rem;
    border-bottom: 1px solid rgba(107,31,42,0.1);
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
      gap: 0.5rem !important;
    }

    .nav-toggle {
      display: flex !important;
    }
  }

  /* Smooth transitions throughout */
  * {
    --webkit-font-smoothing: antialiased;
    --moz-osx-font-smoothing: grayscale;
  }

  /* Focus styles for accessibility */
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--burgundy);
    outline-offset: 2px;
  }

  /* Hover effects for links */
  a:not([class]) {
    transition: color 0.3s ease;
  }

  a:not([class]):hover {
    color: var(--burgundy);
  }
`;

document.head.appendChild(style);

console.log('✨ NIVPL Enhanced Animations Loaded');
