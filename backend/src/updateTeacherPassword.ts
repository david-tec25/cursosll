import { query } from './db.js';

async function updatePassword() {
  console.log('[Script] Actualizando contraseñas de docentes en la base de datos...');
  try {
    const res1 = await query(`
      UPDATE teachers 
      SET temp_password = 'lisi26*' 
      WHERE username = 'liliana.silvestre'
      RETURNING id, name, username, temp_password;
    `);
    console.log('[Script] Liliana Silvestre:', res1.rows[0]);

    const res2 = await query(`
      UPDATE teachers 
      SET temp_password = 'lima26*pa' 
      WHERE username = 'liliana.martinez'
      RETURNING id, name, username, temp_password;
    `);
    console.log('[Script] Liliana Martínez:', res2.rows[0]);
    
    console.log('[Script] ¡Contraseñas actualizadas con éxito!');
    process.exit(0);
  } catch (err: any) {
    console.error('[Script] Error al actualizar contraseñas:', err.message);
    process.exit(1);
  }
}

updatePassword();
