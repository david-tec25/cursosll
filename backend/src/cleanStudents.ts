import { query } from './db.js';

async function cleanStudents() {
  console.log('[Clean] Deleting mock students from live database...');
  try {
    const studentNames = [
      'Ana García López',
      'Carlos Mendoza',
      'María Fernanda Ruíz',
      'Luis Torres',
      'Juan López',
    ];
    const studentIds = ['st-1', 'st-2', 'st-3', 'st-4', 'st-5'];
    const usernames = [
      'ana.garcial.ms',
      'carlos.m.ns',
      'm.fernanda.b',
      'luis.torres.ms',
      'juan.lopez.b',
      'Ana García',
      'Carlos Mendoza',
      'María Fernanda Ruíz',
      'Luis Torres',
      'Juan López',
    ];

    // Delete student courses
    await query(`DELETE FROM student_courses WHERE student_id = ANY($1)`, [studentIds]);

    // Delete attendance records
    await query(`DELETE FROM attendance WHERE student_id = ANY($1)`, [studentIds]);

    // Delete students
    const res = await query(
      `DELETE FROM students WHERE id = ANY($1) OR name = ANY($2) OR username = ANY($3) RETURNING id, name`,
      [studentIds, studentNames, usernames]
    );
    console.log(`[Clean] Deleted ${res.rowCount} student(s) from 'students' table:`, res.rows);

    // Delete recent activities related to these students
    const resAct = await query(
      `DELETE FROM recent_activities WHERE username = ANY($1) RETURNING id, username, action`,
      [usernames]
    );
    console.log(`[Clean] Deleted ${resAct.rowCount} activity record(s):`, resAct.rows);

    console.log('[Clean] Successfully cleaned mock students from database!');
    process.exit(0);
  } catch (err: any) {
    console.error('[Clean] Error deleting students from database:', err.message);
    process.exit(1);
  }
}

cleanStudents();
