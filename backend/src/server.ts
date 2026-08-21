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

// API Routes

// Students
app.get('/api/students', async (req, res) => {
  try {
    const result = await query(
      `SELECT s.id, s.name, s.email, s.phone, s.folio, s.level, s.status, s.username, s.temp_password AS "tempPassword", s.registered_at AS "registeredAt", s.avatar,
              COALESCE((SELECT json_agg(sc.course_id) FROM student_courses sc WHERE sc.student_id = s.id), '[]'::json) AS "courseIds"
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
                 COALESCE((SELECT json_agg(sc.course_id) FROM student_courses sc WHERE sc.student_id = students.id), '[]'::json) AS "courseIds"`,
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
                 COALESCE((SELECT json_agg(sc.course_id) FROM student_courses sc WHERE sc.student_id = students.id), '[]'::json) AS "courseIds"`,
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

app.post('/api/students/:id/courses', async (req, res) => {
  const { id } = req.params;
  const { courseId } = req.body;
  if (!courseId) {
    return res.status(400).json({ error: 'courseId es requerido' });
  }

  try {
    await query(
      `INSERT INTO student_courses (student_id, course_id) 
       VALUES ($1, $2) 
       ON CONFLICT (student_id, course_id) DO NOTHING`,
      [id, courseId]
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

app.listen(PORT, () => {
  console.log(`[Backend] Servidor corriendo en puerto ${PORT}`);
});
