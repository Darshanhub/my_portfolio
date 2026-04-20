// Hex skill node tooltip + tap-to-flip on mobile
(function() {
  const tooltip  = document.getElementById('skillTooltip');
  const isMobile = window.innerWidth < 768;

  if (!tooltip) return;

  document.querySelectorAll('.hex-node').forEach(node => {
    const skill = node.dataset.skill;
    const level = node.dataset.level;

    node.addEventListener('mouseenter', e => {
      if (isMobile) return;
      tooltip.querySelector('.tooltip-skill').textContent = skill;
      tooltip.querySelector('.tooltip-level').textContent = level;
      tooltip.classList.add('visible');
    });

    node.addEventListener('mousemove', e => {
      if (isMobile) return;
      tooltip.style.left = (e.clientX + 14) + 'px';
      tooltip.style.top  = (e.clientY - 10) + 'px';
    });

    node.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
})();
