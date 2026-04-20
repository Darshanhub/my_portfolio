// Custom glow cursor with trail
(function() {
  const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    return;
  }

  const dot   = document.getElementById('cursorDot');
  const ring  = document.getElementById('cursorRing');
  const trail = document.getElementById('cursorTrail');
  if (!dot || !ring) return;

  const TRAIL_LEN = 8;
  const trailDots = [];

  for (let i = 0; i < TRAIL_LEN; i++) {
    const d = document.createElement('div');
    d.className = 'cursor-trail-dot';
    const size = 4 - i * 0.35;
    d.style.cssText = `width:${size}px;height:${size}px;opacity:${0.5 - i * 0.06};`;
    trail.appendChild(d);
    trailDots.push({ el: d, x: 0, y: 0 });
  }

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    // Dot is instant — no lag
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  document.addEventListener('mousedown', () => {
    const burst = document.createElement('div');
    burst.style.cssText = `position:fixed;left:${mx}px;top:${my}px;width:20px;height:20px;border-radius:50%;border:1.5px solid var(--cyan);pointer-events:none;z-index:9997;animation:cursor-burst 0.4s ease forwards;`;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 400);
  });

  // Toggle hover class on interactive elements
  const interactives = 'a, button, .hex-node, .flip-card, .badge, .contact-card, .magnetic';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  let frameCount = 0;
  const loop = () => {
    requestAnimationFrame(loop);

    // Ring follows with very slight lag (snappy feel)
    rx += (mx - rx) * 0.28;
    ry += (my - ry) * 0.28;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    // Trail (update every 2 frames for perf)
    if (frameCount % 2 === 0) {
      for (let i = TRAIL_LEN - 1; i > 0; i--) {
        trailDots[i].x = trailDots[i - 1].x;
        trailDots[i].y = trailDots[i - 1].y;
      }
      trailDots[0].x = rx;
      trailDots[0].y = ry;

      trailDots.forEach(td => {
        td.el.style.left = td.x + 'px';
        td.el.style.top  = td.y + 'px';
      });
    }

    frameCount++;
  };
  loop();
})();
