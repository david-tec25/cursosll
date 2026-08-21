import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
  console.log('[init-db] Iniciando creación de base de datos PostgreSQL local...');

  const pgUser = process.env.DB_USER || 'postgres';
  const pgPassword = process.env.DB_PASSWORD === undefined ? '' : process.env.DB_PASSWORD;
  const pgHost = process.env.DB_HOST || 'localhost';
  const pgPort = parseInt(process.env.DB_PORT || '5432');
  const pgDatabase = process.env.DB_DATABASE || 'impulso_academico';

  // 1. Connect to default 'postgres' database to check/create the target database
  const clientPostgres = new Client({
    user: pgUser,
    password: pgPassword,
    host: pgHost,
    port: pgPort,
    database: 'postgres',
  });

  try {
    await clientPostgres.connect();
    console.log('[init-db] Conectado exitosamente al servidor PostgreSQL.');
  } catch (err: any) {
    console.error('[init-db] ERROR: No se pudo conectar al servidor PostgreSQL.');
    console.error(`Detalle del error: ${err.message}`);
    console.error('\nPor favor verifica si:');
    console.error('1. El servicio de PostgreSQL local está corriendo.');
    console.error('2. La contraseña en backend/.env es la correcta.');
    process.exit(1);
  }

  try {
    // Check if target database exists
    const res = await clientPostgres.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [pgDatabase]);
    if (res.rowCount === 0) {
      console.log(`[init-db] La base de datos "${pgDatabase}" no existe. Creándola...`);
      await clientPostgres.query(`CREATE DATABASE "${pgDatabase}"`);
      console.log(`[init-db] Base de datos "${pgDatabase}" creada con éxito.`);
    } else {
      console.log(`[init-db] La base de datos "${pgDatabase}" ya existe.`);
    }
  } catch (err: any) {
    console.error('[init-db] Error al verificar/crear la base de datos:', err.message);
    await clientPostgres.end();
    process.exit(1);
  } finally {
    await clientPostgres.end();
  }

  // 2. Connect to the target database to run schema.sql
  const clientTarget = new Client({
    user: pgUser,
    password: pgPassword,
    host: pgHost,
    port: pgPort,
    database: pgDatabase,
  });

  try {
    await clientTarget.connect();
    console.log(`[init-db] Conectado a la base de datos "${pgDatabase}".`);

    const schemaPath = path.resolve(__dirname, '../schema.sql');
    console.log(`[init-db] Leyendo archivo SQL en: ${schemaPath}`);
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('[init-db] Ejecutando comandos SQL del esquema...');
    await clientTarget.query(sql);

    console.log('[init-db] ¡Base de datos inicializada y poblada con éxito!');
  } catch (err: any) {
    console.error('[init-db] ERROR al aplicar el esquema SQL:', err.message);
    process.exit(1);
  } finally {
    await clientTarget.end();
  }
}

initDb();
