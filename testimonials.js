/* ============================================================
   OLYMPUS — testimonials.js
   Switcher de testimonios con fade y actualización de contenido
   Gestiona una sección de testimonios donde el usuario puede clicar tabs
  para cambiar de persona, con rotación automática
   ============================================================ */

var TESTIMONIALS = [
  {
    name:   'Carlos Mendoza',
    role:   'Atleta amateur',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    quote:  'En 3 meses bajé 12 kg y gané músculo que nunca había logrado con otros métodos. La personalización es brutal.',
    badge:  '−12 kg en 3 meses'
  },
  {
    name:   'Valentina Ríos',
    role:   'Instructora de fitness',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80',
    quote:  'Como instructora he probado decenas de apps. Olympus es la única que tiene lógica real de progresión y se adapta de verdad al nivel del usuario.',
    badge:  '+8 kg de músculo'
  },
  {
    name:   'Andrés Castillo',
    role:   'Empresario',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80',
    quote:  'Con la agenda apretada que tengo, Olympus me organiza entrenamientos de 45 minutos. Bajé 8 kg sin sacrificar el rendimiento.',
    badge:  '−8 kg en 2 meses'
  },
  {
    name:   'Sofía Herrera',
    role:   'Estudiante universitaria',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&q=80',
    quote:  'Empecé sin saber nada de gimnasio. Los videos y la IA me guiaron desde cero. Ahora entreno sola con total confianza.',
    badge:  '6 meses sin parar'
  }
];

var currentTestimonial = 0;

function initTestimonials() {
  var tabs    = document.querySelectorAll('.testimonial-tab');
  var content = document.getElementById('testimonial-content');

  if (!tabs.length || !content) return;

  function updateContent(index) {
    var t = TESTIMONIALS[index];

    var quoteEl  = document.getElementById('t-quote');
    var nameEl   = document.getElementById('t-name');
    var roleEl   = document.getElementById('t-role');
    var avatarEl = document.getElementById('t-avatar');
    var badgeEl  = document.getElementById('t-badge');

    content.classList.add('fade');

    setTimeout(function() {
      if (quoteEl)  quoteEl.textContent  = t.quote;
      if (nameEl)   nameEl.textContent   = t.name;
      if (roleEl)   roleEl.textContent   = t.role;
      if (avatarEl) { avatarEl.src = t.avatar; avatarEl.alt = t.name; }
      if (badgeEl)  badgeEl.textContent  = t.badge;
      content.classList.remove('fade');
    }, 280);
  }

  function switchTestimonial(index) {
    if (index === currentTestimonial) return;
    currentTestimonial = index;

    // Actualizar tabs
    tabs.forEach(function(tab, i) {
      var isActive = i === index;
      tab.classList.toggle('active', isActive);
      tab.style.opacity = isActive ? '1' : '0.25';
    });

    updateContent(index);
  }

  // Bind clicks
  tabs.forEach(function(tab, i) {
    tab.addEventListener('click', function() { switchTestimonial(i); });
  });

  // Estado inicial (ya está renderizado en HTML para el primer testimonio)
  tabs[0].classList.add('active');
  tabs[0].style.opacity = '1';
}

/* Auto-rotate cada 6 segundos */
function initTestimonialsAutoRotate() {
  setInterval(function() {
    var next = (currentTestimonial + 1) % TESTIMONIALS.length;
    var tabs = document.querySelectorAll('.testimonial-tab');

    currentTestimonial = next;
    tabs.forEach(function(tab, i) {
      tab.classList.toggle('active', i === next);
      tab.style.opacity = i === next ? '1' : '0.25';
    });

    var content = document.getElementById('testimonial-content');
    if (content) {
      content.classList.add('fade');
      setTimeout(function() {
        var t = TESTIMONIALS[next];
        var quoteEl  = document.getElementById('t-quote');
        var nameEl   = document.getElementById('t-name');
        var roleEl   = document.getElementById('t-role');
        var avatarEl = document.getElementById('t-avatar');
        var badgeEl  = document.getElementById('t-badge');
        if (quoteEl)  quoteEl.textContent  = t.quote;
        if (nameEl)   nameEl.textContent   = t.name;
        if (roleEl)   roleEl.textContent   = t.role;
        if (avatarEl) { avatarEl.src = t.avatar; avatarEl.alt = t.name; }
        if (badgeEl)  badgeEl.textContent  = t.badge;
        content.classList.remove('fade');
      }, 280);
    }
  }, 6000);
}