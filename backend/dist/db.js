import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;
const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
    })
    : new Pool({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD === undefined ? '' : process.env.DB_PASSWORD,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_DATABASE || 'impulso_academico',
    });
console.log("[DB] process.env.DATABASE_URL:", process.env.DATABASE_URL);
console.log("[DB] process.env.DB_HOST:", process.env.DB_HOST);
console.log("[DB] Using connectionString:", pool.options.connectionString ? "Yes (DATABASE_URL)" : "No (fallback options)");
export const query = (text, params) => {
    return pool.query(text, params);
};
export default pool;
