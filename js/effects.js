// Matrix rain canvas + mobile flip cards
(function() {
  const isMobile = window.innerWidth < 768;

  // ── Matrix Rain ──
  if (!isMobile) {
    const canvas = document.getElementById('matrixCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');

      const resize = () => {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };
      resize();
      window.addEventListener('resize', resize, { passive: true });

      const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';
      const COL_W = 18;
      const cols  = Math.floor(canvas.width / COL_W);
      const drops = Array.from({ length: cols }, () => Math.random() * -50);

      let lastTime = 0;
      const FPS = 20;
      const INTERVAL = 1000 / FPS;

      const draw = (time) => {
        requestAnimationFrame(draw);
        if (time - lastTime < INTERVAL) return;
        lastTime = time;

        ctx.fillStyle = 'rgba(5, 5, 16, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `14px 'JetBrains Mono', monospace`;

        drops.forEach((y, i) => {
          const char = CHARS[Math.floor(Math.random() * CHARS.length)];
          const x = i * COL_W;

          // Head: bright
          ctx.fillStyle = '#00f5ff';
          ctx.fillText(char, x, y * COL_W);

          // Trail: dim
          ctx.fillStyle = 'rgba(0, 245, 255, 0.3)';
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, (y - 1) * COL_W);

          if (y * COL_W > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i] += 0.5;
        });
      };

      requestAnimationFrame(draw);
    }
  }

  // ── Mobile flip cards (tap to flip) ──
  if (isMobile || window.matchMedia('(hover: none)').matches) {
    document.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  }
})();
