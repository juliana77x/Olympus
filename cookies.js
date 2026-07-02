/* ============================================================
   OLYMPUS — cookies.js (corregido)
   Gestión de consentimiento de cookies, con:
     · Comprobación real de caducidad (365 días) — antes nunca
       se validaba y el aviso jamás volvía a aparecer.
     · Manejo de errores en localStorage (modo incógnito /
       navegadores que lo bloquean no rompen el script).
     · Opt-in por defecto para Analíticas/Marketing (privacidad
       por defecto — requisito habitual en auditorías GDPR/LOPD).
     · Reapertura de preferencias en cualquier momento.
     · Manejo de teclado (Escape, foco) en el modal.

   NOTA: si usas este archivo externo, asegúrate de que la ruta
   "js/cookies.js" resuelve correctamente en tu hosting (revisa
   la pestaña Network del navegador: no debe dar 404). Si tienes
   dudas, usa la versión inline incluida directamente en el
   <body> del index.html, que no depende de ninguna ruta externa.
   ============================================================ */

   (function () {
    'use strict';
  
    var CONSENT_KEY = 'olympus_cookie_consent';
    var CONSENT_VERSION = 1;
    var CONSENT_DAYS = 365;
  
    var banner, modal, chkAnalytics, chkMarketing, lastFocusedEl;
  
    function setCookieRaw(name, value, days) {
      try {
        var expires = '';
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
          expires = '; expires=' + date.toUTCString();
        }
        var secure = (location.protocol === 'https:') ? '; Secure' : '';
        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax' + secure;
        return true;
      } catch (e) {
        console.warn('Olympus cookies: no se pudo guardar la cookie', e);
        return false;
      }
    }
    function getCookieRaw(name) {
      try {
        var match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : null;
      } catch (e) {
        return null;
      }
    }
    function deleteCookieRaw(name) {
      try { document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax'; }
      catch (e) {}
    }
  
    function readConsent() {
      var raw = getCookieRaw(CONSENT_KEY);
      if (!raw) return null;
      try {
        var data = JSON.parse(raw);
        if (!data || typeof data !== 'object') return null;
        if (data.version !== CONSENT_VERSION) return null;
        return data; // la caducidad ya la controla el navegador (expires de la cookie)
      } catch (e) {
        return null;
      }
    }
  
    function writeConsent(analytics, marketing) {
      var data = {
        version: CONSENT_VERSION,
        essential: true,
        analytics: !!analytics,
        marketing: !!marketing,
        grantedAt: Date.now()
      };
      setCookieRaw(CONSENT_KEY, JSON.stringify(data), CONSENT_DAYS);
      applyConsent(data);
      return data;
    }
  
    function applyConsent(data) {
      document.dispatchEvent(new CustomEvent('olympus:cookie-consent', { detail: data }));
      if (data.analytics) { /* activar analítica real aquí */ }
      if (data.marketing) { /* activar marketing real aquí */ }
    }
  
    function showBanner() { if (banner) banner.classList.add('show'); }
    function hideBanner() { if (banner) banner.classList.remove('show'); }
  
    function openModal() {
      if (!modal) return;
      lastFocusedEl = document.activeElement;
      var current = readConsent();
      if (chkAnalytics) chkAnalytics.checked = current ? !!current.analytics : false;
      if (chkMarketing) chkMarketing.checked = current ? !!current.marketing : false;
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
    window.clearOlympusCookieConsent = function () {
      deleteCookieRaw(CONSENT_KEY);
      location.reload();
    };
  
    function init() {
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
        applyConsent(consent);
        return;
      }
      showBanner();
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
    window.addEventListener('load', function () {
      if (!readConsent()) showBanner();
    });
  })();