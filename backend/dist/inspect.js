import pg from 'pg';
import dotenv from 'dotenv';
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
        await client.connect();
        console.log('CONNECTED TO DB');
        // Inspect students table columns
        const res = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'students';
    `);
        console.log('STUDENTS TABLE SCHEMAS:');
        console.log(res.rows);
        // Inspect courses table columns
        const resCourses = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'courses';
    `);
        console.log('COURSES TABLE SCHEMAS:');
        console.log(resCourses.rows);
    }
    catch (err) {
        console.error('ERROR during inspection:', err.message);
    }
    finally {
        await client.end();
    }
}
inspect();
