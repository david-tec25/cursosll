import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db.js';
import { Student, Course, Teacher, ScheduleItem, RecentActivityItem } from './types.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});


// API Routes

// Students
app.get('/api/students', async (req, res) => {
  try {
    const result = await query(
      `SELECT s.id, s.name, s.email, s.phone, s.folio, s.level, s.status, s.username, s.temp_password AS "tempPassword", s.registered_at AS "registeredAt", s.avatar,
              COALESCE((SELECT json_agg(sc.course_id) FROM student_courses sc WHERE sc.student_id = s.id), '[]'::json) AS "courseIds",
              COALESCE((
                SELECT json_agg(json_build_object('courseId', sc.course_id, 'totalSessions', sc.total_sessions, 'completedSessions', sc.completed_sessions)) 
                FROM student_courses sc 
                WHERE sc.student_id = s.id
              ), '[]'::json) AS "enrollments"
       FROM students s
       ORDER BY s.registered_at DESC`
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching students:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/students', async (req, res) => {
  const newStudent: Student = req.body;
  if (!newStudent.id) {
    newStudent.id = `st-${Date.now()}`;
  }
  
  try {
    // 1. Insert new student
    const studentRes = await query(
      `INSERT INTO students (id, name, email, phone, folio, level, status, username, temp_password, registered_at, avatar) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING id, name, email, phone, folio, level, status, username, temp_password AS "tempPassword", registered_at AS "registeredAt", avatar`,
      [
        newStudent.id,
        newStudent.name,
        newStudent.email,
        newStudent.phone,
        newStudent.folio,
        newStudent.level,
        newStudent.status,
        newStudent.username || null,
        newStudent.tempPassword || null,
        newStudent.registeredAt,
        newStudent.avatar || null
      ]
    );

    // 2. Insert recent activity
    const activityId = `act-${Date.now()}`;
    const initials = newStudent.name.split(' ').map(n => n[0]).join('').substring(0, 2);
    const activityRes = await query(
      `INSERT INTO recent_activities (id, username, user_initials, action, date_time, status, type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, username AS user, user_initials AS "userInitials", action, date_time AS "dateTime", status, type`,
      [
        activityId,
        newStudent.name,
        initials,
        'Registro en sistema',
        'Justo ahora',
        'Completado',
        'registro'
      ]
    );

    res.status(201).json({ 
      student: { ...studentRes.rows[0], courseIds: [] }, 
      activity: activityRes.rows[0] 
    });
  } catch (err: any) {
    console.error('Error inserting student:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/students/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await query(
      `UPDATE students 
       SET status = $1 
       WHERE id = $2 
       RETURNING id, name, email, phone, folio, level, status, username, temp_password AS "tempPassword", registered_at AS "registeredAt", avatar,
                 COALESCE((SELECT json_agg(sc.course_id) FROM student_courses sc WHERE sc.student_id = students.id), '[]'::json) AS "courseIds",
                 COALESCE((
                   SELECT json_agg(json_build_object('courseId', sc.course_id, 'totalSessions', sc.total_sessions, 'completedSessions', sc.completed_sessions)) 
                   FROM student_courses sc 
                   WHERE sc.student_id = students.id
                 ), '[]'::json) AS "enrollments"`,
      [status, id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Estudiante no encontrado' });
    }
  } catch (err: any) {
    console.error('Error updating student status:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/students/:id/credentials', async (req, res) => {
  const { id } = req.params;
  const { username, tempPassword, status } = req.body;

  try {
    const result = await query(
      `UPDATE students 
       SET username = $1, temp_password = $2, status = $3 
       WHERE id = $4 
       RETURNING id, name, email, phone, folio, level, status, username, temp_password AS "tempPassword", registered_at AS "registeredAt", avatar,
                 COALESCE((SELECT json_agg(sc.course_id) FROM student_courses sc WHERE sc.student_id = students.id), '[]'::json) AS "courseIds",
                 COALESCE((
                   SELECT json_agg(json_build_object('courseId', sc.course_id, 'totalSessions', sc.total_sessions, 'completedSessions', sc.completed_sessions)) 
                   FROM student_courses sc 
                   WHERE sc.student_id = students.id
                 ), '[]'::json) AS "enrollments"`,
      [username, tempPassword, status, id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Estudiante no encontrado' });
    }
  } catch (err: any) {
    console.error('Error updating student credentials:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, folio, level, status, username, tempPassword, avatar } = req.body;

  try {
    const result = await query(
      `UPDATE students 
       SET name = $1, email = $2, phone = $3, folio = $4, level = $5, status = $6, username = $7, temp_password = $8, avatar = $9 
       WHERE id = $10 
       RETURNING id, name, email, phone, folio, level, status, username, temp_password AS "tempPassword", registered_at AS "registeredAt", avatar,
                 COALESCE((SELECT json_agg(sc.course_id) FROM student_courses sc WHERE sc.student_id = students.id), '[]'::json) AS "courseIds",
                 COALESCE((
                   SELECT json_agg(json_build_object('courseId', sc.course_id, 'totalSessions', sc.total_sessions, 'completedSessions', sc.completed_sessions)) 
                   FROM student_courses sc 
                   WHERE sc.student_id = students.id
                 ), '[]'::json) AS "enrollments"`,
      [name, email, phone, folio, level, status, username || null, tempPassword || null, avatar || null, id]
    );

    if (result.rows.length > 0) {
      // Log recent activity
      const activityId = `act-${Date.now()}`;
      const activityRes = await query(
        `INSERT INTO recent_activities (id, username, user_initials, action, date_time, status, type) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING id, username AS user, user_initials AS "userInitials", action, date_time AS "dateTime", status, type`,
        [
          activityId,
          'Administrador',
          'AD',
          `Modificación del alumno: ${name}`,
          'Justo ahora',
          'Completado',
          'registro'
        ]
      );
      res.json({ success: true, student: result.rows[0], activity: activityRes.rows[0] });
    } else {
      res.status(404).json({ error: 'Estudiante no encontrado' });
    }
  } catch (err: any) {
    console.error('Error updating student:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get student details (name, username) before deleting to clean up activities
    const studentRes = await query(
      `SELECT name, username FROM students WHERE id = $1`,
      [id]
    );

    if (studentRes.rows.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    const { name, username } = studentRes.rows[0];

    // 2. Delete student (Cascades to student_courses automatically)
    await query(`DELETE FROM students WHERE id = $1`, [id]);

    // 3. Delete related activities (log history of the student)
    await query(
      `DELETE FROM recent_activities WHERE username = $1 OR username = $2`,
      [name, username]
    );

    // 4. Log the deletion activity
    const activityId = `act-${Date.now()}`;
    const activityRes = await query(
      `INSERT INTO recent_activities (id, username, user_initials, action, date_time, status, type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, username AS user, user_initials AS "userInitials", action, date_time AS "dateTime", status, type`,
      [
        activityId,
        'Administrador',
        'AD',
        `Eliminación del alumno: ${name}`,
        'Justo ahora',
        'Completado',
        'curso'
      ]
    );

    res.json({ success: true, activity: activityRes.rows[0] });
  } catch (err: any) {
    console.error('Error deleting student:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/students/:id/courses', async (req, res) => {
  const { id } = req.params;
  const { courseId, totalSessions } = req.body;
  if (!courseId) {
    return res.status(400).json({ error: 'courseId es requerido' });
  }

  try {
    await query(
      `INSERT INTO student_courses (student_id, course_id, total_sessions) 
       VALUES ($1, $2, COALESCE($3, 8)) 
       ON CONFLICT (student_id, course_id) 
       DO UPDATE SET total_sessions = COALESCE(EXCLUDED.total_sessions, student_courses.total_sessions)`,
      [id, courseId, totalSessions]
    );
    res.status(201).json({ success: true });
  } catch (err: any) {
    console.error('Error enrolling student:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/students/:id/courses/:courseId', async (req, res) => {
  const { id, courseId } = req.params;

  try {
    await query(
      `DELETE FROM student_courses 
       WHERE student_id = $1 AND course_id = $2`,
      [id, courseId]
    );
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error unenrolling student:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Courses
app.get('/api/courses', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, teacher, level, progress, status, room, time_slot AS "timeSlot", icon_name AS "iconName", description 
       FROM courses 
       ORDER BY id ASC`
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching courses:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/courses', async (req, res) => {
  const newCourse: Course = req.body;
  if (!newCourse.id) {
    newCourse.id = `c-${Date.now()}`;
  }
  try {
    const result = await query(
      `INSERT INTO courses (id, name, teacher, level, progress, status, room, time_slot, icon_name, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING id, name, teacher, level, progress, status, room, time_slot AS "timeSlot", icon_name AS "iconName", description`,
      [
        newCourse.id,
        newCourse.name,
        newCourse.teacher,
        newCourse.level,
        newCourse.progress || 0,
        newCourse.status || 'Activo',
        newCourse.room || '',
        newCourse.timeSlot || '',
        newCourse.iconName || 'book',
        newCourse.description || ''
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error inserting course:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/courses/name/:name', async (req, res) => {
  const { name } = req.params;
  const { room, timeSlot, teacher } = req.body;
  try {
    const result = await query(
      `UPDATE courses 
       SET room = COALESCE($1, room), 
           time_slot = COALESCE($2, time_slot),
           teacher = COALESCE($3, teacher)
       WHERE name = $4 
       RETURNING id, name, teacher, level, progress, status, room, time_slot AS "timeSlot", icon_name AS "iconName", description`,
      [room, timeSlot, teacher, name]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Curso no encontrado' });
    }
  } catch (err: any) {
    console.error('Error updating course by name:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  const { id } = req.params;
  const { name, teacher, level, progress, status, room, timeSlot, iconName, description, studentIds } = req.body;
  try {
    await query('BEGIN');
    const result = await query(
      `UPDATE courses 
       SET name = $1, teacher = $2, level = $3, progress = $4, status = $5, room = $6, time_slot = $7, icon_name = $8, description = $9 
       WHERE id = $10 
       RETURNING id, name, teacher, level, progress, status, room, time_slot AS "timeSlot", icon_name AS "iconName", description`,
      [name, teacher, level, progress || 0, status || 'Activo', room || '', timeSlot || '', iconName || 'book', description || '', id]
    );

    if (result.rows.length === 0) {
      await query('ROLLBACK');
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    const updatedCourse = result.rows[0];

    // Sync student enrollments if studentIds is passed
    if (Array.isArray(studentIds)) {
      await query(`DELETE FROM student_courses WHERE course_id = $1`, [id]);
      for (const studentId of studentIds) {
        await query(
          `INSERT INTO student_courses (student_id, course_id) VALUES ($1, $2)
           ON CONFLICT (student_id, course_id) DO NOTHING`,
          [studentId, id]
        );
      }
    }

    // Log recent activity
    const activityId = `act-${Date.now()}`;
    const activityRes = await query(
      `INSERT INTO recent_activities (id, username, user_initials, action, date_time, status, type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, username AS user, user_initials AS "userInitials", action, date_time AS "dateTime", status, type`,
      [
        activityId,
        'Administrador',
        'AD',
        `Modificación del curso: ${name}`,
        'Justo ahora',
        'Completado',
        'curso'
      ]
    );

    await query('COMMIT');
    res.json({ success: true, course: updatedCourse, activity: activityRes.rows[0] });
  } catch (err: any) {
    await query('ROLLBACK');
    console.error('Error updating course by id:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Check if there are active students enrolled in this course
    const checkRes = await query(
      `SELECT COUNT(*) AS count 
       FROM student_courses sc 
       JOIN students s ON sc.student_id = s.id 
       WHERE sc.course_id = $1 AND s.status = 'Activo'`,
      [id]
    );

    const activeCount = parseInt(checkRes.rows[0].count, 10);
    if (activeCount > 0) {
      return res.status(400).json({ error: 'No se puede eliminar el taller porque tiene alumnos activos asignados.' });
    }

    // Get the course name to delete the related schedule items
    const courseRes = await query(`SELECT name FROM courses WHERE id = $1`, [id]);
    if (courseRes.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    const courseName = courseRes.rows[0].name;

    // 2. Delete schedule items related to the course name
    await query(`DELETE FROM schedule_items WHERE title = $1`, [courseName]);

    // 3. Delete the course (Cascades to student_courses due to ON DELETE CASCADE)
    await query(`DELETE FROM courses WHERE id = $1`, [id]);

    // 4. Log the deletion activity
    const activityId = `act-${Date.now()}`;
    const activityRes = await query(
      `INSERT INTO recent_activities (id, username, user_initials, action, date_time, status, type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, username AS user, user_initials AS "userInitials", action, date_time AS "dateTime", status, type`,
      [
        activityId,
        'Administrador',
        'AD',
        `Eliminación del taller: ${courseName}`,
        'Justo ahora',
        'Completado',
        'curso'
      ]
    );

    res.json({ success: true, activity: activityRes.rows[0] });
  } catch (err: any) {
    console.error('Error deleting course:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Teachers
app.get('/api/teachers', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, title, specialty, email, phone, avatar, subjects, room, username, temp_password AS "tempPassword" 
       FROM teachers 
       ORDER BY id ASC`
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching teachers:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Schedule
app.get('/api/schedule', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, title, teacher, day_index AS "dayIndex", start_time AS "startTime", duration_hours AS "durationHours", room, has_conflict AS "hasConflict", conflict_details AS "conflictDetails", color_theme AS "colorTheme", week_start_date AS "weekStartDate" 
       FROM schedule_items 
       ORDER BY day_index ASC, start_time ASC`
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching schedule items:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/schedule', async (req, res) => {
  const newItem: ScheduleItem = req.body;
  if (!newItem.id) {
    newItem.id = `sch-${Date.now()}`;
  }
  
  try {
    const result = await query(
      `INSERT INTO schedule_items (id, title, teacher, day_index, start_time, duration_hours, room, has_conflict, conflict_details, color_theme, week_start_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING id, title, teacher, day_index AS "dayIndex", start_time AS "startTime", duration_hours AS "durationHours", room, has_conflict AS "hasConflict", conflict_details AS "conflictDetails", color_theme AS "colorTheme", week_start_date AS "weekStartDate"`,
      [
        newItem.id,
        newItem.title,
        newItem.teacher,
        newItem.dayIndex,
        newItem.startTime,
        newItem.durationHours,
        newItem.room,
        newItem.hasConflict || false,
        newItem.conflictDetails || null,
        newItem.colorTheme || 'navy',
        newItem.weekStartDate || '2026-08-17'
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error inserting schedule item:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/schedule/course/:title/teacher/:teacher/week/:weekStartDate', async (req, res) => {
  const { title, teacher, weekStartDate } = req.params;
  try {
    await query(
      `DELETE FROM schedule_items WHERE title = $1 AND teacher = $2 AND week_start_date = $3`,
      [title, teacher, weekStartDate]
    );
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting schedule items:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/schedule/:id/resolve', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query(
      `UPDATE schedule_items 
       SET has_conflict = FALSE, conflict_details = NULL, room = 'Aula 204 (Reasignada)', color_theme = 'navy' 
       WHERE id = $1 
       RETURNING id, title, teacher, day_index AS "dayIndex", start_time AS "startTime", duration_hours AS "durationHours", room, has_conflict AS "hasConflict", conflict_details AS "conflictDetails", color_theme AS "colorTheme", week_start_date AS "weekStartDate"`,
      [id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Horario no encontrado' });
    }
  } catch (err: any) {
    console.error('Error resolving schedule conflict:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Activities
app.get('/api/activities', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, username AS user, user_initials AS "userInitials", action, date_time AS "dateTime", status, type 
       FROM recent_activities 
       ORDER BY id DESC`
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching activities:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/activities', async (req, res) => {
  const newActivity: RecentActivityItem = req.body;
  if (!newActivity.id) {
    newActivity.id = `act-${Date.now()}`;
  }
  
  try {
    const result = await query(
      `INSERT INTO recent_activities (id, username, user_initials, action, date_time, status, type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, username AS user, user_initials AS "userInitials", action, date_time AS "dateTime", status, type`,
      [
        newActivity.id,
        newActivity.user,
        newActivity.userInitials,
        newActivity.action,
        newActivity.dateTime,
        newActivity.status,
        newActivity.type
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error inserting activity:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// WhatsApp Template Settings
app.get('/api/whatsapp/template', async (req, res) => {
  try {
    const result = await query(
      `SELECT message_text AS "messageText" 
       FROM whatsapp_template 
       ORDER BY id DESC 
       LIMIT 1`
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json({ messageText: '' });
    }
  } catch (err: any) {
    console.error('Error fetching whatsapp template:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/whatsapp/template', async (req, res) => {
  const { messageText } = req.body;
  if (messageText === undefined) {
    return res.status(400).json({ error: 'messageText es requerido' });
  }

  try {
    const result = await query(
      `INSERT INTO whatsapp_template (message_text) 
       VALUES ($1) 
       RETURNING message_text AS "messageText"`,
      [messageText]
    );
    res.json({ success: true, messageText: result.rows[0].messageText });
  } catch (err: any) {
    console.error('Error updating whatsapp template:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/attendance/course/:courseId', async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await query(
      `SELECT student_id AS "studentId", class_date AS "classDate", attended 
       FROM attendance 
       WHERE course_id = $1`,
      [courseId]
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching course attendance:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Attendance APIs
app.get('/api/attendance/course/:courseId/date/:classDate', async (req, res) => {
  const { courseId, classDate } = req.params;

  try {
    const result = await query(
      `SELECT student_id AS "studentId", attended 
       FROM attendance 
       WHERE course_id = $1 AND class_date = $2`,
      [courseId, classDate]
    );
    // Convert array of rows to a dictionary { studentId: boolean }
    const records: { [studentId: string]: boolean } = {};
    result.rows.forEach(row => {
      records[row.studentId] = row.attended;
    });
    res.json(records);
  } catch (err: any) {
    console.error('Error fetching attendance:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/attendance', async (req, res) => {
  const { courseId, classDate, records } = req.body;
  if (!courseId || !classDate || !records) {
    return res.status(400).json({ error: 'courseId, classDate y records son requeridos' });
  }

  try {
    await query('BEGIN');

    for (const [studentId, attended] of Object.entries(records)) {
      // Upsert attendance record
      await query(
        `INSERT INTO attendance (student_id, course_id, class_date, attended)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (student_id, course_id, class_date)
         DO UPDATE SET attended = EXCLUDED.attended`,
        [studentId, courseId, classDate, attended]
      );

      // Update completed sessions count
      await query(
        `UPDATE student_courses
         SET completed_sessions = (
           SELECT COUNT(*) FROM attendance
           WHERE student_id = $1 AND course_id = $2 AND attended = TRUE
         )
         WHERE student_id = $1 AND course_id = $2`,
        [studentId, courseId]
      );
    }

    await query('COMMIT');
    res.json({ success: true });
  } catch (err: any) {
    await query('ROLLBACK');
    console.error('Error saving attendance:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/attendance/absences', async (req, res) => {
  try {
    const result = await query(
      `SELECT a.id, a.student_id AS "studentId", a.course_id AS "courseId", a.class_date AS "classDate", a.attended,
              s.name AS "studentName", s.folio AS "studentFolio",
              c.name AS "courseName", c.teacher AS "courseTeacher"
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       JOIN courses c ON a.course_id = c.id
       WHERE a.attended = FALSE
       ORDER BY a.class_date DESC, s.name ASC`
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching absences:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`[Backend] Servidor corriendo en puerto ${PORT}`);
});
