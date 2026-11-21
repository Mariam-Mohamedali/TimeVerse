/* ═══════════════════════════════════════════════════════════════
   courses.js  —  My Courses page logic
   Connected to /api/Courses, /api/Schedules, /api/Exams
   ═══════════════════════════════════════════════════════════════ */

document.getElementById('app').insertAdjacentHTML('afterbegin', SIDEBAR_HTML);

let allCourses = [];
let allSchedules = [];
let allExams = [];
let editingId = null;

const STONE_THEMES = [
  { className: 'theme-stone--space',   icon: '🔵' },
  { className: 'theme-stone--mind',    icon: '🟡' },
  { className: 'theme-stone--reality', icon: '🔴' },
  { className: 'theme-stone--power',   icon: '🟣' },
  { className: 'theme-stone--time',    icon: '🟢' },
  { className: 'theme-stone--soul',    icon: '🟠' },
];

async function initCourses() {
  if (!requireAuth()) return;

  document.querySelector('.main-content').insertAdjacentHTML(
    'afterbegin', TOPBAR_HTML('My Courses', 'Manage your enrolled curriculum')
  );
  initLayout('courses');

  try {
    const [courses, schedules, exams] = await Promise.all([
      API.courses.getAll(),
      API.schedules.getAll(),
      API.exams.getAll(),
    ]);

    allCourses = courses;
    allSchedules = schedules;
    allExams = exams;

    document.getElementById('stat-total').textContent = courses.length;
    document.getElementById('stat-lectures').textContent = schedules.length;
    document.getElementById('stat-exams').textContent = exams.filter(e => daysUntil(e.examDate) >= 0).length;

    renderCourses();
  } catch (err) {
    showToast('Failed to load courses: ' + err.message, 'error');
  }

  hideLoading();
}

function renderCourses() {
  const grid = document.getElementById('courses-grid');

  if (!allCourses.length) {
    grid.innerHTML = `
      <div class="courses-empty empty-state">
        <div class="empty-icon">📭</div>
        <div class="empty-title">No courses yet</div>
        <div class="empty-desc">Click "Add Course" to enroll in your first course.</div>
      </div>`;
    return;
  }

  grid.innerHTML = allCourses.map((c, i) => renderCourseCard(c, i)).join('');
}

function renderCourseCard(c, i) {
  const theme = STONE_THEMES[i % STONE_THEMES.length];
  const courseSchedules = allSchedules.filter(s => String(s.courseId) === String(c.id));
  const courseExams = allExams.filter(e => String(e.courseId) === String(c.id));

  return `
    <div class="course-card ${theme.className}" id="course-${c.id}">
      <div class="course-top-border"></div>
      <div class="course-banner">
        <span class="course-banner-emoji">${theme.icon}</span>
      </div>
      <div class="course-body">
        <div class="course-name">${escHtml(c.name)}</div>
        <div class="course-instructor">${escHtml(c.description || 'No description provided')}</div>

        <div class="course-meta-row">
          <span class="course-schedule-chip">🗓️ ${courseSchedules.length} Lecture${courseSchedules.length !== 1 ? 's' : ''}</span>
          <span class="course-schedule-chip">📝 ${courseExams.length} Exam${courseExams.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div class="course-actions">
        <button class="btn btn-sm btn-ghost" onclick="viewCourseDetails(${c.id})">🔍 Details</button>
        <button class="btn btn-sm btn-secondary" onclick="openEditCourse(${c.id})">✏️ Edit</button>
        <button class="btn btn-sm course-delete-btn" onclick="deleteCourse(${c.id}, '${escHtml(c.name)}')">🗑 Delete</button>
      </div>
    </div>
  `;
}

function openAddCourse() {
  editingId = null;
  document.getElementById('course-modal-title').textContent = 'Add New Course';
  document.getElementById('save-course-btn').textContent = 'Save Course';
  document.getElementById('c-name').value = '';
  document.getElementById('c-desc').value = '';
  openModal('course-modal');
}

function openEditCourse(id) {
  const c = allCourses.find(x => String(x.id) === String(id));
  if (!c) return;

  editingId = id;
  document.getElementById('course-modal-title').textContent = 'Edit Course';
  document.getElementById('save-course-btn').textContent = 'Update Course';
  document.getElementById('c-name').value = c.name ?? '';
  document.getElementById('c-desc').value = c.description ?? '';
  openModal('course-modal');
}

async function saveCourse() {
  const name = document.getElementById('c-name').value.trim();
  const description = document.getElementById('c-desc').value.trim();

  if (!name) {
    showToast('Course name is required.', 'error');
    return;
  }

  const btn = document.getElementById('save-course-btn');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    if (editingId) {
      await API.courses.update(editingId, { name, description });
      const idx = allCourses.findIndex(c => String(c.id) === String(editingId));
      if (idx >= 0) allCourses[idx] = { ...allCourses[idx], name, description };
      showToast('Course updated successfully ✅', 'success');
    } else {
      const newCourse = await API.courses.create({ name, description });
      allCourses.push(newCourse);
      document.getElementById('stat-total').textContent = allCourses.length;
      showToast('Course created successfully 🎉', 'success');
    }

    closeModal('course-modal');
    renderCourses();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = editingId ? 'Update Course' : 'Save Course';
  }
}

async function deleteCourse(id, name) {
  if (!await confirmDelete(name, 'Course')) return;
  try {
    await API.courses.remove(id);
    allCourses = allCourses.filter(c => String(c.id) !== String(id));
    document.getElementById('stat-total').textContent = allCourses.length;
    renderCourses();
    showToast(`"${name}" deleted ✅`, 'info');
  } catch (err) {
    showToast('Delete failed: ' + err.message, 'error');
  }
}

async function viewCourseDetails(id) {
  const c = allCourses.find(x => String(x.id) === String(id));
  if (!c) return;

  const schedules = allSchedules.filter(s => String(s.courseId) === String(id));
  const exams = allExams.filter(e => String(e.courseId) === String(id));

  document.getElementById('details-course-name').textContent = c.name;
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  document.getElementById('details-course-body').innerHTML = `
    <div class="details-section">
      <div class="form-label">Description</div>
      <p class="details-desc-text">
        ${escHtml(c.description || 'No description provided.')}
      </p>
    </div>

    <div class="details-section">
      <div class="form-label">Weekly Lectures (${schedules.length})</div>
      ${schedules.length ? schedules.map(s => `
        <div class="details-item-card">
          <strong>${DAYS[s.dayOfWeek] || 'Day'}:</strong> ${(s.startTime || '').slice(0, 5)} – ${(s.endTime || '').slice(0, 5)}
          ${s.location ? `· 📍 ${escHtml(s.location)}` : ''}
        </div>
      `).join('') : '<p class="text-muted text-xs">No lectures scheduled yet.</p>'}
    </div>

    <div>
      <div class="form-label">Exams (${exams.length})</div>
      ${exams.length ? exams.map(e => `
        <div class="details-item-card details-item-card--exam">
          <strong>${escHtml(e.title)}:</strong> ${formatDate(e.examDate)}
          ${e.location ? `· 📍 ${escHtml(e.location)}` : ''}
          ${e.notes ? `<div class="details-item-notes">${escHtml(e.notes)}</div>` : ''}
        </div>
      `).join('') : '<p class="text-muted text-xs">No exams scheduled yet.</p>'}
    </div>
  `;

  openModal('course-details-modal');
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

initCourses();
