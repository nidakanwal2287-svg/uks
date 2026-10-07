// GSAP Animations, ScrollTrigger & Interactive Showroom Features

document.addEventListener('DOMContentLoaded', () => {
  // 1. GSAP Hero Section Load Animation
  if (typeof gsap !== 'undefined') {
    // Register ScrollTrigger plugin if available
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Staggered entrance for hero typography (bottom-to-top)
    heroTl.from('.hero-badge', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.2
    })
    .from('.hero-title-line', {
      opacity: 0,
      y: 60,
      duration: 1,
      stagger: 0.2
    }, '-=0.5')
    .from('.hero-desc', {
      opacity: 0,
      y: 30,
      duration: 0.8
    }, '-=0.6')
    .from('.hero-cta-btn', {
      opacity: 0,
      y: 25,
      duration: 0.7,
      stagger: 0.15
    }, '-=0.5')
    // Car image standard scale (1.2 -> 1.0) and opacity transition
    .fromTo('.hero-car-img', 
      { scale: 1.25, opacity: 0 },
      { scale: 1.0, opacity: 1, duration: 1.6, ease: 'expo.out' },
      '-=1.2'
    );

    // 2. Scroll-Driven Car Reveal with ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined' && document.querySelector('.hero-car-img')) {
      gsap.to('.hero-car-img', {
        scrollTrigger: {
          trigger: '.hero-swiper',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        },
        scale: 1.08,
        y: 80,
        filter: 'brightness(0.7)'
      });

      // Scroll-driven animation on Featured section car cards
      gsap.utils.toArray('.glass-card').forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power2.out'
        });
      });
    }
  }

  // 3. Interactive Stats Counter (Scroll-Triggered)
  initStatsCounters();
});

// Interactive Car Color Switcher Implementation
const CAR_COLOR_PRESETS = {
  '#0B0C10': {
    name: 'Obsidian Black',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80',
    accent: '#66FCF1',
    hp: 780,
    topSpeed: '340 km/h',
    accel: '2.8s'
  },
  '#D1001C': {
    name: 'Crimson Red',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80',
    accent: '#FF3366',
    hp: 790,
    topSpeed: '345 km/h',
    accel: '2.7s'
  },
  '#0044FF': {
    name: 'Electric Blue',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
    accent: '#66FCF1',
    hp: 780,
    topSpeed: '340 km/h',
    accel: '2.8s'
  },
  '#E5E5E5': {
    name: 'Liquid Silver',
    image: 'https://images.unsplash.com/photo-1632245889027-e406faaa19cc?auto=format&fit=crop&w=1000&q=80',
    accent: '#66FCF1',
    hp: 760,
    topSpeed: '335 km/h',
    accel: '2.9s'
  }
};

window.changeCarColor = function(colorHex, colorName) {
  const display = document.getElementById('carDisplay');
  const imgElem = document.getElementById('customizerCarImg');
  const specLabel = document.getElementById('customizerColorName');
  const btns = document.querySelectorAll('.color-btn');

  // Update active button state
  btns.forEach(b => {
    b.classList.remove('active');
    if (b.dataset.color === colorHex) b.classList.add('active');
  });

  const preset = CAR_COLOR_PRESETS[colorHex] || {
    name: colorName,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
    accent: '#66FCF1',
    hp: 780,
    topSpeed: '340 km/h',
    accel: '2.8s'
  };

  if (display) {
    display.style.backgroundColor = colorHex;
    display.style.borderColor = preset.accent;
  }

  if (specLabel) {
    specLabel.textContent = `${preset.name} Specification`;
    specLabel.style.color = preset.accent;
  }

  if (imgElem) {
    // Smooth image transition
    imgElem.style.opacity = '0';
    imgElem.style.transform = 'scale(0.96)';
    setTimeout(() => {
      imgElem.src = preset.image;
      imgElem.style.opacity = '1';
      imgElem.style.transform = 'scale(1)';
    }, 250);
  }

  // Update detail labels
  const hpElem = document.getElementById('customizerHp');
  const speedElem = document.getElementById('customizerSpeed');
  const accelElem = document.getElementById('customizerAccel');
  if (hpElem) hpElem.textContent = `${preset.hp} HP`;
  if (speedElem) speedElem.textContent = preset.topSpeed;
  if (accelElem) accelElem.textContent = preset.accel;
};

// Animated Stats Counter Function
function initStatsCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const triggerCounters = () => {
    if (animated) return;
    
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let current = 0;
      const stepTime = 20;
      const totalSteps = 60;
      const increment = target / totalSteps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.innerText = target % 1 !== 0 ? target.toFixed(1) : target;
          clearInterval(timer);
        } else {
          counter.innerText = target % 1 !== 0 ? current.toFixed(1) : Math.floor(current);
        }
      }, stepTime);
    });

    animated = true;
  };

  // Scroll listener or intersection observer
  const statsContainer = document.querySelector('.stats-container');
  if (statsContainer) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        triggerCounters();
      }
    }, { threshold: 0.3 });
    observer.observe(statsContainer);
  } else {
    triggerCounters();
  }
}
