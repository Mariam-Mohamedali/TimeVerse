/* ═══════════════════════════════════════════════════════════════
   tasks.js  —  My Tasks (Kanban) page logic
   Connected to /api/StudentTasks
   ═══════════════════════════════════════════════════════════════ */

document.getElementById('app').insertAdjacentHTML('afterbegin', SIDEBAR_HTML);

let allTasks = [], courses = [], editingTaskId = null;
let filterPriority = '', filterCourse = '';

function normalizeStatus(s) {
  if (s === 2 || s === 'Completed' || s === 'Done') return 2;
  if (s === 1 || s === 'InProgress' || s === 'In Progress') return 1;
  return 0; // Pending
}

function normalizePriority(p) {
  if (p === 2 || p === 'High') return 2;
  if (p === 1 || p === 'Medium') return 1;
  return 0; // Low
}

function renderTaskCard(t, cm) {
  const course = cm[t.courseId];
  const color = '#9b30d9';
  const status = normalizeStatus(t.status);
  const priority = normalizePriority(t.priority);
  const overdue = isOverdue(t.dueDate) && status !== 2;
  const d = daysUntil(t.dueDate);

  let dueLabel;
  if (d < 0)        dueLabel = `<span class="task-due--overdue">Overdue by ${Math.abs(d)}d!</span>`;
  else if (d === 0) dueLabel = `<span class="task-due--today">Due today!</span>`;
  else              dueLabel = `${formatDateShort(t.dueDate)} (${d}d)`;

  const priorityName = priority === 2 ? 'High' : priority === 1 ? 'Medium' : 'Low';

  /* Build status move buttons based on current status */
  const statusBtns = [];
  if (status !== 1) statusBtns.push(`<button class="task-move-btn task-move-btn--fwd"  onclick="moveTask(${t.id},1)">→ In Progress</button>`);
  if (status !== 2) statusBtns.push(`<button class="task-move-btn task-move-btn--done" onclick="moveTask(${t.id},2)">✓ Done</button>`);
  if (status !== 0) statusBtns.push(`<button class="task-move-btn task-move-btn--back" onclick="moveTask(${t.id},0)">↩ Pending</button>`);

  const escapedTitle = (t.title || 'Task').replace(/'/g, "\\'");

  return `
    <div class="task-card ${overdue ? 'overdue' : ''}" id="task-${t.id}">
      ${overdue ? '<div class="overdue-ribbon">OVERDUE</div>' : ''}
      <div class="task-card-top">
        <div class="task-title">${t.title}</div>
        ${priorityBadge(priorityName)}
      </div>
      <div class="task-meta">
        <span class="task-course-chip">${course?.name ?? 'General Course'}</span>
      </div>
      ${t.description ? `<p class="text-xs text-muted">${t.description}</p>` : ''}
      <div class="task-due">📅 ${dueLabel}</div>
      <div class="task-actions">
        <div class="task-actions-main">
          <button class="btn-edit-task" onclick="openEditTask(${t.id})">✏️ Edit</button>
          <button class="btn btn-icon-sm btn-sm btn-danger" onclick="deleteTask(${t.id},'${escapedTitle}')" title="Delete Task">🗑</button>
        </div>
        <div class="task-status-row">${statusBtns.join('')}</div>
      </div>
    </div>`;
}

function renderCol(colId, tasks, cm) {
  const el = document.getElementById(colId);
  if (!tasks.length) {
    el.innerHTML = `<div class="empty-state empty-state--padded">
      <div class="empty-icon">📭</div>
      <div class="empty-title text-sm">No tasks here</div>
    </div>`;
    return;
  }
  el.innerHTML = [...tasks]
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .map(t => renderTaskCard(t, cm))
    .join('');
}

function renderBoard(tasks) {
  const cm = Object.fromEntries(courses.map(c => [c.id, c]));
  const cols = { 0: [], 1: [], 2: [] };

  tasks.forEach(t => {
    const s = normalizeStatus(t.status);
    cols[s].push(t);
  });

  document.getElementById('cnt-todo').textContent     = cols[0].length;
  document.getElementById('cnt-progress').textContent = cols[1].length;
  document.getElementById('cnt-done').textContent     = cols[2].length;

  renderCol('col-todo',     cols[0], cm);
  renderCol('col-progress', cols[1], cm);
  renderCol('col-done',     cols[2], cm);
}

function applyFilters() {
  const search = document.getElementById('task-search').value.toLowerCase();
  filterCourse = document.getElementById('filter-course').value;
  let f = allTasks;

  if (filterPriority !== '') {
    f = f.filter(t => String(normalizePriority(t.priority)) === String(filterPriority));
  }
  if (filterCourse) {
    f = f.filter(t => String(t.courseId) === String(filterCourse));
  }
  if (search) {
    f = f.filter(t => (t.title || '').toLowerCase().includes(search) || (t.description || '').toLowerCase().includes(search));
  }
  renderBoard(f);
}

function setPriorityFilter(btn, priorityVal) {
  filterPriority = priorityVal;
  document.querySelectorAll('[data-priority]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

async function moveTask(id, newStatus) {
  await API.tasks.update(id, { status: newStatus });
  const idx = allTasks.findIndex(t => String(t.id) === String(id));
  if (idx >= 0) allTasks[idx].status = newStatus;
  applyFilters();
  showToast(newStatus === 2 ? 'Task completed! 🎉' : 'Status updated ✅', 'success');
}

function openAddTask(defaultStatus = 0) {
  editingTaskId = null;
  document.getElementById('task-modal-title').textContent = 'Add New Task';
  document.getElementById('save-task-btn').textContent = 'Save Task';
  document.getElementById('t-title').value = '';
  document.getElementById('t-course').value = courses[0]?.id || '';
  document.getElementById('t-priority').value = '1'; // Medium
  document.getElementById('t-status').value = String(defaultStatus);
  document.getElementById('t-desc').value = '';

  const d = new Date();
  d.setDate(d.getDate() + 7);
  document.getElementById('t-due').value = d.toISOString().split('T')[0];

  openModal('task-modal');
}

async function openEditTask(id) {
  const t = allTasks.find(x => String(x.id) === String(id));
  if (!t) return;
  editingTaskId = id;
  document.getElementById('task-modal-title').textContent = 'Edit Task';
  document.getElementById('save-task-btn').textContent = 'Update Task';
  document.getElementById('t-title').value    = t.title || '';
  document.getElementById('t-course').value   = t.courseId || '';
  document.getElementById('t-priority').value = String(normalizePriority(t.priority));
  document.getElementById('t-status').value   = String(normalizeStatus(t.status));
  document.getElementById('t-due').value      = (t.dueDate || '').split('T')[0];
  document.getElementById('t-desc').value     = t.description || '';
  openModal('task-modal');
}

async function saveTask() {
  const title    = document.getElementById('t-title').value.trim();
  const courseId = document.getElementById('t-course').value;
  const dueDate  = document.getElementById('t-due').value;
  const priority = parseInt(document.getElementById('t-priority').value);
  const status   = parseInt(document.getElementById('t-status').value);
  const description = document.getElementById('t-desc').value.trim();

  if (!title || !courseId || !dueDate) {
    return showToast('Please fill in title, course, and due date', 'error');
  }

  const data = { title, courseId, dueDate, priority, status, description };

  const btn = document.getElementById('save-task-btn');
  btn.disabled = true;
  btn.textContent = 'Saving…';
  try {
    if (editingTaskId) {
      await API.tasks.update(editingTaskId, data);
      const idx = allTasks.findIndex(t => String(t.id) === String(editingTaskId));
      if (idx >= 0) allTasks[idx] = { ...allTasks[idx], ...data };
      showToast('Task updated ✅', 'success');
    } else {
      const nt = await API.tasks.create(data);
      allTasks.push(nt);
      showToast('Task added ✅', 'success');
    }
    closeModal('task-modal');
    applyFilters();
  } catch (e) {
    showToast(e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = editingTaskId ? 'Update Task' : 'Save Task';
  }
}

async function deleteTask(id, name) {
  if (!await confirmDelete(name, 'Task')) return;
  await API.tasks.remove(id);
  allTasks = allTasks.filter(t => String(t.id) !== String(id));
  applyFilters();
  showToast('Task deleted ✅', 'success');
}

async function initTasks() {
  if (!requireAuth()) return;
  document.querySelector('.main-content').insertAdjacentHTML(
    'afterbegin',
    TOPBAR_HTML('My Tasks', 'Manage assignments, projects & deadlines')
  );
  initLayout('tasks');

  [allTasks, courses] = await Promise.all([API.tasks.getAll(), API.courses.getAll()]);

  const opts = courses.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  document.getElementById('filter-course').innerHTML = '<option value="">All Courses</option>' + opts;
  document.getElementById('t-course').innerHTML      = opts;

  renderBoard(allTasks);
  hideLoading();
}

initTasks();
