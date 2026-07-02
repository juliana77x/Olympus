/* ============================================================
   OLYMPUS — cookies.js (Versión Final Certificada)
   ============================================================ */

   (function () {
    'use strict';
  
    // 1. Claves de las Cookies Reales
    var COOKIE_CONSENT_DONE = 'olympus_consent_given';
    var COOKIE_ANALYTICS = 'olympus_analytics_allowed';
    var COOKIE_MARKETING = 'olympus_marketing_allowed';
    
    var CONSENT_DAYS = 365;
    var banner, modal, chkAnalytics, chkMarketing, lastFocusedEl;
  
    // 2. Helpers para Cookies (API Nativa)
    function getCookie(name) {
      try {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i].trim();
          if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
      } catch (e) {
        console.warn('Olympus cookies: Error al leer cookie', e);
        return null;
      }
    }
  
    function setCookie(name, value) {
      try {
        var maxAge = CONSENT_DAYS * 24 * 60 * 60;
        document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; max-age=" + maxAge + "; SameSite=Lax; Secure";
        return true;
      } catch (e) {
        console.warn('Olympus cookies: Error al escribir cookie', e);
        return false;
      }
    }
  
    function removeCookie(name) {
      document.cookie = name + "=; path=/; max-age=0; SameSite=Lax; Secure";
    }
  
    // 3. Lógica de Consentimiento
    function readConsent() {
      var consentDone = getCookie(COOKIE_CONSENT_DONE);
      if (!consentDone) return null;
  
      return {
        analytics: getCookie(COOKIE_ANALYTICS) === 'true',
        marketing: getCookie(COOKIE_MARKETING) === 'true'
      };
    }
  
    function writeConsent(analytics, marketing) {
      setCookie(COOKIE_CONSENT_DONE, 'true');
      setCookie(COOKIE_ANALYTICS, analytics ? 'true' : 'false');
      setCookie(COOKIE_MARKETING, marketing ? 'true' : 'false');
  
      var data = { analytics: !!analytics, marketing: !!marketing };
      document.dispatchEvent(new CustomEvent('olympus:cookie-consent', { detail: data }));
      return data;
    }
  
    // 4. Gestión de la Interfaz de Usuario (UI)
    function showBanner() { if (banner) banner.classList.add('show'); }
    function hideBanner() { if (banner) banner.classList.remove('show'); }
  
    function openModal() {
      if (!modal) return;
      lastFocusedEl = document.activeElement;
      var current = readConsent();
      if (chkAnalytics) chkAnalytics.checked = current ? current.analytics : false;
      if (chkMarketing) chkMarketing.checked = current ? current.marketing : false;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      document.addEventListener('keydown', onModalKeydown);
      var closeBtn = modal.querySelector('.cookie-config-close');
      if (closeBtn) closeBtn.focus();
    }
    
    function closeModal() {
      if (!modal) return;
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', onModalKeydown);
      if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();
    }
    
    function onModalKeydown(e) {
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key === 'Tab') {
        var focusables = modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  
    // 5. Funciones Globales para los botones del HTML
    window.acceptAllCookies = function () { writeConsent(true, true); hideBanner(); };
    window.rejectNonEssential = function () { writeConsent(false, false); hideBanner(); };
    window.openCookieConfig = function () { openModal(); };
    window.closeCookieConfig = function () { closeModal(); };
    window.saveCookiePreferences = function () {
      var analytics = chkAnalytics ? chkAnalytics.checked : false;
      var marketing = chkMarketing ? chkMarketing.checked : false;
      writeConsent(analytics, marketing);
      closeModal();
      hideBanner();
    };
    window.configureCookies = function () { openModal(); };
    window.closeCookieBanner = function () { hideBanner(); };
    
    // Limpieza absoluta para pruebas en consola
    window.clearOlympusCookieConsent = function () {
      removeCookie(COOKIE_CONSENT_DONE);
      removeCookie(COOKIE_ANALYTICS);
      removeCookie(COOKIE_MARKETING);
      localStorage.removeItem('olympus_cookie_consent'); // Borra el residuo viejo
      location.reload();
    };
  
    // 6. Inicialización
    function init() {
      // ESTA LÍNEA BORRA EL LOCALSTORAGE VIEJO QUE SE VE EN TU CAPTURA APENAS CARGA LA PÁGINA
      localStorage.removeItem('olympus_cookie_consent');
  
      banner = document.getElementById('cookie-banner');
      modal = document.getElementById('cookie-config-modal');
      chkAnalytics = document.getElementById('cookie-analytics');
      chkMarketing = document.getElementById('cookie-marketing');
  
      if (modal) {
        modal.addEventListener('click', function (e) {
          if (e.target === modal) closeModal();
        });
      }
      var footerLink = document.getElementById('footer-cookie-settings');
      if (footerLink) {
        footerLink.addEventListener('click', function (e) {
          e.preventDefault();
          openModal();
        });
      }
  
      var consent = readConsent();
      if (consent) {
        document.dispatchEvent(new CustomEvent('olympus:cookie-consent', { detail: consent }));
        return;
      }
      showBanner();
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();