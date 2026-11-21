/* ═══════════════════════════════════════════════════════════════
   login.js  —  Login / Register page logic
   Connected to POST /api/Auth/login & POST /api/Auth/register
   ═══════════════════════════════════════════════════════════════ */

// Redirect if already logged in
if (API.auth.isLoggedIn()) {
  window.location.href = 'dashboard.html';
}

/* ── Tab Switch ── */
function switchTab(tab) {
  document.getElementById('panel-login').classList.toggle('active', tab === 'login');
  document.getElementById('panel-register').classList.toggle('active', tab === 'register');
  document.getElementById('tab-login-btn').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register-btn').classList.toggle('active', tab === 'register');
}

/* ── Sign In (POST /api/Auth/login) ── */
async function handleLogin() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) return showToast('Please fill in email and password', 'error');

  const btn = document.getElementById('login-btn');
  btn.disabled = true;
  btn.textContent = 'Signing in…';
  try {
    await API.auth.login(email, password);
    showToast('Welcome back! ⚡', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 400);
  } catch (e) {
    showToast(e.message || 'Invalid credentials', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '⚡ Sign In';
  }
}

/* ── Register (POST /api/Auth/register) ── */
async function handleRegister() {
  const fullName = document.getElementById('reg-name').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const pass     = document.getElementById('reg-password').value;
  const confirm  = document.getElementById('reg-confirm').value;

  if (!fullName || !email || !pass) return showToast('Please fill in all required fields', 'error');
  if (pass.length < 6)              return showToast('Password must be at least 6 characters', 'error');
  if (confirm && pass !== confirm)   return showToast('Passwords do not match', 'error');

  const btn = document.getElementById('reg-btn');
  btn.disabled = true;
  btn.textContent = 'Creating account…';
  try {
    await API.auth.register({
      fullName,
      email,
      password: pass,
      confirmPassword: confirm || pass,
    });
    showToast('Account created! Welcome to TimeVerse 🎉', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 600);
  } catch (e) {
    showToast(e.message || 'Registration failed', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '🚀 Create Account';
  }
}

/* ── Demo Login ── */
async function demoLogin() {
  try {
    await API.auth.login('tony@stark.edu', 'demo123');
    window.location.href = 'dashboard.html';
  } catch (e) {
    showToast('Demo login failed', 'error');
  }
}

/* ── Enter Key ── */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  if (document.getElementById('panel-login').classList.contains('active')) {
    handleLogin();
  } else {
    handleRegister();
  }
});
