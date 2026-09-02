import pg from 'pg';
import dotenv from 'dotenv';
import { query } from './db.js';

dotenv.config();

const { Client } = pg;

async function inspect() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD === undefined ? '' : process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_DATABASE || 'impulso_academico',
  });

  try {
    const resTeachers = await query(`SELECT id, name, username, room FROM teachers`);
    console.log('TEACHERS:', resTeachers.rows);

    const resCourses = await query(`SELECT id, name, teacher, room, time_slot FROM courses`);
    console.log('COURSES:', resCourses.rows);

    const resSchedule = await query(`SELECT id, title, teacher, room, start_time FROM schedule_items`);
    console.log('SCHEDULE:', resSchedule.rows);
  } catch (err: any) {
    console.error('ERROR during inspection:', err.message);
  }
}

inspect();
