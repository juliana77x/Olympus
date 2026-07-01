/* ============================================================
   OLYMPUS — scroll.js
   IntersectionObserver · Parallax · Hero entrance post-loader
   Agrupa cuatro utilidades relacionadas con el scroll y la entrada visual de elementos.
   ============================================================ */

/* ── Scroll reveals ───────────────────────────────────────── */
function initReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -48px 0px'
  });

  els.forEach(function(el) { io.observe(el); });
}

/* ── Hero parallax ────────────────────────────────────────── */
function initParallax() {
  var img = document.querySelector('.hero-parallax');
  if (!img) return;

  var ticking = false;

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        var offset = window.scrollY * 0.32;
        img.style.transform = 'translateY(' + offset + 'px)';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── Hero text entrance (dispara después del loader) ──────── */
function initHeroEntrance() {
  var lines   = document.querySelectorAll('.hero-line-inner');
  var eyebrow = document.querySelector('.hero-eyebrow span');

  // Eyebrow aparece primero
  if (eyebrow) {
    setTimeout(function() {
      eyebrow.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1)';
      eyebrow.style.opacity    = '1';
    }, 50);
  }

  // Líneas de título con stagger
  lines.forEach(function(line, i) {
    setTimeout(function() {
      line.classList.add('animate');
    }, 80 + i * 110);
  });

  // Activar reveals normales con ligero delay
  setTimeout(initReveal, 300);
}

/* ── Scroll hint (flecha abajo) ───────────────────────────── */
function initScrollHint() {
  var hint = document.querySelector('.scroll-hint');
  if (!hint) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      hint.style.opacity = '0';
    } else {
      hint.style.opacity = '1';
    }
  }, { passive: true });  /* hace q el scroll sea más fluido */
}