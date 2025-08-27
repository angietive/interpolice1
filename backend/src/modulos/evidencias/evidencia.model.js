import dnconn from "../../config/dbConexion.js";

export async function getEvidenciasDB() {
    let [resultado] = await dnconn.query(`
        SELECT e.*, d.descripcion as delito_descripcion 
        FROM evidencias e 
        JOIN delitos d ON e.id_delito = d.id_delito
    `);
    return {
      estado: "ok",
      data: resultado,
    };
}

export async function getEvidenciaByIdDB(id_evidencia) {
    let [resultado] = await dnconn.query(`
        SELECT e.*, d.descripcion as delito_descripcion 
        FROM evidencias e 
        JOIN delitos d ON e.id_delito = d.id_delito
        WHERE e.id_evidencia = ?
    `, [id_evidencia]);
    return {
      estado: resultado.length ? "ok" : "error",
      data: resultado[0] || null,
    };
}

export async function getEvidenciasByDelitoDB(id_delito) {
    let [resultado] = await dnconn.query("SELECT * FROM evidencias WHERE id_delito = ?", [id_delito]);
    return {
      estado: "ok",
      data: resultado,
    };
}

export async function createEvidenciaDB(data) {
    let [resultado] = await dnconn.query(
        `INSERT INTO evidencias (
            id_delito, descripcion, tipo, fecha
        ) VALUES (?, ?, ?, ?)` ,
        [
            data.id_delito,
            data.descripcion,
            data.tipo,
            data.fecha
        ]
    );
    return {
      estado: "ok",
      insertId: resultado.insertId,
    };
}

export async function updateEvidenciaDB(id_evidencia, data) {
    let [resultado] = await dnconn.query(
        `UPDATE evidencias SET 
            id_delito = ?,
            descripcion = ?,
            tipo = ?,
            fecha = ?
        WHERE id_evidencia = ?`,
        [
            data.id_delito,
            data.descripcion,
            data.tipo,
            data.fecha,
            id_evidencia
        ]
    );
    return {
      estado: resultado.affectedRows ? "ok" : "error",
    };
}

export async function deleteEvidenciaDB(id_evidencia) {
    let [resultado] = await dnconn.query(
        "DELETE FROM evidencias WHERE id_evidencia = ?",
        [id_evidencia]
    );
    return {
      estado: resultado.affectedRows ? "ok" : "error",
    };
}