import dnconn from "../../config/dbConexion.js";
import { verifyPassword } from "../usuarios/usuarios.model.js";

export async function getUserByEmailDB(email) {
    let [resultado] = await dnconn.query(`
        SELECT u.*, r.nombre as rol_nombre 
        FROM usuarios u 
        JOIN roles r ON u.id_rol = r.id_rol 
        WHERE u.email = ?
    `, [email]);
    return {
        estado: resultado.length ? "ok" : "error",
        data: resultado[0] || null,
    };
}

export async function updateLastAccessDB(id_usuario) {
    let [resultado] = await dnconn.query(
        "UPDATE usuarios SET ultimo_acceso = NOW() WHERE id_usuario = ?",
        [id_usuario]
    );
    return {
        estado: resultado.affectedRows ? "ok" : "error",
    };
}

// Función para validar credenciales con contraseña encriptada
export async function validateUserCredentialsDB(email, password) {
    try {
        
        // Obtener usuario con su rol
        const usuarioResult = await getUserByEmailDB(email);
        console.log('Resultado getUserByEmailDB:', usuarioResult);
        
        if (usuarioResult.estado === "error" || !usuarioResult.data) {
            console.log('Usuario no encontrado o error en consulta');
            return {
                estado: "error",
                mensaje: "Usuario no encontrado",
                data: null
            };
        }
        
        const usuario = usuarioResult.data;
        console.log('Usuario encontrado:', usuario);
        
        // Verificar si el usuario está activo
        if (usuario.activo !== 1) {
            console.log('Usuario inactivo, activo value:', usuario.activo);
            return {
                estado: "error", 
                mensaje: "Usuario inactivo, contacte al administrador",
                data: null
            };
        }
        
        console.log('Usuario activo, verificando contraseña...');
        
        // Verificar contraseña hasheada
        const passwordResult = await verifyPassword(password, usuario.password_hash);
        console.log('Resultado verificación contraseña:', passwordResult);
        
        if (passwordResult.estado === "error" || !passwordResult.esValida) {
            console.log('Contraseña incorrecta');
            return {
                estado: "error",
                mensaje: "Contraseña incorrecta",
                data: null
            };
        }
        
        console.log('Credenciales válidas, retornando usuario:', usuario);
        console.log('=== FIN DEBUG validateUserCredentialsDB ===');
        
        return {
            estado: "ok",
            mensaje: "Credenciales válidas",
            data: usuario
        };
        
    } catch (error) {
        console.error('Error en validateUserCredentialsDB:', error);
        return {
            estado: "error",
            mensaje: "Error al validar credenciales: " + error.message,
            data: null
        };
    }
}

// Función para obtener permisos por rol (simplificado)
export function getPermissionsByRole(rol) {
    // Sistema simple de permisos basado en roles
    const permisosPorRol = {
        'administrador': [
            'crear_usuarios',
            'editar_usuarios', 
            'eliminar_usuarios',
            'crear_ciudadanos',
            'editar_ciudadanos',
            'eliminar_ciudadanos',
            'crear_delitos',
            'editar_delitos',
            'eliminar_delitos',
            'ver_reportes',
            'crear_reportes',
            'administrar_sistema'
        ],
        'policia': [
            'crear_delitos',
            'editar_delitos',
            'ver_delitos',
            'crear_ciudadanos',
            'editar_ciudadanos',
            'ver_ciudadanos',
            'consultar_antecedentes'
        ],
        'secretaria': [
            'ver_delitos',
            'ver_ciudadanos',
            'crear_reportes',
            'ver_reportes',
            'consultar_antecedentes'
        ],
        'general': [
            'ver_delitos',
            'ver_ciudadanos',
            'consultar_antecedentes'
        ]
    };
    
    return permisosPorRol[rol] || [];
}