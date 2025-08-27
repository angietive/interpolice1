import dnconn from "../../config/dbConexion.js";

export async function getCiudadanoDB() {
    let [resultado] = await dnconn.query(`
        SELECT c.*, 
               po.nombre as planeta_origen_nombre,
               pr.nombre as planeta_residencia_nombre
        FROM ciudadanos c
        LEFT JOIN planetas po ON c.planeta_origen = po.id_planeta
        LEFT JOIN planetas pr ON c.planeta_residencia = pr.id_planeta
    `);
    return {
      estado: "ok",
      data: resultado,
    };
}

export async function getCiudadanoByCodigo_universalDB(codigo_universal) {
    let [resultado] = await dnconn.query(`
        SELECT c.*, 
               po.nombre as planeta_origen_nombre,
               pr.nombre as planeta_residencia_nombre
        FROM ciudadanos c
        LEFT JOIN planetas po ON c.planeta_origen = po.id_planeta
        LEFT JOIN planetas pr ON c.planeta_residencia = pr.id_planeta
        WHERE c.codigo_universal = ?
    `, [codigo_universal]);
    return {
      estado: resultado.length ? "ok" : "error",
      data: resultado[0] || null,
    };
}

export async function createCiudadanoDB(data) {
    let [resultado] = await dnconn.query(
        `INSERT INTO ciudadanos (
            nombre, apellido, apodo, fecha_nacimiento, planeta_origen, planeta_residencia, foto, codigo_universal, estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
        [
            data.nombre,
            data.apellido,
            data.apodo || null,
            data.fecha_nacimiento,
            data.planeta_origen || null,
            data.planeta_residencia || null,
            data.foto || null,
            data.codigo_universal,
            data.estado || 1
        ]
    );
    return {
      estado: "ok",
      insertId: resultado.insertId,
    };
}

export async function updateCiudadanoDB(codigo_universal, data) {
    let [resultado] = await dnconn.query(
        `UPDATE ciudadanos SET 
            nombre = ?,
            apellido = ?,
            apodo = ?,
            fecha_nacimiento = ?,
            planeta_origen = ?,
            planeta_residencia = ?,
            foto = ?,
            codigo_universal = ?,
            estado = ?
        WHERE codigo_universal = ?`,
        [
            data.nombre,
            data.apellido,
            data.apodo || null,
            data.fecha_nacimiento,
            data.planeta_origen || null,
            data.planeta_residencia || null,
            data.foto || null,
            data.codigo_universal,
            data.estado || 1,
            codigo_universal
        ]
    );
    return {
      estado: resultado.affectedRows ? "ok" : "error",
    };
}

export async function deleteCiudadanoDB(codigo_universal) {
    let [resultado] = await dnconn.query(
        "DELETE FROM ciudadanos WHERE codigo_universal = ?",
        [codigo_universal]
    );
    return {
      estado: resultado.affectedRows ? "ok" : "error",
    };
}

// Función para obtener todos los planetas disponibles
export async function getPlanetasDB() {
    let [resultado] = await dnconn.query("SELECT * FROM planetas ORDER BY nombre");
    return {
      estado: "ok",
      data: resultado,
    };
}

export async function updateImagenDb(data, codigo_universal){
    const [resultado] = await dnconn.query(
        "UPDATE ciudadanos SET foto = ? WHERE codigo_universal = ?",
        [data, codigo_universal]
    );
    return resultado;
}