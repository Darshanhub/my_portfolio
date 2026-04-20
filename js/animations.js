// GSAP + ScrollTrigger animations
(function() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Mark body so CSS can gate [data-reveal] opacity:0
  document.body.classList.add('js-ready');

  // ── Generic reveal ──
  gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 50, filter: 'blur(6px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out',
        delay: (i % 4) * 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  });

  // ── Hex nodes stagger reveal ──
  const hexNodes = gsap.utils.toArray('.hex-node');
  if (hexNodes.length) {
    gsap.from(hexNodes, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.6)',
      stagger: 0.05,
      scrollTrigger: {
        trigger: '.hex-grid',
        start: 'top 80%',
      }
    });
  }

  // ── Timeline line draw ──
  const timelineLine = document.getElementById('timelineLine');
  if (timelineLine) {
    ScrollTrigger.create({
      trigger: '.timeline',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1,
      onUpdate: self => {
        const totalH = timelineLine.parentElement.offsetHeight;
        timelineLine.style.height = (self.progress * totalH) + 'px';
      }
    });
  }

  // ── Badge drop-bounce ──
  const badges = gsap.utils.toArray('.badge');
  if (badges.length) {
    gsap.from(badges, {
      y: -50,
      rotation: -10,
      opacity: 0,
      duration: 0.7,
      ease: 'bounce.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.badges-grid',
        start: 'top 80%',
      }
    });
  }

  // ── Stat counter animation ──
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function() {
            el.textContent = Math.round(this.targets()[0].val);
          }
        });
      }
    });
  });

  // ── Projects fly in ──
  gsap.utils.toArray('.flip-card').forEach((card, i) => {
    gsap.from(card, {
      x: i % 2 === 0 ? -60 : 60,
      opacity: 0,
      rotateY: i % 2 === 0 ? -15 : 15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
      }
    });
  });

  // ── Nav scroll effect ──
  const nav = document.getElementById('mainNav');
  if (nav) {
    ScrollTrigger.create({
      start: 80,
      onUpdate: self => {
        nav.classList.toggle('scrolled', self.scroll() > 80);
      }
    });
  }

  // ── Active nav link on scroll ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  sections.forEach(sec => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: self => {
        if (self.isActive) {
          navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id);
          });
        }
      }
    });
  });

  // ── Hamburger menu ──
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // ── 3D card tilt on hover ──
  document.querySelectorAll('.holo-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * -6;
      const ry = ((e.clientX - cx) / (rect.width  / 2)) * 6;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();
