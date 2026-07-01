/* ============================================================
   OLYMPUS — screenshots.js
   Tabs interactivos para cambiar la pantalla del teléfono 
   Controla un componente de mockup de teléfono donde el usuario puede clicar tabs (Dashboard, Rutinas, Nutrición, etc.) 
   para ver distintas pantallas con una transición de fade.
   ============================================================ */

   /* defino arrays de 5 objetos*/
var SCREENS = [
  {
    label: 'Dashboard',
    img:   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=480&q=85',
    alt:   'Pantalla de Dashboard en Olympus'
  },
  {
    label: 'Rutinas',
    img:   'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=480&q=85',
    alt:   'Pantalla de Rutinas en Olympus'
  },
  {
    label: 'Nutrición',
    img:   'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=480&q=85',
    alt:   'Pantalla de Nutrición en Olympus'
  },
  {
    label: 'Progreso',
    img:   'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=480&q=85',
    alt:   'Pantalla de Progreso en Olympus'
  },
  {
    label: 'Perfil',
    img:   'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=480&q=85',
    alt:   'Pantalla de Perfil en Olympus'
  }
];

var currentScreen = 0;

function initScreenshots() {
  var tabs      = document.querySelectorAll('.screen-tab');
  var phoneImg  = document.getElementById('phone-img');
  var phoneImg2 = document.getElementById('phone-img-2');

  if (!tabs.length || !phoneImg) return;

  function switchScreen(index) {
    if (index === currentScreen) return;
    currentScreen = index;
    var screen = SCREENS[index];

    // Fade out
    phoneImg.classList.add('fade');

    setTimeout(function() {
      phoneImg.src = screen.img;
      phoneImg.alt = screen.alt;
      if (phoneImg2) {
        phoneImg2.src = SCREENS[(index + 1) % SCREENS.length].img;
      }
      // Fade in
      phoneImg.classList.remove('fade');
    }, 300);

    // Actualizar estado de tabs
    tabs.forEach(function(tab, i) {
      var arrow   = tab.querySelector('.tab-arrow');
      var numEl   = tab.querySelector('.tab-num');
      var isActive = i === index;

      tab.classList.toggle('active', isActive);
      tab.style.opacity = isActive ? '1' : '0.25';
      tab.style.color   = isActive ? '#ffffff' : '';

      if (arrow) {
        if (isActive) {
          arrow.className = 'tab-arrow ri-arrow-right-line text-lg transition-transform duration-200 gradient-text translate-x-1';
        } else {
          arrow.className = 'tab-arrow ri-arrow-right-line text-lg transition-transform duration-200';
        }
      }

      if (numEl) {
        numEl.style.color = isActive
          ? 'rgba(255,255,255,0.4)'
          : 'rgba(255,255,255,0.15)';
      }
    });
  }

  // Bind click events
  tabs.forEach(function(tab, i) {
    tab.addEventListener('click', function() { switchScreen(i); });
  });

  // Estado inicial
  switchScreen(0);
}