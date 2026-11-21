/* ═══════════════════════════════════════════════════════════════
   index.js  —  Splash / Landing entry routing logic
   ═══════════════════════════════════════════════════════════════ */

setTimeout(() => {
  window.location.href = window.API?.auth?.isLoggedIn?.()
    ? 'pages/dashboard.html'
    : 'pages/login.html';
}, 1200);
