// Main init orchestrator
(function() {
  // ── Typed.js ──
  if (typeof Typed !== 'undefined') {
    new Typed('#typedRoles', {
      strings: [
        'ML / AI Engineer',
        'Computer Vision Specialist',
        'MLOps Architect',
        'Hackathon Champion',
        'Graduate Researcher @ SJSU',
        'CUDA / C++ Performance Eng.',
      ],
      typeSpeed: 52,
      backSpeed: 28,
      backDelay: 2000,
      loop: true,
      cursorChar: '█',
    });
  }

  // ── Smooth anchor scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Hero canvas resize ──
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    const setCanvasSize = () => {
      heroCanvas.style.width  = heroCanvas.parentElement.offsetWidth  + 'px';
      heroCanvas.style.height = heroCanvas.parentElement.offsetHeight + 'px';
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize, { passive: true });
  }

})();
