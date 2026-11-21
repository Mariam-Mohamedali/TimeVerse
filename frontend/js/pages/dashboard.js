/* ═══════════════════════════════════════════════════════════════
   dashboard.js  —  Dashboard page logic
   Connected to: /api/Courses, /api/StudentTasks, /api/Schedules,
                 /api/Exams, /api/Notifications
   ═══════════════════════════════════════════════════════════════ */

document.getElementById('app').insertAdjacentHTML('afterbegin', SIDEBAR_HTML);

function urgencyClass(d) {
  if (d <= 2) return 'deadline-days--hot';
  if (d <= 5) return 'deadline-days--warm';
  return 'deadline-days--ok';
}

function renderLecture(l, course) {
  const timeStr = `${(l.startTime || '').slice(0, 5)} – ${(l.endTime || '').slice(0, 5)}`;
  return `
    <div class="tl-item">
      <div class="tl-time">${(l.startTime || '').slice(0, 5)}</div>
      <div class="tl-dot tl-dot--lecture"></div>
      <div class="tl-info">
        <div class="tl-label">${l.title || course?.name || 'Lecture'}</div>
        <div class="tl-sub">${l.location || 'Campus'} · ${timeStr}</div>
      </div>
      <span class="badge badge-lecture">Lecture</span>
    </div>`;
}

function renderDeadline(t, course) {
  const d = daysUntil(t.dueDate);
  const priorityName = t.priority === 2 ? 'High' : t.priority === 1 ? 'Medium' : 'Low';
  return `
    <div class="deadline-item">
      <div class="deadline-days ${urgencyClass(d)}">
        <div class="num">${d >= 0 ? d : 0}</div>
        <div class="lbl">${d === 1 ? 'day' : 'days'}</div>
      </div>
      <div class="deadline-info">
        <div class="deadline-name">${t.title}</div>
        <div class="deadline-meta">${course?.name ?? 'Course'} · ${formatDateShort(t.dueDate)}</div>
      </div>
      ${priorityBadge(priorityName)}
    </div>`;
}

function renderNotifFeed(n) {
  const isExam = !!n.examId || (n.title || '').toLowerCase().includes('exam');
  const isTask = !!n.studentTaskId || (n.title || '').toLowerCase().includes('task');
  const icon = isExam ? '📝' : isTask ? '⏰' : '🔔';

  return `
    <div class="notif-feed-item ${n.isRead ? '' : 'unread'}" id="dash-notif-${n.id}">
      <div class="notif-feed-icon">${icon}</div>
      <div class="notif-feed-info">
        <div class="notif-feed-title">${n.title || 'Notification'}</div>
        <div class="notif-feed-desc">${n.message || ''}</div>
      </div>
      ${!n.isRead ? `<button class="btn btn-sm btn-ghost" onclick="markOneNotif(${n.id})">✓</button>` : ''}
    </div>
  `;
}

/* ── Main Init ── */
async function initDashboard() {
  if (!requireAuth()) return;

  document.querySelector('.main-content').insertAdjacentHTML(
    'afterbegin',
    TOPBAR_HTML('Dashboard', 'Your cosmic command center')
  );
  initLayout('dashboard');

  const user = API.auth.getUser();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  document.getElementById('greeting-text').textContent =
    `${greeting}, ${user?.name?.split(' ')[0] || 'Student'} ⚡`;

  const now = new Date();
  document.getElementById('hero-date').textContent =
    now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  document.getElementById('today-label').textContent =
    now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  /* Fetch all required endpoints */
  const [courses, tasks, schedules, exams, notifs] = await Promise.all([
    API.courses.getAll(),
    API.tasks.getAll(),
    API.schedules.getAll(),
    API.exams.getAll(),
    API.notifications.getAll(),
  ]);

  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));

  // Pending: status === 0 (Pending) or status === 1 (InProgress)
  // Done: status === 2 (Completed)
  const isDone = t => t.status === 2 || t.status === 'Completed' || t.status === 'Done';
  const pending = tasks.filter(t => !isDone(t));
  const done = tasks.filter(isDone);

  /* Stats row */
  document.getElementById('stat-courses').textContent = courses.length;
  document.getElementById('stat-tasks').textContent   = pending.length;
  document.getElementById('stat-exams').textContent   = exams.filter(e => daysUntil(e.examDate) >= 0).length;
  document.getElementById('stat-done').textContent    = done.length;

  /* Progress ring */
  const pct = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;
  const circumference = 314;
  document.getElementById('ring-fill').style.strokeDashoffset =
    circumference - (circumference * pct / 100);
  document.getElementById('ring-pct').textContent   = `${pct}%`;
  document.getElementById('ring-done').textContent  = done.length;
  document.getElementById('ring-total').textContent = tasks.length;

  /* Today's schedule */
  const currentDayOfWeek = now.getDay(); // 0: Sunday, 1: Monday, ...
  const todaySchedules = schedules
    .filter(s => Number(s.dayOfWeek) === currentDayOfWeek)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  if (todaySchedules.length) {
    document.getElementById('today-timeline').innerHTML =
      todaySchedules.map(s => renderLecture(s, courseMap[s.courseId])).join('');
  }

  /* Upcoming deadlines (next 14 days) */
  const upcomingTasks = pending
    .filter(t => daysUntil(t.dueDate) >= 0 && daysUntil(t.dueDate) <= 14)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  if (upcomingTasks.length) {
    document.getElementById('deadline-list').innerHTML =
      upcomingTasks.map(t => renderDeadline(t, courseMap[t.courseId])).join('');
  }

  /* Recent notifications */
  if (notifs.length) {
    const sortedNotifs = [...notifs]
      .sort((a, b) => new Date(b.createdAt || b.scheduledAt) - new Date(a.createdAt || a.scheduledAt))
      .slice(0, 4);

    document.getElementById('dashboard-notif-list').innerHTML =
      sortedNotifs.map(n => renderNotifFeed(n)).join('');
  }

  hideLoading();
  document.getElementById('page-main').style.opacity = '1';
}

initDashboard();
