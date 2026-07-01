/* ============================================================
   OLYMPUS — main.js
   Entry point: inicializa loader → luego todas las features
   main js es el archivo q une todo
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

  // 1. Lanzar loader. Cuando termine → arrancar todo lo demás
  initLoader(function onLoaderDone() {

    // Hero entrance con stagger
    initHeroEntrance();

    // Hero image: animación de zoom out al cargar
    var heroImg = document.getElementById('hero-img');
    if (heroImg) {
      if (heroImg.complete) {
        heroImg.classList.add('loaded');
      } else {
        heroImg.addEventListener('load', function() {
          heroImg.classList.add('loaded');
        });
      }
    }

    // Nav, scroll, parallax
    initNav();
    initParallax();
    initScrollHint();

    // Interactividad
    initScreenshots();
    initTestimonials();
    initTestimonialsAutoRotate();
  });

});