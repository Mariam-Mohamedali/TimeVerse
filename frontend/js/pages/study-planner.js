/* ═══════════════════════════════════════════════════════════════
   study-planner.js  —  Study Plans & Sessions logic
   Connected to /api/StudyPlans, /api/StudySessions, /api/StudentTasks
   ═══════════════════════════════════════════════════════════════ */

document.getElementById('app').insertAdjacentHTML('afterbegin', SIDEBAR_HTML);

let studyPlans = [];
let studySessions = [];
let tasks = [];
let selectedPlanId = null;
let editingPlanId = null;
let editingSessId = null;

async function initPlanner() {
  if (!requireAuth()) return;
  document.querySelector('.main-content').insertAdjacentHTML(
    'afterbegin',
    TOPBAR_HTML('Study Plans & Sessions', 'Plan and track your study goals')
  );
  initLayout('planner');

  [studyPlans, studySessions, tasks] = await Promise.all([
    API.studyPlans.getAll(),
    API.studySessions.getAll(),
    API.tasks.getAll(),
  ]);

  renderPlanFilterTabs();
  renderPlansOverview();
  renderSessions();
  updateStats();
  hideLoading();
  document.getElementById('page-main').style.opacity = '1';
}

function updateStats() {
  document.getElementById('stat-plans').textContent = studyPlans.length;
  document.getElementById('stat-sessions').textContent = studySessions.length;
  document.getElementById('stat-completed').textContent = studySessions.filter(s => s.isCompleted).length;
}

function renderPlanFilterTabs() {
  const container = document.getElementById('plan-filter-tabs');
  const allBtn = `<button class="tab-btn ${selectedPlanId === null ? 'active' : ''}" onclick="filterByPlan(null, this)">All Plans</button>`;
  const planBtns = studyPlans.map(p =>
    `<button class="tab-btn ${selectedPlanId === p.id ? 'active' : ''}" onclick="filterByPlan(${p.id}, this)">${p.title}</button>`
  ).join('');

  container.innerHTML = allBtn + planBtns;
}

function filterByPlan(planId, btn) {
  selectedPlanId = planId;
  document.querySelectorAll('#plan-filter-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderSessions();
}

function renderPlansOverview() {
  const list = document.getElementById('plans-list');
  if (!studyPlans.length) {
    list.innerHTML = `<div class="plan-empty-label">No study plans yet.</div>`;
    return;
  }

  list.innerHTML = studyPlans.map(p => {
    const planSessions = studySessions.filter(s => String(s.studyPlanId) === String(p.id));
    const completed = planSessions.filter(s => s.isCompleted).length;
    const pct = planSessions.length ? Math.round((completed / planSessions.length) * 100) : 0;

    return `
      <div class="plan-card-item">
        <div class="plan-card-header">
          <strong class="plan-card-title">${p.title}</strong>
          <div class="plan-card-actions">
            <button class="btn btn-icon-sm btn-sm btn-secondary" onclick="openEditPlan(${p.id})">✏️</button>
            <button class="btn btn-icon-sm btn-sm btn-danger" onclick="deletePlan(${p.id}, '${p.title.replace(/'/g, "\\'")}')">🗑</button>
          </div>
        </div>
        <div class="plan-card-dates">
          📅 ${formatDateShort(p.startDate)} – ${formatDateShort(p.endDate)}
        </div>
        <div class="plan-card-progress">
          ${completed} of ${planSessions.length} sessions completed (${pct}%)
        </div>
      </div>
    `;
  }).join('');
}

function renderSessions() {
  const container = document.getElementById('sessions-container');
  const planMap = Object.fromEntries(studyPlans.map(p => [p.id, p]));
  const taskMap = Object.fromEntries(tasks.map(t => [t.id, t]));

  let filtered = studySessions;
  if (selectedPlanId !== null) {
    filtered = filtered.filter(s => String(s.studyPlanId) === String(selectedPlanId));
  }

  if (!filtered.length) {
    container.innerHTML = `
      <div class="empty-state empty-state--padded">
        <div class="empty-icon">🗓️</div>
        <div class="empty-title">No sessions found</div>
        <div class="empty-desc">${selectedPlanId ? 'No sessions for this study plan yet.' : 'Click "Add Study Session" to create your first session.'}</div>
      </div>`;
    return;
  }

  const sorted = [...filtered].sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate));

  container.innerHTML = sorted.map(s => {
    const plan = planMap[s.studyPlanId];
    const task = s.studentTaskId ? taskMap[s.studentTaskId] : null;
    const durH = Math.round((s.durationMinutes || 60) / 60 * 10) / 10;
    const statusMod = s.isCompleted ? 'session-item--completed' : 'session-item--pending';

    return `
      <div class="session-item ${statusMod}" id="session-${s.id}">
        <div class="session-time-box">
          <div class="session-time">${durH}h</div>
          <div class="session-dur">${s.durationMinutes || 60}m</div>
        </div>
        <div class="session-bar"></div>
        <div class="session-info">
          <div class="session-name">${s.title}</div>
          <div class="session-sub">
            📅 ${formatDate(s.sessionDate)} · 📋 Plan: ${plan?.title || 'General'}
            ${task ? ` · 🎯 Task: ${task.title}` : ''}
          </div>
        </div>
        ${s.isCompleted
          ? '<span class="badge badge-success">Completed</span>'
          : `<button class="btn btn-sm btn-accent" onclick="toggleCompleteSession(${s.id}, true)">Mark Done</button>`}
        <div class="session-actions">
          <button class="btn btn-icon btn-sm btn-secondary" onclick="openEditSession(${s.id})">✏️</button>
          <button class="btn btn-icon btn-sm btn-danger" onclick="deleteSession(${s.id})">🗑</button>
        </div>
      </div>
    `;
  }).join('');
}

/* ── Plan CRUD ── */
function openAddPlan() {
  editingPlanId = null;
  document.getElementById('plan-modal-title').textContent = 'Create Study Plan';
  document.getElementById('save-plan-btn').textContent = 'Save Plan';
  document.getElementById('plan-title').value = '';
  const now = new Date();
  document.getElementById('plan-start').value = now.toISOString().split('T')[0];
  const end = new Date(now); end.setDate(end.getDate() + 14);
  document.getElementById('plan-end').value = end.toISOString().split('T')[0];
  openModal('plan-modal');
}

function openEditPlan(id) {
  const p = studyPlans.find(x => String(x.id) === String(id));
  if (!p) return;
  editingPlanId = id;
  document.getElementById('plan-modal-title').textContent = 'Edit Study Plan';
  document.getElementById('save-plan-btn').textContent = 'Update Plan';
  document.getElementById('plan-title').value = p.title || '';
  document.getElementById('plan-start').value = (p.startDate || '').split('T')[0];
  document.getElementById('plan-end').value = (p.endDate || '').split('T')[0];
  openModal('plan-modal');
}

async function savePlan() {
  const title = document.getElementById('plan-title').value.trim();
  const startDate = document.getElementById('plan-start').value;
  const endDate = document.getElementById('plan-end').value;
  if (!title || !startDate || !endDate) return showToast('Please fill in all plan fields', 'error');

  const btn = document.getElementById('save-plan-btn');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    if (editingPlanId) {
      await API.studyPlans.update(editingPlanId, { title, startDate, endDate });
      const idx = studyPlans.findIndex(x => String(x.id) === String(editingPlanId));
      if (idx >= 0) studyPlans[idx] = { ...studyPlans[idx], title, startDate, endDate };
      showToast('Study Plan updated ✅', 'success');
    } else {
      const p = await API.studyPlans.create({ title, startDate, endDate });
      studyPlans.push(p);
      showToast('Study Plan created ✅', 'success');
    }
    closeModal('plan-modal');
    renderPlanFilterTabs();
    renderPlansOverview();
    updateStats();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = editingPlanId ? 'Update Plan' : 'Save Plan';
  }
}

async function deletePlan(id, name) {
  if (!await confirmDelete(name, 'Study Plan')) return;
  await API.studyPlans.remove(id);
  studyPlans = studyPlans.filter(p => String(p.id) !== String(id));
  if (selectedPlanId === id) selectedPlanId = null;
  renderPlanFilterTabs();
  renderPlansOverview();
  renderSessions();
  updateStats();
  showToast('Plan deleted ✅', 'success');
}

/* ── Session CRUD ── */
function openAddSession() {
  if (!studyPlans.length) {
    showToast('Please create a Study Plan first!', 'warning');
    openAddPlan();
    return;
  }
  editingSessId = null;
  document.getElementById('sess-modal-title').textContent = 'Add Study Session';
  document.getElementById('save-sess-btn').textContent = 'Save Session';

  // Populate plans
  document.getElementById('sess-plan').innerHTML = studyPlans.map(p =>
    `<option value="${p.id}" ${selectedPlanId === p.id ? 'selected' : ''}>${p.title}</option>`
  ).join('');

  // Populate tasks
  document.getElementById('sess-task').innerHTML =
    '<option value="">None (Independent session)</option>' +
    tasks.map(t => `<option value="${t.id}">${t.title}</option>`).join('');

  document.getElementById('sess-title').value = '';
  const now = new Date();
  now.setMinutes(0);
  document.getElementById('sess-date').value = now.toISOString().slice(0, 16);
  document.getElementById('sess-duration').value = '60';

  openModal('session-modal');
}

function openEditSession(id) {
  const s = studySessions.find(x => String(x.id) === String(id));
  if (!s) return;
  editingSessId = id;
  document.getElementById('sess-modal-title').textContent = 'Edit Study Session';
  document.getElementById('save-sess-btn').textContent = 'Update Session';

  document.getElementById('sess-plan').innerHTML = studyPlans.map(p =>
    `<option value="${p.id}" ${String(s.studyPlanId) === String(p.id) ? 'selected' : ''}>${p.title}</option>`
  ).join('');

  document.getElementById('sess-task').innerHTML =
    '<option value="">None (Independent session)</option>' +
    tasks.map(t => `<option value="${t.id}" ${String(s.studentTaskId) === String(t.id) ? 'selected' : ''}>${t.title}</option>`).join('');

  document.getElementById('sess-title').value = s.title || '';
  document.getElementById('sess-date').value = (s.sessionDate || '').slice(0, 16);
  document.getElementById('sess-duration').value = s.durationMinutes || 60;

  openModal('session-modal');
}

async function saveSession() {
  const studyPlanId = document.getElementById('sess-plan').value;
  const studentTaskId = document.getElementById('sess-task').value || null;
  const title = document.getElementById('sess-title').value.trim();
  const sessionDate = document.getElementById('sess-date').value;
  const durationMinutes = parseInt(document.getElementById('sess-duration').value) || 60;

  if (!studyPlanId || !title || !sessionDate) return showToast('Please fill in plan, title and date', 'error');

  const btn = document.getElementById('save-sess-btn');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    if (editingSessId) {
      await API.studySessions.update(editingSessId, {
        studentTaskId,
        title,
        sessionDate,
        durationMinutes,
      });
      const idx = studySessions.findIndex(x => String(x.id) === String(editingSessId));
      if (idx >= 0) studySessions[idx] = { ...studySessions[idx], studentTaskId, title, sessionDate, durationMinutes };
      showToast('Session updated ✅', 'success');
    } else {
      const sess = await API.studySessions.create({
        studyPlanId,
        studentTaskId,
        title,
        sessionDate,
        durationMinutes,
      });
      studySessions.push(sess);
      showToast('Study session created ✅', 'success');
    }
    closeModal('session-modal');
    renderPlansOverview();
    renderSessions();
    updateStats();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = editingSessId ? 'Update Session' : 'Save Session';
  }
}

async function toggleCompleteSession(id, isCompleted) {
  await API.studySessions.update(id, { isCompleted });
  const idx = studySessions.findIndex(s => String(s.id) === String(id));
  if (idx >= 0) studySessions[idx].isCompleted = isCompleted;
  renderPlansOverview();
  renderSessions();
  updateStats();
  showToast(isCompleted ? 'Session marked completed! 🎉' : 'Status updated', 'success');
}

async function deleteSession(id) {
  if (!await confirmDelete('this study session', 'Study Session')) return;
  await API.studySessions.remove(id);
  studySessions = studySessions.filter(s => String(s.id) !== String(id));
  renderPlansOverview();
  renderSessions();
  updateStats();
  showToast('Session removed ✅', 'success');
}

initPlanner();
