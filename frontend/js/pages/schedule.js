/* ═══════════════════════════════════════════════════════════════
   schedule.js  —  Weekly timetable and exam schedule logic
   Connected to /api/Schedules & /api/Exams
   ═══════════════════════════════════════════════════════════════ */

document.getElementById('app').insertAdjacentHTML('afterbegin', SIDEBAR_HTML);

const DAYS = [
  { val: 0, name: 'Sun' },
  { val: 1, name: 'Mon' },
  { val: 2, name: 'Tue' },
  { val: 3, name: 'Wed' },
  { val: 4, name: 'Thu' },
  { val: 5, name: 'Fri' },
  { val: 6, name: 'Sat' },
];

let courses = [], schedules = [], exams = [];
let editingScheduleId = null;
let editingExamId = null;

async function initSchedule() {
  if (!requireAuth()) return;
  document.querySelector('.main-content').insertAdjacentHTML(
    'afterbegin',
    TOPBAR_HTML('My Schedule & Exams', 'Weekly lectures & exam countdown')
  );
  initLayout('schedule');

  [courses, schedules, exams] = await Promise.all([
    API.courses.getAll(),
    API.schedules.getAll(),
    API.exams.getAll()
  ]);

  const opts = courses.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  document.getElementById('lec-course').innerHTML = '<option value="">Select course</option>' + opts;
  document.getElementById('ex-course').innerHTML  = '<option value="">Select course</option>' + opts;

  // Default exam date = 14 days ahead
  const d = new Date();
  d.setDate(d.getDate() + 14);
  document.getElementById('ex-date').value = d.toISOString().split('T')[0];

  renderWeek();
  renderExams();
  hideLoading();
  document.getElementById('page-main').style.opacity = '1';
}

function renderWeek() {
  const cm = Object.fromEntries(courses.map(c => [c.id, c]));
  const now = new Date();
  const todayDayVal = now.getDay();

  // Header (7 days: Sun to Sat)
  document.getElementById('week-header').innerHTML = DAYS.map(d =>
    `<div class="week-day-col-hdr ${d.val === todayDayVal ? 'today' : ''}">${d.name}</div>`
  ).join('');

  // Body
  document.getElementById('week-body').innerHTML = DAYS.map(dayObj => {
    const dayLectures = schedules
      .filter(l => Number(l.dayOfWeek) === dayObj.val)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

    if (!dayLectures.length) return `<div class="week-day-col"></div>`;

    return `<div class="week-day-col">${dayLectures.map(l => {
      const course = cm[l.courseId];
      return `
        <div class="lecture-pill">
          <div class="lecture-pill-name">${l.title || course?.name || 'Lecture'}</div>
          <div class="lecture-pill-time">${(l.startTime || '').slice(0, 5)} – ${(l.endTime || '').slice(0, 5)}</div>
          ${l.location ? `<div class="lecture-pill-loc">📍 ${l.location}</div>` : ''}
          <div class="lecture-pill-actions">
            <button class="lecture-del-btn" onclick="openEditLecture(${l.id})">✏️</button>
            <button class="lecture-del-btn" onclick="deleteLecture(${l.id})">✕</button>
          </div>
        </div>`;
    }).join('')}</div>`;
  }).join('');
}

function renderExams() {
  const cm = Object.fromEntries(courses.map(c => [c.id, c]));
  const upcoming = exams
    .filter(e => daysUntil(e.examDate) >= 0)
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));

  document.getElementById('exam-count-label').textContent =
    `${upcoming.length} upcoming exam${upcoming.length !== 1 ? 's' : ''}`;

  if (!upcoming.length) {
    document.getElementById('exam-list').innerHTML = `
      <div class="empty-state empty-state--padded">
        <div class="empty-icon">📝</div>
        <div class="empty-title">No exams scheduled</div>
        <div class="empty-desc">Add an exam to track its countdown</div>
      </div>`;
    return;
  }

  document.getElementById('exam-list').innerHTML = upcoming.map(e => {
    const d = daysUntil(e.examDate);
    const c = cm[e.courseId];
    const countdownClass = d <= 3 ? 'exam-countdown--urgent' : d <= 7 ? 'exam-countdown--soon' : 'exam-countdown--normal';
    return `
      <div class="exam-item">
        <div class="exam-countdown ${countdownClass}">
          <div class="num">${d}</div>
          <div class="lbl">${d === 1 ? 'day' : 'days'}</div>
        </div>
        <div class="exam-info">
          <div class="exam-name">${e.title || c?.name || 'Exam'}</div>
          <div class="exam-meta">📅 ${formatDate(e.examDate)}${e.location ? ' · 📍 ' + e.location : ''}</div>
          ${e.notes ? `<div class="exam-meta exam-notes">${e.notes}</div>` : ''}
        </div>
        <button class="btn btn-icon btn-sm btn-secondary" onclick="openEditExam(${e.id})">✏️</button>
        <button class="btn btn-icon btn-sm btn-danger" onclick="deleteExam(${e.id})">🗑</button>
      </div>`;
  }).join('');
}

function openAddLecture() {
  editingScheduleId = null;
  document.getElementById('lecture-modal-title').textContent = 'Add Lecture Schedule';
  document.getElementById('save-lecture-btn').textContent = 'Save Schedule';
  document.getElementById('lec-course').value = courses[0]?.id || '';
  document.getElementById('lec-title').value = '';
  document.getElementById('lec-day').value = '1';
  document.getElementById('lec-loc').value = '';
  document.getElementById('lec-start').value = '09:00';
  document.getElementById('lec-end').value = '11:00';
  openModal('lecture-modal');
}

function openEditLecture(id) {
  const l = schedules.find(x => String(x.id) === String(id));
  if (!l) return;
  editingScheduleId = id;
  document.getElementById('lecture-modal-title').textContent = 'Edit Lecture Schedule';
  document.getElementById('save-lecture-btn').textContent = 'Update Schedule';
  document.getElementById('lec-title').value = l.title || '';
  document.getElementById('lec-day').value = String(l.dayOfWeek ?? 1);
  document.getElementById('lec-loc').value = l.location || '';
  document.getElementById('lec-start').value = (l.startTime || '09:00').slice(0, 5);
  document.getElementById('lec-end').value = (l.endTime || '11:00').slice(0, 5);
  openModal('lecture-modal');
  // Set course AFTER openModal to avoid focus interference
  setTimeout(() => {
    document.getElementById('lec-course').value = String(l.courseId || '');
  }, 0);
}

async function saveLecture() {
  const courseId = document.getElementById('lec-course').value;
  const title    = document.getElementById('lec-title').value.trim() || 'Lecture';
  const dayOfWeek = parseInt(document.getElementById('lec-day').value);
  const start    = document.getElementById('lec-start').value;
  const end      = document.getElementById('lec-end').value;
  const location = document.getElementById('lec-loc').value.trim();

  if (!courseId || !start || !end) return showToast('Please fill in course and lecture times', 'error');

  const btn = document.getElementById('save-lecture-btn');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    if (editingScheduleId) {
      await API.schedules.update(editingScheduleId, { title, dayOfWeek, startTime: start, endTime: end, location, courseId: Number(courseId) });
      const idx = schedules.findIndex(x => String(x.id) === String(editingScheduleId));
      if (idx >= 0) schedules[idx] = { ...schedules[idx], title, dayOfWeek, startTime: start, endTime: end, location, courseId: Number(courseId) };
      showToast('Schedule updated ✅', 'success');
    } else {
      const l = await API.schedules.create({ courseId, title, dayOfWeek, startTime: start, endTime: end, location });
      schedules.push(l);
      showToast('Lecture added to timetable ✅', 'success');
    }
    closeModal('lecture-modal');
    renderWeek();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = editingScheduleId ? 'Update Schedule' : 'Save Schedule';
  }
}

function openAddExam() {
  editingExamId = null;
  document.getElementById('exam-modal-title').textContent = 'Add Exam';
  document.getElementById('save-exam-btn').textContent = 'Save Exam';
  document.getElementById('ex-course').value = courses[0]?.id || '';
  document.getElementById('ex-title').value = '';
  document.getElementById('ex-loc').value = '';
  document.getElementById('ex-notes').value = '';
  const d = new Date(); d.setDate(d.getDate() + 14);
  document.getElementById('ex-date').value = d.toISOString().split('T')[0];
  openModal('exam-modal');
}

function openEditExam(id) {
  const e = exams.find(x => String(x.id) === String(id));
  if (!e) return;
  editingExamId = id;
  document.getElementById('exam-modal-title').textContent = 'Edit Exam';
  document.getElementById('save-exam-btn').textContent = 'Update Exam';
  document.getElementById('ex-title').value = e.title || '';
  document.getElementById('ex-loc').value = e.location || '';
  document.getElementById('ex-notes').value = e.notes || '';
  document.getElementById('ex-date').value = (e.examDate || '').split('T')[0];
  openModal('exam-modal');
  // Set course AFTER openModal to avoid focus reset overriding the value
  setTimeout(() => {
    document.getElementById('ex-course').value = String(e.courseId || '');
  }, 0);
}

async function saveExam() {
  const courseId = document.getElementById('ex-course').value;
  const title    = document.getElementById('ex-title').value.trim() || 'Exam';
  const examDate = document.getElementById('ex-date').value;
  const location = document.getElementById('ex-loc').value.trim();
  const notes    = document.getElementById('ex-notes').value.trim();

  if (!courseId || !examDate) return showToast('Please select course and exam date', 'error');

  const btn = document.getElementById('save-exam-btn');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    if (editingExamId) {
      await API.exams.update(editingExamId, { title, examDate, location, notes, courseId: Number(courseId) });
      const idx = exams.findIndex(x => String(x.id) === String(editingExamId));
      if (idx >= 0) exams[idx] = { ...exams[idx], title, examDate, location, notes, courseId: Number(courseId) };
      showToast('Exam updated ✅', 'success');
    } else {
      const e = await API.exams.create({ courseId, title, examDate, location, notes });
      exams.push(e);
      showToast('Exam added ✅', 'success');
    }
    closeModal('exam-modal');
    renderExams();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = editingExamId ? 'Update Exam' : 'Save Exam';
  }
}

async function deleteLecture(id) {
  if (!await confirmDelete('this lecture schedule', 'Lecture Schedule')) return;
  await API.schedules.remove(id);
  schedules = schedules.filter(l => String(l.id) !== String(id));
  renderWeek();
  showToast('Lecture removed ✅', 'success');
}

async function deleteExam(id) {
  if (!await confirmDelete('this exam', 'Exam')) return;
  await API.exams.remove(id);
  exams = exams.filter(e => String(e.id) !== String(id));
  renderExams();
  showToast('Exam removed ✅', 'success');
}

initSchedule();
