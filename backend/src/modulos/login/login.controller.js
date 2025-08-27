import {
    getUserByEmailDB,
    updateLastAccessDB,
    getPermissionsByRole,
    validateUserCredentialsDB
} from "./login.model.js";

import { generarToken } from "../helpers/admTokens.js";

export const loginUsuario = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Validar credenciales con contraseña encriptada
        const resultado = await validateUserCredentialsDB(email, password);
        
        if (resultado.estado === "error") {
            const statusCode = resultado.mensaje.includes("inactivo") ? 403 : 401;
            return res.status(statusCode).json({
                estado: 'error',
                mensaje: resultado.mensaje
            });
        }
        
        const usuario = resultado.data; // Sin await, ya es un objeto
        
        // Verificar que el usuario existe
        if (!usuario) {
            return res.status(401).json({
                estado: 'error',
                mensaje: 'Usuario no encontrado'
            });
        }
        
        // Definir rutas de redirección según el rol
        const rutasPorRol = {
            'administrador': '/administrador.html',
            'general': '/general.html',
            'policia': '/policia.html',
            'secretaria': '/secretaria.html'
        };
        const rutaRedireccion = rutasPorRol[usuario.rol_nombre] || '/dashboard/default';
        
        // Actualizar último acceso
        await updateLastAccessDB(usuario.id_usuario);
        
        // Generar token
        const token = generarToken(usuario, process.env.TOKEN_LIVE);
        
        res.status(200).json({
            estado: 'ok',
            mensaje: 'Login exitoso',
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol_nombre,
                id_rol: usuario.id_rol
            },
            redireccion: rutaRedireccion,
            permisos: getPermissionsByRole(usuario.rol_nombre),
            token: token
        });
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            estado: 'error', 
            mensaje: error.code + "=>" + error.message + "=>" + "Error interno del servidor"
        });
    }
};
