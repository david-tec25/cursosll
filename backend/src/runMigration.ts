import { query } from './db.js';

async function migrate() {
  console.log('[Migration] Starting database migration...');
  try {
    // 1. Add total_sessions column
    console.log('[Migration] Adding column total_sessions to student_courses if not exists...');
    await query(`
      ALTER TABLE student_courses 
      ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 8;
    `);

    // 2. Add completed_sessions column
    console.log('[Migration] Adding column completed_sessions to student_courses if not exists...');
    await query(`
      ALTER TABLE student_courses 
      ADD COLUMN IF NOT EXISTS completed_sessions INTEGER DEFAULT 0;
    `);

    // 3. Create attendance table
    console.log('[Migration] Creating attendance table if not exists...');
    await query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
        course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
        class_date VARCHAR(20) NOT NULL,
        attended BOOLEAN NOT NULL,
        UNIQUE(student_id, course_id, class_date)
      );
    `);

    console.log('[Migration] Migration completed successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error('[Migration] Error running migration:', err.message);
    process.exit(1);
  }
}

migrate();
