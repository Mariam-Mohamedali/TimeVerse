/* ═══════════════════════════════════════════════════════════════════
   TimeVerse — Real Backend API Client
   Connected to ASP.NET Core Backend: http://localhost:5065/api
   With automatic local cache fallback when backend is offline
   ═══════════════════════════════════════════════════════════════════ */

// Redirect from file:// to localhost:3000 for proper database communication & cross-browser sync
if (window.location.protocol === 'file:') {
  const relPath = window.location.pathname.replace(/^.*[\\\/]frontend[\\\/]/i, '').replace(/\\/g, '/');
  window.location.href = 'http://localhost:3000/' + relPath;
}

const API_BASE = localStorage.getItem('tv_api_base') || 'http://localhost:5065/api';

/* ── Local Storage Helper (User-Scoped Storage) ── */
function getCurrentUserId() {
  return localStorage.getItem('tv_student_id') || '0';
}

function getUserKey(key) {
  // Global keys that span across users
  if (key === 'user' || key === 'registered_users' || key === 'seeded_demo_1') {
    return `tv_${key}`;
  }
  const uid = getCurrentUserId();
  return `tv_u${uid}_${key}`;
}

const store = {
  get: (key) => {
    try {
      const fullKey = getUserKey(key);
      const val = localStorage.getItem(fullKey);
      return val !== null ? JSON.parse(val) : null;
    } catch { return null; }
  },
  set: (key, val) => {
    try {
      localStorage.setItem(getUserKey(key), JSON.stringify(val));
    } catch {}
  },
  remove: (key) => {
    try {
      localStorage.removeItem(getUserKey(key));
    } catch {}
  },
  getGlobal: (key) => {
    try {
      const val = localStorage.getItem(`tv_${key}`);
      return val !== null ? JSON.parse(val) : null;
    } catch { return null; }
  },
  setGlobal: (key, val) => {
    try {
      localStorage.setItem(`tv_${key}`, JSON.stringify(val));
    } catch {}
  }
};

/* ── Seed Demo Data (ONLY for Demo Student 1 - Tony Stark) ── */
function seedDemoFallback() {
  if (store.getGlobal('seeded_demo_1')) return;

  const now = new Date();
  const dateStr = (offsetDays = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString();
  };

  const setDemo = (k, v) => localStorage.setItem(`tv_u1_${k}`, JSON.stringify(v));

  setDemo('courses', [
    { id: 1, name: 'Data Structures & Algorithms', description: 'Arrays, Trees, Graphs, Sorting & Complexity', createdAt: dateStr(-10) },
    { id: 2, name: 'Database Management Systems', description: 'Relational model, SQL, Normalization & ACID', createdAt: dateStr(-12) },
    { id: 3, name: 'Computer Networks', description: 'OSI Model, TCP/IP, Routing & Security Protocols', createdAt: dateStr(-14) },
    { id: 4, name: 'Artificial Intelligence', description: 'Machine Learning, Search Algorithms & Neural Networks', createdAt: dateStr(-8) }
  ]);

  setDemo('schedules', [
    { id: 1, courseId: 1, title: 'DSA Lecture', dayOfWeek: 1, startTime: '09:00:00', endTime: '11:00:00', location: 'Hall A-201' },
    { id: 2, courseId: 2, title: 'DBMS Lecture', dayOfWeek: 2, startTime: '11:00:00', endTime: '13:00:00', location: 'Lab B-102' },
    { id: 3, courseId: 3, title: 'Networks Lecture', dayOfWeek: 3, startTime: '14:00:00', endTime: '16:00:00', location: 'Hall C-305' },
    { id: 4, courseId: 4, title: 'AI Lecture', dayOfWeek: 4, startTime: '10:00:00', endTime: '12:00:00', location: 'Hall D-101' },
  ]);

  setDemo('exams', [
    { id: 1, courseId: 1, title: 'DSA Midterm Exam', examDate: dateStr(7), location: 'Main Exam Hall 1', notes: 'Chapters 1 to 5' },
    { id: 2, courseId: 2, title: 'DBMS Final Exam', examDate: dateStr(14), location: 'Hall B-204', notes: 'Full Syllabus & SQL queries' },
  ]);

  setDemo('studentTasks', [
    { id: 1, courseId: 1, title: 'Assignment 1 — Stack & Queue', description: 'Implement circular queue in C++', dueDate: dateStr(3), priority: 2, status: 0, createdAt: dateStr(-2) },
    { id: 2, courseId: 2, title: 'Database Course Project', description: 'Design ERD and SQL schema', dueDate: dateStr(10), priority: 2, status: 1, createdAt: dateStr(-5) },
    { id: 3, courseId: 3, title: 'Networks Quiz 2', description: 'Subnetting & IP addressing', dueDate: dateStr(5), priority: 1, status: 0, createdAt: dateStr(-1) },
    { id: 4, courseId: 4, title: 'AI Research Paper', description: 'Survey on Transformer models', dueDate: dateStr(20), priority: 0, status: 2, createdAt: dateStr(-7) },
  ]);

  setDemo('studyPlans', [
    { id: 1, title: 'Midterms Preparation Plan', startDate: dateStr(0), endDate: dateStr(14), createdAt: dateStr(-1) },
    { id: 2, title: 'Finals Sprint', startDate: dateStr(15), endDate: dateStr(30), createdAt: dateStr(-1) },
  ]);

  setDemo('studySessions', [
    { id: 1, studyPlanId: 1, studentTaskId: 1, title: 'DSA Stack Practice', sessionDate: dateStr(1), durationMinutes: 120, isCompleted: false, createdAt: dateStr(0) },
    { id: 2, studyPlanId: 1, studentTaskId: 2, title: 'SQL Joins & Indexing', sessionDate: dateStr(2), durationMinutes: 90, isCompleted: true, createdAt: dateStr(0) },
    { id: 3, studyPlanId: 1, studentTaskId: 3, title: 'Networks Revision', sessionDate: dateStr(3), durationMinutes: 60, isCompleted: false, createdAt: dateStr(0) },
  ]);

  setDemo('notifications', [
    { id: 1, studentTaskId: 1, examId: null, title: '⏰ Task Reminder', message: 'Assignment 1 — Stack & Queue is due in 3 days!', scheduledAt: dateStr(0), isRead: false, createdAt: dateStr(0) },
    { id: 2, studentTaskId: null, examId: 1, title: '📝 Exam Reminder', message: 'DSA Midterm Exam in 7 days in Main Exam Hall 1', scheduledAt: dateStr(0), isRead: false, createdAt: dateStr(0) },
    { id: 3, studentTaskId: null, examId: null, title: '🔔 Study Reminder', message: 'Time for your DSA Stack Practice session today', scheduledAt: dateStr(0), isRead: true, createdAt: dateStr(0) },
  ]);

  store.setGlobal('seeded_demo_1', true);
}

seedDemoFallback();

/* ── HTTP Request Helper ── */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('tv_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && !token.startsWith('offline-') ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = `${API_BASE}${endpoint}`;

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errorMsg = `HTTP Error ${res.status}`;
      try {
        const errJson = await res.json();
        errorMsg = errJson.message || errJson.title || JSON.stringify(errJson);
      } catch {
        errorMsg = await res.text() || errorMsg;
      }
      throw new Error(errorMsg);
    }

    if (res.status === 204) return true; // NoContent
    return await res.json();
  } catch (err) {
    console.info(`[TimeVerse API] Offline or fallback storage for ${endpoint}: ${err.message}`);
    throw err;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   API EXPORTS
   ═══════════════════════════════════════════════════════════════════ */
window.API = {
  /* ── Auth ── */
  auth: {
    async login(email, password) {
      const normalizedEmail = (email || '').trim().toLowerCase();
      try {
        // 1. Try real login on backend
        const data = await request('/Auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: normalizedEmail, password }),
        });
        if (data.token) localStorage.setItem('tv_token', data.token);
        if (data.studentId) localStorage.setItem('tv_student_id', String(data.studentId));
        store.setGlobal('user', {
          id: data.studentId,
          name: data.fullName,
          email: data.email,
        });
        return data;
      } catch (loginErr) {
        // Check if error is because backend is truly offline/unreachable
        const isNetworkError = loginErr.message && (
          loginErr.message.includes('Failed to fetch') ||
          loginErr.message.includes('NetworkError') ||
          loginErr.message.includes('ERR_CONNECTION_REFUSED')
        );

        if (!isNetworkError) {
          // Backend is running: verify if user simply doesn't exist yet (try auto-register)
          try {
            const users = store.getGlobal('registered_users') || {};
            const localUser = users[normalizedEmail];
            const fullName = localUser?.fullName || normalizedEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

            const regData = await request('/Auth/register', {
              method: 'POST',
              body: JSON.stringify({ fullName, email: normalizedEmail, password, confirmPassword: password }),
            });
            if (regData.token) localStorage.setItem('tv_token', regData.token);
            if (regData.studentId) localStorage.setItem('tv_student_id', String(regData.studentId));
            store.setGlobal('user', {
              id: regData.studentId,
              name: regData.fullName,
              email: regData.email,
            });
            return regData;
          } catch (regErr) {
            // If email already exists, it means the password provided was wrong!
            if (regErr.message && regErr.message.includes('already exists')) {
              throw new Error('Incorrect password for this account. Please check your password.');
            }
            throw new Error(loginErr.message || 'Invalid email or password.');
          }
        }

        // Offline fallback only when backend is unreachable
        const users = store.getGlobal('registered_users') || {};
        const registered = users[normalizedEmail];
        let studentId = registered ? registered.studentId : 1;
        let fullName = registered ? registered.fullName : (normalizedEmail.includes('demo') ? 'Tony Stark' : 'Student');

        const user = {
          studentId,
          fullName,
          email: normalizedEmail,
          token: `offline-token-${studentId}`
        };

        localStorage.setItem('tv_token', user.token);
        localStorage.setItem('tv_student_id', String(studentId));
        store.setGlobal('user', { id: user.studentId, name: user.fullName, email: user.email });
        return user;
      }
    },

    async register({ fullName, email, password, confirmPassword }) {
      const normalizedEmail = (email || '').trim().toLowerCase();
      try {
        const data = await request('/Auth/register', {
          method: 'POST',
          body: JSON.stringify({ fullName, email: normalizedEmail, password, confirmPassword: confirmPassword || password }),
        });
        if (data.token) localStorage.setItem('tv_token', data.token);
        if (data.studentId) localStorage.setItem('tv_student_id', String(data.studentId));
        store.setGlobal('user', {
          id: data.studentId,
          name: data.fullName,
          email: data.email,
        });
        return data;
      } catch (err) {
        if (err.message && err.message.includes('already exists')) {
          throw new Error('An account with this email already exists. Please Sign In instead!');
        }

        const isNetworkError = err.message && (
          err.message.includes('Failed to fetch') ||
          err.message.includes('NetworkError') ||
          err.message.includes('ERR_CONNECTION_REFUSED')
        );
        if (!isNetworkError) {
          throw new Error(err.message || 'Registration failed.');
        }

        // Offline fallback register
        const users = store.getGlobal('registered_users') || {};
        const studentId = Math.abs(Array.from(normalizedEmail).reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0) % 900000) + 1000;
        const user = {
          studentId,
          fullName: fullName.trim(),
          email: normalizedEmail,
          password,
          token: `offline-token-${studentId}`
        };

        users[normalizedEmail] = user;
        store.setGlobal('registered_users', users);
        localStorage.setItem('tv_token', user.token);
        localStorage.setItem('tv_student_id', String(studentId));
        store.setGlobal('user', { id: user.studentId, name: user.fullName, email: user.email });
        return user;
      }
    },

    getUser() {
      const stored = store.getGlobal('user');
      if (stored) return stored;
      if (this.isLoggedIn()) {
        const uid = getCurrentUserId();
        return {
          id: Number(uid) || 1,
          name: 'Student',
          email: '',
          university: 'Avengers Academy',
          major: 'Quantum Computing'
        };
      }
      return {
        id: 0,
        name: 'Guest',
        email: '',
        university: 'Avengers Academy',
        major: ''
      };
    },

    isLoggedIn() {
      return !!localStorage.getItem('tv_token');
    },

    logout() {
      localStorage.removeItem('tv_token');
      localStorage.removeItem('tv_student_id');
      localStorage.removeItem('tv_user');
      window.location.href = 'login.html';
    },

    async updateProfile(updates) {
      const u = this.getUser();
      const updated = { ...u, ...updates };
      store.set('user', updated);
      return updated;
    }
  },

  /* ── Courses (/api/Courses) ── */
  courses: {
    async getAll() {
      try {
        const list = await request('/Courses');
        if (Array.isArray(list)) {
          store.set('courses', list);
          return list;
        }
      } catch {}
      return store.get('courses') || [];
    },

    async getById(id) {
      try {
        return await request(`/Courses/${id}`);
      } catch {
        const list = store.get('courses') || [];
        return list.find(c => String(c.id) === String(id));
      }
    },

    async create({ name, description }) {
      try {
        const res = await request('/Courses', {
          method: 'POST',
          body: JSON.stringify({ name, description }),
        });
        const list = store.get('courses') || [];
        list.push(res);
        store.set('courses', list);
        return res;
      } catch {
        const list = store.get('courses') || [];
        const newCourse = {
          id: Date.now(),
          name,
          description: description || '',
          createdAt: new Date().toISOString()
        };
        list.push(newCourse);
        store.set('courses', list);
        return newCourse;
      }
    },

    async update(id, { name, description }) {
      try {
        await request(`/Courses/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ name, description }),
        });
      } catch {}
      const list = store.get('courses') || [];
      const idx = list.findIndex(c => String(c.id) === String(id));
      if (idx >= 0) {
        list[idx] = { ...list[idx], name, description };
        store.set('courses', list);
      }
      return true;
    },

    async remove(id) {
      try {
        await request(`/Courses/${id}`, { method: 'DELETE' });
      } catch {}
      let list = store.get('courses') || [];
      list = list.filter(c => String(c.id) !== String(id));
      store.set('courses', list);
      return true;
    }
  },

  /* ── Schedules (/api/Schedules) ── */
  schedules: {
    async getAll() {
      try {
        const list = await request('/Schedules');
        if (Array.isArray(list)) {
          store.set('schedules', list);
          return list;
        }
      } catch {}
      return store.get('schedules') || [];
    },

    async getByCourse(courseId) {
      try {
        return await request(`/Schedules/course/${courseId}`);
      } catch {
        const list = store.get('schedules') || [];
        return list.filter(s => String(s.courseId) === String(courseId));
      }
    },

    async getById(id) {
      try {
        return await request(`/Schedules/${id}`);
      } catch {
        const list = store.get('schedules') || [];
        return list.find(s => String(s.id) === String(id));
      }
    },

    async create({ courseId, title, dayOfWeek, startTime, endTime, location }) {
      // Normalize times (e.g. 09:00 -> 09:00:00)
      const fmtTime = t => (t && t.length === 5) ? `${t}:00` : t;
      const payload = {
        courseId: Number(courseId),
        title,
        dayOfWeek: Number(dayOfWeek),
        startTime: fmtTime(startTime),
        endTime: fmtTime(endTime),
        location: location || ''
      };
      try {
        const res = await request('/Schedules', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const list = store.get('schedules') || [];
        list.push(res);
        store.set('schedules', list);
        return res;
      } catch {
        const list = store.get('schedules') || [];
        const item = { id: Date.now(), ...payload };
        list.push(item);
        store.set('schedules', list);
        return item;
      }
    },

    async update(id, { title, dayOfWeek, startTime, endTime, location, courseId }) {
      const fmtTime = t => (t && t.length === 5) ? `${t}:00` : t;
      const payload = {
        title,
        dayOfWeek: Number(dayOfWeek),
        startTime: fmtTime(startTime),
        endTime: fmtTime(endTime),
        location: location || ''
      };
      if (courseId) payload.courseId = Number(courseId);
      try {
        await request(`/Schedules/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } catch {}
      const list = store.get('schedules') || [];
      const idx = list.findIndex(s => String(s.id) === String(id));
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...payload };
        store.set('schedules', list);
      }
      return true;
    },

    async remove(id) {
      try {
        await request(`/Schedules/${id}`, { method: 'DELETE' });
      } catch {}
      let list = store.get('schedules') || [];
      list = list.filter(s => String(s.id) !== String(id));
      store.set('schedules', list);
      return true;
    }
  },

  /* ── Exams (/api/Exams) ── */
  exams: {
    async getAll() {
      try {
        const list = await request('/Exams');
        if (Array.isArray(list)) {
          store.set('exams', list);
          return list;
        }
      } catch {}
      return store.get('exams') || [];
    },

    async getById(id) {
      try {
        return await request(`/Exams/${id}`);
      } catch {
        const list = store.get('exams') || [];
        return list.find(e => String(e.id) === String(id));
      }
    },

    async create({ courseId, title, examDate, location, notes }) {
      const payload = {
        courseId: Number(courseId),
        title,
        examDate: new Date(examDate).toISOString(),
        location: location || '',
        notes: notes || ''
      };
      try {
        const res = await request('/Exams', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const list = store.get('exams') || [];
        list.push(res);
        store.set('exams', list);
        return res;
      } catch {
        const list = store.get('exams') || [];
        const item = { id: Date.now(), ...payload };
        list.push(item);
        store.set('exams', list);
        return item;
      }
    },

    async update(id, { title, examDate, location, notes, courseId }) {
      const payload = {
        title,
        examDate: new Date(examDate).toISOString(),
        location: location || '',
        notes: notes || ''
      };
      if (courseId) payload.courseId = Number(courseId);
      try {
        await request(`/Exams/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } catch {}
      const list = store.get('exams') || [];
      const idx = list.findIndex(e => String(e.id) === String(id));
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...payload };
        store.set('exams', list);
      }
      return true;
    },

    async remove(id) {
      try {
        await request(`/Exams/${id}`, { method: 'DELETE' });
      } catch {}
      let list = store.get('exams') || [];
      list = list.filter(e => String(e.id) !== String(id));
      store.set('exams', list);
      return true;
    }
  },

  /* ── Student Tasks (/api/StudentTasks) ── */
  tasks: {
    async getAll() {
      try {
        const list = await request('/StudentTasks');
        if (Array.isArray(list)) {
          store.set('studentTasks', list);
          return list;
        }
      } catch {}
      return store.get('studentTasks') || [];
    },

    async getById(id) {
      try {
        return await request(`/StudentTasks/${id}`);
      } catch {
        const list = store.get('studentTasks') || [];
        return list.find(t => String(t.id) === String(id));
      }
    },

    async create({ courseId, title, description, dueDate, priority, status = 0 }) {
      const statusNum = typeof status === 'string'
        ? (status === 'Completed' || status === 'Done' ? 2 : status === 'InProgress' || status === 'In Progress' ? 1 : 0)
        : Number(status || 0);
      const payload = {
        courseId: Number(courseId),
        title,
        description: description || '',
        dueDate: new Date(dueDate).toISOString(),
        priority: typeof priority === 'string' ? (priority === 'High' ? 2 : priority === 'Medium' ? 1 : 0) : Number(priority || 0),
      };
      try {
        const res = await request('/StudentTasks', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        // If status is not Pending, update it immediately via API
        if (statusNum !== 0) {
          try {
            await request(`/StudentTasks/${res.id}`, {
              method: 'PUT',
              body: JSON.stringify({ ...payload, status: statusNum }),
            });
            res.status = statusNum;
          } catch {}
        }
        const list = store.get('studentTasks') || [];
        list.push(res);
        store.set('studentTasks', list);
        return res;
      } catch {
        const list = store.get('studentTasks') || [];
        const item = {
          id: Date.now(),
          ...payload,
          status: statusNum,
          createdAt: new Date().toISOString()
        };
        list.push(item);
        store.set('studentTasks', list);
        return item;
      }
    },

    async update(id, updates) {
      const existing = (store.get('studentTasks') || []).find(t => String(t.id) === String(id)) || {};
      const payload = {
        title: updates.title !== undefined ? updates.title : existing.title,
        description: updates.description !== undefined ? updates.description : existing.description,
        dueDate: updates.dueDate ? new Date(updates.dueDate).toISOString() : existing.dueDate,
        priority: updates.priority !== undefined
          ? (typeof updates.priority === 'string' ? (updates.priority === 'High' ? 2 : updates.priority === 'Medium' ? 1 : 0) : Number(updates.priority))
          : existing.priority,
        status: updates.status !== undefined
          ? (typeof updates.status === 'string' ? (updates.status === 'Completed' || updates.status === 'Done' ? 2 : updates.status === 'InProgress' || updates.status === 'In Progress' ? 1 : 0) : Number(updates.status))
          : existing.status,
      };

      try {
        await request(`/StudentTasks/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } catch {}
      const list = store.get('studentTasks') || [];
      const idx = list.findIndex(t => String(t.id) === String(id));
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...payload };
        store.set('studentTasks', list);
      }
      return true;
    },

    async remove(id) {
      try {
        await request(`/StudentTasks/${id}`, { method: 'DELETE' });
      } catch {}
      let list = store.get('studentTasks') || [];
      list = list.filter(t => String(t.id) !== String(id));
      store.set('studentTasks', list);
      return true;
    }
  },

  /* ── Study Plans (/api/StudyPlans) ── */
  studyPlans: {
    async getAll() {
      try {
        const list = await request('/StudyPlans');
        if (Array.isArray(list)) {
          store.set('studyPlans', list);
          return list;
        }
      } catch {}
      return store.get('studyPlans') || [];
    },

    async getById(id) {
      try {
        return await request(`/StudyPlans/${id}`);
      } catch {
        const list = store.get('studyPlans') || [];
        return list.find(p => String(p.id) === String(id));
      }
    },

    async create({ title, startDate, endDate }) {
      const payload = {
        title,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      };
      try {
        const res = await request('/StudyPlans', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const list = store.get('studyPlans') || [];
        list.push(res);
        store.set('studyPlans', list);
        return res;
      } catch {
        const list = store.get('studyPlans') || [];
        const item = { id: Date.now(), ...payload, createdAt: new Date().toISOString() };
        list.push(item);
        store.set('studyPlans', list);
        return item;
      }
    },

    async update(id, { title, startDate, endDate }) {
      const payload = {
        title,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      };
      try {
        await request(`/StudyPlans/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } catch {}
      const list = store.get('studyPlans') || [];
      const idx = list.findIndex(p => String(p.id) === String(id));
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...payload };
        store.set('studyPlans', list);
      }
      return true;
    },

    async remove(id) {
      try {
        await request(`/StudyPlans/${id}`, { method: 'DELETE' });
      } catch {}
      let list = store.get('studyPlans') || [];
      list = list.filter(p => String(p.id) !== String(id));
      store.set('studyPlans', list);
      return true;
    }
  },

  /* ── Study Sessions (/api/StudySessions) ── */
  studySessions: {
    async getAll() {
      try {
        const list = await request('/StudySessions');
        if (Array.isArray(list)) {
          store.set('studySessions', list);
          return list;
        }
      } catch {}
      return store.get('studySessions') || [];
    },

    async getById(id) {
      try {
        return await request(`/StudySessions/${id}`);
      } catch {
        const list = store.get('studySessions') || [];
        return list.find(s => String(s.id) === String(id));
      }
    },

    async create({ studyPlanId, studentTaskId, title, sessionDate, durationMinutes }) {
      const payload = {
        studyPlanId: Number(studyPlanId),
        studentTaskId: studentTaskId ? Number(studentTaskId) : null,
        title,
        sessionDate: new Date(sessionDate).toISOString(),
        durationMinutes: Number(durationMinutes || 60),
      };
      try {
        const res = await request('/StudySessions', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const list = store.get('studySessions') || [];
        list.push(res);
        store.set('studySessions', list);
        return res;
      } catch {
        const list = store.get('studySessions') || [];
        const item = {
          id: Date.now(),
          ...payload,
          isCompleted: false,
          createdAt: new Date().toISOString()
        };
        list.push(item);
        store.set('studySessions', list);
        return item;
      }
    },

    async update(id, updates) {
      const existing = (store.get('studySessions') || []).find(s => String(s.id) === String(id)) || {};
      const payload = {
        studentTaskId: updates.studentTaskId !== undefined ? (updates.studentTaskId ? Number(updates.studentTaskId) : null) : existing.studentTaskId,
        title: updates.title !== undefined ? updates.title : existing.title,
        sessionDate: updates.sessionDate ? new Date(updates.sessionDate).toISOString() : existing.sessionDate,
        durationMinutes: updates.durationMinutes !== undefined ? Number(updates.durationMinutes) : existing.durationMinutes,
        isCompleted: updates.isCompleted !== undefined ? Boolean(updates.isCompleted) : existing.isCompleted,
      };
      try {
        await request(`/StudySessions/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } catch {}
      const list = store.get('studySessions') || [];
      const idx = list.findIndex(s => String(s.id) === String(id));
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...payload };
        store.set('studySessions', list);
      }
      return true;
    },

    async remove(id) {
      try {
        await request(`/StudySessions/${id}`, { method: 'DELETE' });
      } catch {}
      let list = store.get('studySessions') || [];
      list = list.filter(s => String(s.id) !== String(id));
      store.set('studySessions', list);
      return true;
    }
  },

  /* ── Notifications (/api/Notifications) ── */
  notifications: {
    async getAll() {
      try {
        const list = await request('/Notifications');
        if (Array.isArray(list)) {
          store.set('notifications', list);
          return list;
        }
      } catch {}
      return store.get('notifications') || [];
    },

    async getById(id) {
      try {
        return await request(`/Notifications/${id}`);
      } catch {
        const list = store.get('notifications') || [];
        return list.find(n => String(n.id) === String(id));
      }
    },

    async create({ title, message, scheduledAt }) {
      const payload = {
        title,
        message,
        scheduledAt: new Date(scheduledAt || Date.now()).toISOString(),
      };
      try {
        const res = await request('/Notifications', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const list = store.get('notifications') || [];
        list.push(res);
        store.set('notifications', list);
        return res;
      } catch {
        const list = store.get('notifications') || [];
        const item = {
          id: Date.now(),
          ...payload,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        list.push(item);
        store.set('notifications', list);
        return item;
      }
    },

    async markRead(id) {
      try {
        await request(`/Notifications/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ isRead: true }),
        });
      } catch {}
      const list = store.get('notifications') || [];
      const idx = list.findIndex(n => String(n.id) === String(id));
      if (idx >= 0) {
        list[idx].isRead = true;
        store.set('notifications', list);
      }
      return true;
    },

    async markAllRead() {
      const list = store.get('notifications') || [];
      for (const n of list) {
        if (!n.isRead) {
          try {
            await request(`/Notifications/${n.id}`, {
              method: 'PUT',
              body: JSON.stringify({ isRead: true }),
            });
          } catch {}
          n.isRead = true;
        }
      }
      store.set('notifications', list);
      return true;
    },

    async remove(id) {
      try {
        await request(`/Notifications/${id}`, { method: 'DELETE' });
      } catch {}
      let list = store.get('notifications') || [];
      list = list.filter(n => String(n.id) !== String(id));
      store.set('notifications', list);
      return true;
    }
  },

  /* ── Legacy Aliases for backwards compatibility ── */
  lectures: {
    getAll: () => window.API.schedules.getAll(),
    create: (data) => window.API.schedules.create(data),
    remove: (id) => window.API.schedules.remove(id)
  },
  sessions: {
    getAll: () => window.API.studySessions.getAll(),
    create: (data) => window.API.studySessions.create(data),
    update: (id, data) => window.API.studySessions.update(id, data),
    remove: (id) => window.API.studySessions.remove(id)
  }
};
