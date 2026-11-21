/* ═══════════════════════════════════════════════════════════════════
   TimeVerse — Shared Utilities & Templates  (English / M-Theme v2)
   ═══════════════════════════════════════════════════════════════════ */

// Redirect from file:// to localhost:3000 for proper database communication & cross-browser sync
if (window.location.protocol === 'file:') {
  const relPath = window.location.pathname.replace(/^.*[\\\/]frontend[\\\/]/i, '').replace(/\\/g, '/');
  window.location.href = 'http://localhost:3000/' + relPath;
}

/* ── Sidebar HTML ────────────────────────────────────────────────── */
const SIDEBAR_HTML = `
<aside class="sidebar" id="sidebar">
  <div class="sidebar-logo">
    <div class="sidebar-logo-icon">⏳</div>
    <div class="sidebar-logo-text">
      <span class="sidebar-logo-name">TimeVerse</span>
      <span class="sidebar-logo-sub">M-Theme · Infinity</span>
    </div>
    <button class="sidebar-close-btn" onclick="closeMobileSidebar()" aria-label="Close Navigation Menu">✕</button>
  </div>

  <nav class="sidebar-nav">
    <span class="sidebar-section-label">Main</span>
    <a href="dashboard.html"     class="nav-item" data-page="dashboard" data-stone="power">
      <span class="nav-icon">🏠</span><span class="nav-label">Dashboard</span>
    </a>
    <a href="courses.html"       class="nav-item" data-page="courses"   data-stone="space">
      <span class="nav-icon">📚</span><span class="nav-label">My Courses</span>
    </a>
    <a href="schedule.html"      class="nav-item" data-page="schedule"  data-stone="reality">
      <span class="nav-icon">📅</span><span class="nav-label">Schedule &amp; Exams</span>
    </a>

    <span class="sidebar-section-label">Tasks &amp; Studies</span>
    <a href="tasks.html"         class="nav-item" data-page="tasks"     data-stone="soul">
      <span class="nav-icon">✅</span><span class="nav-label">My Tasks</span>
    </a>
    <a href="study-planner.html" class="nav-item" data-page="planner"   data-stone="time">
      <span class="nav-icon">🧠</span><span class="nav-label">Study Plans &amp; Sessions</span>
    </a>

    <span class="sidebar-section-label">Account</span>
    <a href="profile.html"       class="nav-item" data-page="profile"   data-stone="mind">
      <span class="nav-icon">👤</span><span class="nav-label">Profile &amp; Settings</span>
    </a>

    <div class="sidebar-logout-wrap">
      <button onclick="handleLogout()" class="nav-item nav-item-logout">
        <span class="nav-icon">🚪</span><span class="nav-label">Log Out</span>
      </button>
    </div>
  </nav>

  <div class="sidebar-footer">
    <a href="profile.html" class="sidebar-user">
      <div class="sidebar-avatar" id="sb-avatar">U</div>
      <div class="sidebar-user-info">
        <div class="sidebar-user-name" id="sb-name">Loading…</div>
        <div class="sidebar-user-role" id="sb-major">Student</div>
      </div>
    </a>
  </div>
</aside>
<div class="sidebar-backdrop" id="sidebar-backdrop" onclick="closeMobileSidebar()"></div>
`;

/* ── Topbar HTML (with notification popup & mobile toggle) ───────── */
function TOPBAR_HTML(title = 'TimeVerse', subtitle = '') {
  return `
  <header class="topbar" id="topbar">
    <div class="topbar-left">
      <a href="profile.html" class="topbar-avatar topbar-avatar--left" id="tb-avatar-left">U</a>
      <div class="topbar-title">
        <span class="topbar-title-main">${title}</span>
        ${subtitle ? `<span class="topbar-title-sub">${subtitle}</span>` : ''}
      </div>
    </div>
    <div class="topbar-actions">
      <div class="topbar-clock" id="topbar-clock"></div>

      <!-- Bell + Notification Dropdown -->
      <div class="notif-btn-wrap" id="notif-btn-wrap">
        <button class="topbar-notif-btn" id="notif-bell"
          onclick="toggleNotifDropdown(event)" title="Notifications">
          🔔
          <span class="notif-dot hidden" id="notif-dot"></span>
        </button>

        <div class="notif-dropdown hidden" id="notif-dropdown">
          <div class="notif-dropdown-header">
            <span class="notif-dropdown-title">🔔 Notifications</span>
            <button class="btn btn-sm btn-ghost btn-notif-mark-read"
              onclick="markAllNotifRead()">Mark all read</button>
          </div>
          <div class="notif-dropdown-list" id="notif-dropdown-list">
            <div class="notif-list-loading">
              <div class="spinner notif-spinner"></div>
              Loading…
            </div>
          </div>
          <div class="notif-dropdown-footer">
            <a href="profile.html" class="btn btn-sm btn-ghost btn-view-all-notifs"
              onclick="closeNotifDropdown()">View all in profile →</a>
          </div>
        </div>
      </div>

      <a href="profile.html" class="topbar-avatar topbar-avatar--right" id="tb-avatar">U</a>
      <button class="topbar-menu-toggle" id="mobile-menu-btn" onclick="toggleMobileSidebar()" aria-label="Toggle Navigation Menu">☰</button>
    </div>
  </header>
  `;
}

/* ── initLayout ──────────────────────────────────────────────────── */
function initLayout(activePage = '') {
  /* Authentication Guard: if not logged in, redirect to login page */
  if (window.API?.auth && !window.API.auth.isLoggedIn()) {
    const p = window.location.pathname.toLowerCase();
    if (!p.endsWith('login.html') && !p.endsWith('index.html')) {
      window.location.href = 'login.html';
      return;
    }
  }

  /* Mark active nav */
  document.querySelectorAll('.nav-item[data-page]').forEach(a => {
    a.classList.toggle('active', a.dataset.page === activePage);
  });

  /* Fill user info */
  const user  = window.API?.auth?.getUser?.() || {};
  const name  = user.name  || 'Student';
  const major = user.major || '';
  const init  = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';

  const fill = { 'sb-avatar': init, 'sb-name': name, 'sb-major': major, 'tb-avatar': init, 'tb-avatar-left': init };
  for (const [id, val] of Object.entries(fill)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  /* Live clock */
  const clockEl = document.getElementById('topbar-clock');
  if (clockEl) {
    const tick = () => {
      clockEl.textContent = new Date().toLocaleTimeString('en-US',
        { hour: '2-digit', minute: '2-digit' });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* Init notification dropdown */
  _initNotifDropdown();
}

/* ── Notification Dropdown ───────────────────────────────────────── */
function _initNotifDropdown() {
  checkNotifDot();
  document.addEventListener('click', e => {
    const wrap = document.getElementById('notif-btn-wrap');
    if (wrap && !wrap.contains(e.target)) closeNotifDropdown();
  });
}

function toggleNotifDropdown(e) {
  e && e.stopPropagation();
  const dd   = document.getElementById('notif-dropdown');
  const bell = document.getElementById('notif-bell');
  if (!dd) return;
  if (dd.classList.contains('hidden')) {
    dd.classList.remove('hidden');
    bell?.classList.add('open');
    _loadNotifList();
  } else {
    closeNotifDropdown();
  }
}

function closeNotifDropdown() {
  document.getElementById('notif-dropdown')?.classList.add('hidden');
  document.getElementById('notif-bell')?.classList.remove('open');
}

async function checkNotifDot() {
  try {
    const notifs = await API.notifications.getAll();
    const dot = document.getElementById('notif-dot');
    const hasUnread = notifs.some(n => n.isRead === false || n.read === false);
    if (dot) dot.classList.toggle('hidden', !hasUnread);
  } catch {}
}

async function _loadNotifList() {
  const list = document.getElementById('notif-dropdown-list');
  if (!list) return;
  try {
    const notifs = await API.notifications.getAll();
    if (!notifs.length) {
      list.innerHTML = `<div class="empty-state empty-state--padded-sm">
        <div class="empty-icon text-sm">🔕</div>
        <div class="empty-title text-xs">No notifications yet</div>
      </div>`;
      return;
    }
    list.innerHTML = notifs
      .sort((a, b) => new Date(b.createdAt || b.scheduledAt) - new Date(a.createdAt || a.scheduledAt))
      .slice(0, 20)
      .map(n => {
        const isRead = n.isRead !== undefined ? n.isRead : n.read;
        const isExam = !!n.examId || (n.title || '').toLowerCase().includes('exam');
        const isTask = !!n.studentTaskId || (n.title || '').toLowerCase().includes('task');
        const icon = isExam ? '📝' : isTask ? '⏰' : '🔔';
        const typeClass = isExam ? 'nd-icon--reality' : isTask ? 'nd-icon--soul' : 'nd-icon--power';

        return `
          <div class="nd-item ${isRead ? '' : 'unread'}" id="nd-${n.id}">
            <div class="nd-icon ${typeClass}">${icon}</div>
            <div class="nd-info">
              <div class="nd-title">${n.title}</div>
              <div class="nd-sub text-xs text-muted">${n.message || ''}</div>
              <div class="nd-time">${new Date(n.scheduledAt || n.createdAt || Date.now()).toLocaleString('en-US',
                { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div class="nd-item-controls">
              ${!isRead ? `<button class="nd-read-btn" onclick="markOneNotif(${n.id})">✓</button>` : ''}
              <button class="nd-read-btn nd-del-btn" onclick="deleteNotif(${n.id})">✕</button>
            </div>
          </div>`;
      }).join('');
  } catch {
    list.innerHTML = `<div class="empty-state empty-state--padded-sm">
      <div class="empty-title text-xs text-faint">Failed to load</div>
    </div>`;
  }
}

async function markOneNotif(id) {
  await API.notifications.markRead(id);
  document.getElementById(`nd-${id}`)?.classList.remove('unread');
  document.querySelector(`#nd-${id} .nd-read-btn`)?.remove();
  checkNotifDot();
}

async function markAllNotifRead() {
  await API.notifications.markAllRead();
  document.querySelectorAll('.nd-item').forEach(el => el.classList.remove('unread'));
  document.querySelectorAll('.nd-read-btn:not(.nd-del-btn)').forEach(btn => btn.remove());
  checkNotifDot();
  showToast('All notifications marked as read', 'success');
}

async function deleteNotif(id) {
  await API.notifications.remove(id);
  document.getElementById(`nd-${id}`)?.remove();
  checkNotifDot();
  showToast('Notification deleted', 'info');
}

/* ── Mobile Sidebar Controls ─────────────────────────────────────── */
function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (!sidebar) return;
  const isOpen = sidebar.classList.toggle('open');
  if (backdrop) backdrop.classList.toggle('active', isOpen);
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
}

/* ── Styled Confirmation Modal (Marvel Design System) ────────────── */
function showConfirmModal({
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  icon = ''
}) {
  return new Promise((resolve) => {
    let overlay = document.getElementById('tv-confirm-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'tv-confirm-modal';
      overlay.className = 'modal-overlay hidden';
      document.body.appendChild(overlay);
    }

    const isDanger = type === 'danger';
    const isWarning = type === 'warning';
    const btnCls = isDanger ? 'btn-danger' : isWarning ? 'btn-warning-stone' : 'btn-primary';
    const dialogTypeCls = isDanger ? 'modal-confirm-dialog--danger' : isWarning ? 'modal-confirm-dialog--warning' : 'modal-confirm-dialog--primary';
    const displayIcon = icon || (isDanger ? '🗑️' : isWarning ? '🚪' : '✨');

    overlay.innerHTML = `
      <div class="modal modal-confirm-dialog ${dialogTypeCls}">
        <div class="modal-confirm-icon">${displayIcon}</div>
        <h3 class="modal-confirm-title">${title}</h3>
        <p class="modal-confirm-message">${message}</p>
        <div class="modal-confirm-actions">
          <button class="btn btn-ghost" id="tv-confirm-cancel">${cancelText}</button>
          <button class="btn ${btnCls}" id="tv-confirm-ok">${confirmText}</button>
        </div>
      </div>
    `;

    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');

    const cleanUp = (result) => {
      overlay.classList.add('hidden');
      document.body.classList.remove('modal-open');
      resolve(result);
    };

    document.getElementById('tv-confirm-ok').onclick = () => cleanUp(true);
    document.getElementById('tv-confirm-cancel').onclick = () => cleanUp(false);
    overlay.onclick = (e) => {
      if (e.target === overlay) cleanUp(false);
    };
  });
}

async function confirmDelete(name, itemType = 'item') {
  return await showConfirmModal({
    title: `Delete ${itemType}?`,
    message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    confirmText: 'Delete Forever',
    cancelText: 'Cancel',
    type: 'danger',
    icon: '🗑️'
  });
}

/* ── Auth Helpers ────────────────────────────────────────────────── */
function requireAuth() {
  if (!window.API?.auth?.isLoggedIn?.()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

async function handleLogout() {
  const confirmed = await showConfirmModal({
    title: 'Log Out of TimeVerse?',
    message: 'Are you sure you want to log out? Your courses and tasks remain saved in your account.',
    confirmText: 'Log Out',
    cancelText: 'Stay in TimeVerse',
    type: 'warning',
    icon: '🚪'
  });
  if (confirmed) {
    API.auth.logout();
  }
}

/* ── Toast ───────────────────────────────────────────────────────── */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = message;
  container.appendChild(t);
  setTimeout(() => {
    t.style.transition = 'opacity .25s, transform .25s';
    t.style.opacity = '0';
    t.style.transform = 'translateX(40px)';
  }, 2600);
  setTimeout(() => t.remove(), 2900);
}

/* ── Modal Helpers ───────────────────────────────────────────────── */
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('hidden');
  document.body.classList.add('modal-open');
  const dialog = el.querySelector('.modal');
  if (dialog) dialog.scrollTop = 0;
  setTimeout(() => {
    el.querySelector('input:not([type="hidden"]), select, textarea')?.focus();
  }, 50);
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

function closeModalOnOverlay(e) {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(e.currentTarget.id);
  }
}

/* ── Loading Screen ──────────────────────────────────────────────── */
function hideLoading() {
  const ls = document.getElementById('loading-screen');
  if (ls) {
    ls.style.opacity = '0';
    setTimeout(() => ls.classList.add('hidden'), 300);
  }
}

/* ── Date Utilities ──────────────────────────────────────────────── */
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function daysUntil(dateStr) {
  if (!dateStr) return 999;
  const diff = new Date(dateStr) - new Date(todayStr());
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

function isOverdue(dateStr) {
  return daysUntil(dateStr) < 0;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US',
    { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US',
    { month: 'short', day: 'numeric' });
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

/* ── Badge Helpers ───────────────────────────────────────────────── */
function priorityBadge(priority) {
  const map = {
    High:   ['badge priority-high',   '🔴 High'],
    Medium: ['badge priority-medium', '🟡 Medium'],
    Low:    ['badge priority-low',    '🟢 Low'],
  };
  const [cls, label] = map[priority] || ['badge', priority];
  return `<span class="${cls}">${label}</span>`;
}

function typeBadge(type) {
  const map = {
    Assignment: 'type-assignment',
    Project:    'type-project',
    Quiz:       'type-quiz',
    Exam:       'type-exam',
  };
  return `<span class="badge ${map[type] || ''}">${type || ''}</span>`;
}
