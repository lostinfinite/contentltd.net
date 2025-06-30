// Bento box scroll-triggered animation
(function() {
  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight * 0.85) &&
      rect.bottom >= 0
    );
  }

  function triggerBentoAnimation() {
    var grid = document.querySelector('.features-bento-grid');
    if (!grid) return;
    var cards = grid.querySelectorAll('.feature-card');
    if (isInViewport(grid)) {
      grid.classList.add('bento-animated');
      cards.forEach(function(card, i) {
        setTimeout(function() {
          card.classList.add('bento-popin');
          card.classList.remove('bento-popout');
        }, i * 120);
      });
    } else {
      grid.classList.remove('bento-animated');
      cards.forEach(function(card, i) {
        setTimeout(function() {
          card.classList.remove('bento-popin');
          card.classList.add('bento-popout');
        }, (cards.length - i - 1) * 80);
      });
    }
  }

  document.addEventListener('scroll', triggerBentoAnimation, { passive: true });
  window.addEventListener('resize', triggerBentoAnimation);
  window.addEventListener('DOMContentLoaded', triggerBentoAnimation);
})();
