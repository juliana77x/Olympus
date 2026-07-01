/* ============================================================
   OLYMPUS — loader.js
   Precargador o
   ============================================================ */

function initLoader(onDone) {
  var loader  = document.getElementById('loader');
  var fill    = document.getElementById('loader-fill');
  var pct     = document.getElementById('loader-pct');
  var letters = document.querySelectorAll('.loader-logo span');

  if (!loader) { if (onDone) onDone(); return; }

  document.body.classList.add('is-loading');

  // Aparición escalonada de letras del logo
  letters.forEach(function(s, i) {
    setTimeout(function() { s.style.opacity = '1'; }, 120 + i * 70);
  });

 // Variable para registrar el momento exacto en que inicia la animación
var startTime = null;
var duration = 2000; 

/**
 * Función que se ejecuta en cada cuadro (frame) de la animación
 * @param {number} ts - Timestamp actual proporcionado por requestAnimationFrame
 */
function step(ts) {
  // En el primer frame, guardamos el tiempo de inicio
  if (!startTime) startTime = ts;

  // Calculamos cuánto tiempo ha pasado desde el inicio
  var elapsed = ts - startTime;
  
  // Calculamos el progreso (de 0 a 1). Math.min asegura que no pase de 100%
  var progress = Math.min(elapsed / duration, 1);

  // Esto hace que la animación empiece rápido y se detenga suavemente al final
  var eased = 1 - Math.pow(1 - progress, 3);
  var num = Math.round(eased * 100);

  // Actualizamos el texto del porcentaje (ej: "045%") con ceros a la izquierda
  if (pct) pct.textContent = String(num).padStart(3, '0') + '%';
  
  // Escalamos la barra de carga visualmente usando CSS transform
  if (fill) fill.style.transform = 'scaleX(' + eased + ')';

  // Si no hemos llegado al 100%, solicitamos el siguiente cuadro
  if (progress < 1) {
    requestAnimationFrame(step);
  } else {
    // --- Lógica de salida una vez terminada la carga ---
    
    // 1. Breve pausa de 200ms para que el usuario vea el 100%
    setTimeout(function() {
      // 2. Añadimos clase CSS para animar la desaparición (fade out/slide)
      loader.classList.add('exit');
      
      // 3. Esperamos a que termine la transición de salida (850ms)
      setTimeout(function() {
        loader.remove(); // Eliminamos el loader del DOM
        document.body.classList.remove('is-loading'); // Reactivamos el scroll o estilos del body
        
        // 4. Si existe una función callback 'onDone', la ejecutamos
        if (typeof onDone === 'function') onDone();
      }, 850);
    }, 200);
  }
}

// Iniciamos el ciclo de la animación
requestAnimationFrame(step);}