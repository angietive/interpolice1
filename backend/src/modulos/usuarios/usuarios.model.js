import dnconn from "../../config/dbConexion.js";
import bcrypt from "bcrypt";

export async function getAllUsuariosDB() {
    let [resultado] = await dnconn.query(`
        SELECT u.*, r.nombre as rol_nombre 
        FROM usuarios u 
        JOIN roles r ON u.id_rol = r.id_rol
    `);
    return {
      estado: "ok",
      data: resultado,
    };
}

export async function getUsuarioByIdDB(id_usuario) {
    let [resultado] = await dnconn.query(`
        SELECT u.*, r.nombre as rol_nombre 
        FROM usuarios u 
        JOIN roles r ON u.id_rol = r.id_rol 
        WHERE u.id_usuario = ?
    `, [id_usuario]);
    return {
      estado: resultado.length ? "ok" : "error",
      data: resultado[0] || null,
    };
}

export async function createUsuarioDB(data) {
    try {
        // Validaciones básicas
        if (!data.nombre || !data.email || !data.password_hash || !data.id_rol) {
            return {
                estado: "error",
                mensaje: "Faltan campos obligatorios: nombre, email, password_hash, id_rol"
            };
        }
        
        // Verificar si el email ya existe
        const [existingUser] = await dnconn.query(
            "SELECT id_usuario FROM usuarios WHERE email = ?",
            [data.email]
        );
        
        if (existingUser.length > 0) {
            return {
                estado: "error",
                mensaje: "Ya existe un usuario con ese email"
            };
        }
        
        // Encriptar la contraseña antes de guardarla
        const saltRounds = 12; // Número de rondas para el salt (mayor = más seguro pero más lento)
        const hashedPassword = await bcrypt.hash(data.password_hash, saltRounds);
        
        let [resultado] = await dnconn.query(
                    `INSERT INTO usuarios (
                nombre, email, password_hash, id_rol, activo, ultimo_acceso, fecha_creacion, fecha_actualizacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.nombre,
                data.email,
                hashedPassword, // Usar la contraseña encriptada
                data.id_rol,
                data.activo || 1,
                data.ultimo_acceso,
                data.fecha_creacion || new Date(),
                data.fecha_actualizacion || new Date()
            ]
        );
        return {
          estado: "ok",
          insertId: resultado.insertId,
          mensaje: "Usuario creado exitosamente"
        };
    } catch (error) {
        console.error('Error en createUsuarioDB:', error);
        return {
            estado: "error",
            mensaje: "Error al encriptar contraseña o crear usuario: " + error.message
        };
    }
}

export async function updateUsuarioDB(id_usuario, data) {
    try {
        let hashedPassword = data.password_hash;
        
        // Si se está actualizando la contraseña, encriptarla
        if (data.password_hash && data.password_hash.length < 60) { // bcrypt genera hashes de ~60 caracteres
            const saltRounds = 12;
            hashedPassword = await bcrypt.hash(data.password_hash, saltRounds);
        }
        
        let [resultado] = await dnconn.query(
            `UPDATE usuarios SET 
                nombre = ?,
                email = ?,
                password_hash = ?,
                id_rol = ?,
                activo = ?,
                fecha_actualizacion = ?,
                ultimo_acceso = ?
            WHERE id_usuario = ?`,
            [
                data.nombre,
                data.email,
                hashedPassword,
                data.id_rol,
                data.activo,
                data.fecha_actualizacion || new Date(),
                data.ultimo_acceso,
                id_usuario
            ]
        );
        return {
          estado: resultado.affectedRows ? "ok" : "error",
        };
    } catch (error) {
        return {
            estado: "error",
            mensaje: "Error al actualizar usuario: " + error.message
        };
    }
}

export async function deleteUsuarioDB(id_usuario) {
    let [resultado] = await dnconn.query(
        "DELETE FROM usuarios WHERE id_usuario = ?",
        [id_usuario]
    );
    return {
      estado: resultado.affectedRows ? "ok" : "error",
    };
}

// Función para verificar contraseñas hasheadas
export async function verifyPassword(plainPassword, hashedPassword) {
    try {
        const isValid = await bcrypt.compare(plainPassword, hashedPassword);
        return {
            estado: "ok",
            esValida: isValid
        };
    } catch (error) {
        return {
            estado: "error",
            mensaje: "Error al verificar contraseña: " + error.message,
            esValida: false
        };
    }
}
