import dnconn from "../../config/dbConexion.js";
import { generateCiudadanoQR, deleteQRFile } from "../helpers/qrGenerator.js";

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
    
    // Generar código QR automáticamente después de insertar
    try {
        const ciudadanoData = {
            id_ciudadano: resultado.insertId,
            nombre: data.nombre,
            apellido: data.apellido,
            fecha_nacimiento: data.fecha_nacimiento
        };
        
        const qrFileName = await generateCiudadanoQR(ciudadanoData);
        
        // Actualizar el registro con el nombre del archivo QR
        await dnconn.query(
            `UPDATE ciudadanos SET codigo_universal = ? WHERE id_ciudadano = ?`,
            [qrFileName, resultado.insertId]
        );
        
        return {
            estado: "ok",
            insertId: resultado.insertId,
            qr_generado: qrFileName,
        };
    } catch (qrError) {
        console.error('Error al generar QR:', qrError);
        // Si falla la generación del QR, aún devolvemos el resultado de la inserción
        return {
            estado: "ok",
            insertId: resultado.insertId,
            qr_error: "No se pudo generar el código QR"
        };
    }
}

export async function updateCiudadanoDB(codigo_universal, data) {
    // Primero obtenemos los datos actuales del ciudadano para obtener el ID y el QR anterior
    let [ciudadanoActual] = await dnconn.query(
        "SELECT id_ciudadano, codigo_universal FROM ciudadanos WHERE codigo_universal = ?",
        [codigo_universal]
    );
    
    if (ciudadanoActual.length === 0) {
        return {
            estado: "error",
            mensaje: "Ciudadano no encontrado"
        };
    }
    
    const ciudadanoData = ciudadanoActual[0];
    const qrAnterior = ciudadanoData.codigo_universal;
    
    // Actualizar los datos del ciudadano
    let [resultado] = await dnconn.query(
        `UPDATE ciudadanos SET 
            nombre = ?,
            apellido = ?,
            apodo = ?,
            fecha_nacimiento = ?,
            planeta_origen = ?,
            planeta_residencia = ?,
            foto = ?,
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
            data.estado || 1,
            codigo_universal
        ]
    );
    
    if (resultado.affectedRows === 0) {
        return {
            estado: "error",
            mensaje: "No se pudo actualizar el ciudadano"
        };
    }
    
    // Generar nuevo código QR si se actualizaron datos relevantes
    try {
        const nuevosDatosCiudadano = {
            id_ciudadano: ciudadanoData.id_ciudadano,
            nombre: data.nombre,
            apellido: data.apellido,
            fecha_nacimiento: data.fecha_nacimiento
        };
        
        const nuevoQrFileName = await generateCiudadanoQR(nuevosDatosCiudadano);
        
        // Actualizar el campo codigo_universal con el nuevo archivo QR
        await dnconn.query(
            `UPDATE ciudadanos SET codigo_universal = ? WHERE id_ciudadano = ?`,
            [nuevoQrFileName, ciudadanoData.id_ciudadano]
        );
        
        // Eliminar el archivo QR anterior si existe
        if (qrAnterior && qrAnterior.endsWith('.png')) {
            deleteQRFile(qrAnterior);
        }
        
        return {
            estado: "ok",
            qr_actualizado: nuevoQrFileName
        };
    } catch (qrError) {
        console.error('Error al generar nuevo QR:', qrError);
        return {
            estado: "ok",
            qr_error: "Datos actualizados pero no se pudo generar el nuevo código QR"
        };
    }
}

export async function deleteCiudadanoDB(codigo_universal) {
    // Primero obtenemos el archivo QR antes de eliminar el registro
    let [ciudadano] = await dnconn.query(
        "SELECT codigo_universal FROM ciudadanos WHERE codigo_universal = ?",
        [codigo_universal]
    );
    
    if (ciudadano.length === 0) {
        return {
            estado: "error",
            mensaje: "Ciudadano no encontrado"
        };
    }
    
    const qrFileName = ciudadano[0].codigo_universal;
    
    // Eliminar el registro de la base de datos
    let [resultado] = await dnconn.query(
        "DELETE FROM ciudadanos WHERE codigo_universal = ?",
        [codigo_universal]
    );
    
    if (resultado.affectedRows === 0) {
        return {
            estado: "error",
            mensaje: "No se pudo eliminar el ciudadano"
        };
    }
    
    // Eliminar el archivo QR asociado si existe
    if (qrFileName && qrFileName.endsWith('.png')) {
        const qrEliminado = deleteQRFile(qrFileName);
        return {
            estado: "ok",
            qr_eliminado: qrEliminado
        };
    }
    
    return {
        estado: "ok"
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