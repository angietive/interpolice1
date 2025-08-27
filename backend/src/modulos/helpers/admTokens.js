/*libreria para generar tjen*/ 
import jwt from 'jsonwebtoken';

export const generarToken = (payload, vidaUtil) => {
    console.log('=== GENERANDO TOKEN ===');
    console.log('Payload recibido:', payload);
    console.log('Vida útil recibida:', vidaUtil);
    console.log('SALT disponible:', process.env.SALT ? 'Sí' : 'No');
    
    const options = { expiresIn: vidaUtil };
    console.log('Opciones para JWT:', options);
    
    const token = jwt.sign(payload, process.env.SALT, options);
    console.log('Token generado exitosamente:', token ? 'Sí' : 'No');
    console.log('Longitud del token:', token ? token.length : 0);
    console.log('=== FIN GENERACIÓN TOKEN ===');
    
    return token;
};

/*verificar token*/
export const authMiddleware = (req, res, next) => {
    try {
        console.log('=== DEBUG authMiddleware ===');
        
        // Obtener token del header Authorization
        const token = req.headers.authorization;
        console.log('Token recibido:', token);
       
        // Validar que el token no esté vacío
        if (!token) {
            console.log('Token vacío');
            return res.status(401).json({
                estado: 'error',
                mensaje: 'Token de acceso requerido.'
            });
        }

        // Extraer el token si viene con "Bearer "
        let cleanToken = token;
        if (token.startsWith('Bearer ')) {
            cleanToken = token.substring(7);
        }
        
        console.log('Token limpio para verificar:', cleanToken);
        
        // Verificar que SALT esté disponible
        if (!process.env.SALT) {
            console.error('SALT no disponible');
            return res.status(500).json({
                estado: 'error',
                mensaje: 'Error de configuración del servidor.'
            });
        }
        
        // Verificar el token JWT (incluyendo expiración)
        const decoded = jwt.verify(cleanToken, process.env.SALT);
        console.log('Token válido y no expirado. Usuario:', decoded);
        
        // Agregar datos del usuario a la request
        req.usuario = decoded;
        
        console.log('=== authMiddleware EXITOSO ===');
        next();
        
    } catch (error) {
        console.error('Error en authMiddleware:', error.message);
        
        // Manejar errores específicos de JWT
        if (error.name === 'TokenExpiredError') {
            console.log('TOKEN EXPIRADO - Vida útil agotada');
            return res.status(401).json({
                estado: 'error',
                mensaje: 'Token expirado. Por favor, inicia sesión nuevamente.'
            });
        } else if (error.name === 'JsonWebTokenError') {
            console.log('TOKEN INVÁLIDO - Formato o firma incorrecta');
            return res.status(401).json({
                estado: 'error',
                mensaje: 'Token inválido. Verifica tu autenticación.'
            });
        } else if (error.name === 'NotBeforeError') {
            return res.status(401).json({
                estado: 'error',
                mensaje: 'Token no activo aún.'
            });
        } else {
            return res.status(401).json({
                estado: 'error',
                mensaje: 'Error al procesar token: ' + error.message
            });
        }
    }
};