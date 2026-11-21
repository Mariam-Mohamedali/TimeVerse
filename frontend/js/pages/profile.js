/* ═══════════════════════════════════════════════════════════════
   profile.js  —  Profile & Notifications page logic
   Connected to /api/Notifications, /api/Courses, /api/StudentTasks
   ═══════════════════════════════════════════════════════════════ */

document.getElementById('app').insertAdjacentHTML('afterbegin', SIDEBAR_HTML);

let allNotifications = [];
let activeNotifFilter = 'all';

async function initProfile() {
  if (!requireAuth()) return;
  document.querySelector('.main-content').insertAdjacentHTML(
    'afterbegin',
    TOPBAR_HTML('Profile & Notifications', 'Account & notifications center')
  );
  initLayout('profile');

  const user = API.auth.getUser() || {};
  const initials = (user.name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';

  document.getElementById('profile-avatar').textContent = initials;
  document.getElementById('profile-name').textContent = user.name || 'Student';
  document.getElementById('profile-email').textContent = user.email || '';

  const [courses, tasks, notifs] = await Promise.all([
    API.courses.getAll(),
    API.tasks.getAll(),
    API.notifications.getAll(),
  ]);

  allNotifications = notifs;

  document.getElementById('mini-courses').textContent = courses.length;
  document.getElementById('mini-tasks').textContent = tasks.filter(t => t.status !== 2 && t.status !== 'Completed').length;

  renderNotifications();
  hideLoading();
  document.getElementById('page-main').style.opacity = '1';
}

function filterNotifs(type, btn) {
  activeNotifFilter = type;
  document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderNotifications();
}

function renderNotifications() {
  const list = document.getElementById('profile-notif-list');
  const countLabel = document.getElementById('notif-count-subtitle');

  let filtered = allNotifications;
  if (activeNotifFilter === 'exam') {
    filtered = filtered.filter(n => !!n.examId || (n.title || '').toLowerCase().includes('exam'));
  } else if (activeNotifFilter === 'task') {
    filtered = filtered.filter(n => !!n.studentTaskId || (n.title || '').toLowerCase().includes('task'));
  }

  const unreadCount = allNotifications.filter(n => n.isRead === false || n.read === false).length;
  countLabel.textContent = `${unreadCount} unread reminder${unreadCount !== 1 ? 's' : ''}`;

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty-state empty-state--padded">
        <div class="empty-icon">🔕</div>
        <div class="empty-title">No notifications</div>
        <div class="empty-desc">You are all caught up!</div>
      </div>`;
    return;
  }

  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt || b.scheduledAt) - new Date(a.createdAt || a.scheduledAt));

  list.innerHTML = sorted.map(n => {
    const isRead = n.isRead !== undefined ? n.isRead : n.read;
    const isExam = !!n.examId || (n.title || '').toLowerCase().includes('exam');
    const isTask = !!n.studentTaskId || (n.title || '').toLowerCase().includes('task');
    const icon = isExam ? '📝' : isTask ? '⏰' : '🔔';
    const tag = isExam ? 'Exam Reminder' : isTask ? 'Task Deadline' : 'General Reminder';
    const tagCls = isExam ? 'notif-tag-exam' : isTask ? 'notif-tag-task' : 'notif-tag-general';

    return `
      <div class="toggle-row ${isRead ? '' : 'unread'}" id="prof-notif-${n.id}">
        <div class="notif-row-icon">${icon}</div>
        <div class="toggle-info flex-1">
          <div class="notif-row-header">
            <span class="toggle-label">${n.title}</span>
            <span class="badge ${tagCls}">${tag}</span>
          </div>
          <div class="toggle-sub">${n.message || ''}</div>
          <div class="notif-row-time">
            ${new Date(n.scheduledAt || n.createdAt || Date.now()).toLocaleString('en-US',
              { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div class="notif-row-actions">
          ${!isRead ? `<button class="btn btn-sm btn-ghost" onclick="markRead(${n.id})">✓ Mark read</button>` : '<span class="notif-read-status">✓ Read</span>'}
          <button class="btn btn-icon-sm btn-sm btn-danger" onclick="deleteNotif(${n.id})">🗑</button>
        </div>
      </div>
    `;
  }).join('');
}

async function markRead(id) {
  await API.notifications.markRead(id);
  const n = allNotifications.find(x => String(x.id) === String(id));
  if (n) {
    n.isRead = true;
    n.read = true;
  }
  renderNotifications();
  checkNotifDot();
  showToast('Marked as read ✅', 'success');
}

async function markAllNotifsRead() {
  await API.notifications.markAllRead();
  allNotifications.forEach(n => {
    n.isRead = true;
    n.read = true;
  });
  renderNotifications();
  checkNotifDot();
  showToast('All notifications marked as read ✅', 'success');
}

async function deleteNotif(id) {
  if (!await confirmDelete('this notification', 'Notification')) return;
  await API.notifications.remove(id);
  allNotifications = allNotifications.filter(x => String(x.id) !== String(id));
  renderNotifications();
  checkNotifDot();
  showToast('Notification deleted', 'info');
}

initProfile();
