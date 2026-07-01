/* ============================================================
   OLYMPUS — nav.js
   Scroll: bg + ocultar/mostrar · Mobile menu toggle
   Controla el comportamiento inteligente del menú de navegación 
   al hacer scroll y gestiona el menú móvil
   ============================================================ */

function initNav() {
  var nav         = document.getElementById('main-nav');
  var menuBtn     = document.getElementById('menu-btn');
  var mobileMenu  = document.getElementById('mobile-menu');
  var menuIcon    = document.getElementById('menu-icon');

  if (!nav) return;

  /* ── Scroll behavior ──────────────────────────────────── */
  var lastScroll = 0;
  var ticking    = false;

  function updateNav() {
    var scroll = window.scrollY;

    // Añade fondo al hacer scroll
    if (scroll > 40) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }

    // Oculta bajando, muestra subiendo
    if (scroll > lastScroll && scroll > 180) {
      nav.classList.add('nav-hidden');
      // Cerrar mobile menu si se oculta el nav
      if (mobileMenu) mobileMenu.classList.remove('open');
    } else {
      nav.classList.remove('nav-hidden');
    }

    lastScroll = scroll;
    ticking    = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  /* ── Mobile menu ──────────────────────────────────────── */
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      var isOpen = mobileMenu.classList.toggle('open');
      if (menuIcon) {
        menuIcon.className = isOpen
          ? 'ri-close-line text-2xl'
          : 'ri-menu-3-line text-2xl';
      }
    });

    // Cerrar al hacer clic en un enlace
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        if (menuIcon) menuIcon.className = 'ri-menu-3-line text-2xl';
      });
    });
  }

  /* ── Smooth scroll en anclas ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}