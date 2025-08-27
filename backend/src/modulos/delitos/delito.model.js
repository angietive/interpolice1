import db from '../../config/dbConexion.js';

export async function getDelitosDB() {
  const [resultado] = await db.query(`
    SELECT d.id_delito, d.descripcion, DATE_FORMAT(d.fecha, '%Y-%m-%d') AS fecha, d.lugar, d.registrado_por, 
    u.nombre AS nombre_usuario
    FROM delitos d
    JOIN usuarios u ON d.registrado_por = u.id_usuario
  `);
  return {
    estado: 'ok',
    data: resultado,
  };
}

export async function getDelitoByIdDB(id) {
  const [resultado] = await db.query(`
    SELECT d.id_delito, d.descripcion, DATE_FORMAT(d.fecha, '%Y-%m-%d') AS fecha, d.lugar, d.registrado_por, 
    u.nombre AS nombre_usuario
    FROM delitos d
    JOIN usuarios u ON d.registrado_por = u.id_usuario
    WHERE d.id_delito = ?
  `, [id]);
  return {
    estado: resultado.length ? 'ok' : 'error',
    data: resultado[0] || null,
  };
}

export async function createDelitoDB(data) {
  const [resultado] = await db.query(
    `INSERT INTO delitos (
      descripcion, fecha, lugar, registrado_por
    ) VALUES (?, ?, ?, ?)` ,
    [
      data.descripcion,
      data.fecha,
      data.lugar,
      data.registrado_por
    ]
  );
  return {
    estado: 'ok',
    id: resultado.insertId,
  };
}

export async function updateDelitoDB(id, data) {
  const [resultado] = await db.query('UPDATE delitos SET ? WHERE id_delito = ?', [data, id]);
  return {
    estado: 'ok',
    data: resultado,
  };
}

export async function deleteDelitoDB(id) {
  const [resultado] = await db.query('DELETE FROM delitos WHERE id_delito = ?', [id]);
  return {
    estado: 'ok',
    data: resultado,
  };
}
