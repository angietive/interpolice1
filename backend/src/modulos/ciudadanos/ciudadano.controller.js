import {
    getCiudadanoDB,
    getCiudadanoByCodigo_universalDB,
    createCiudadanoDB,
    updateCiudadanoDB,
    deleteCiudadanoDB,
    getPlanetasDB,
    updateImagenDb
} from "./ciudadano.model.js";

export async function getAllCiudadano(req, res) {
    try {
        const resultado = await getCiudadanoDB();
        res.status(200).json(resultado);
    } catch (error) {
        console.error("Error al obtener ciudadanos:", error);
        res.status(500).json({
            estado: "error",
            mensaje: error.code + "=>" + error.message + "=>" + "Error al obtener ciudadanos",
        });
    }
}

export async function getCiudadanoByCodigo_universal(req, res) {
    try {
        const resultado = await getCiudadanoByCodigo_universalDB(req.params.codigo_universal);
        if (!resultado.data) {
            return res.status(404).json({
                estado: "error",
                mensaje: "No existe el ciudadano"
            });
        }
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({
            estado: "error",
            mensaje: error.message + " => Error al obtener ciudadano",
        });
    }
}

export async function createCiudadano(req, res) {
    try {
        const resultado = await createCiudadanoDB(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({
            estado: "error",
            mensaje: error.code + "=>" + error.message + "=>" + "Error al crear ciudadano",
        });
    }
}

export async function updateCiudadano(req, res) {
    try {
        const resultado = await updateCiudadanoDB(req.params.codigo_universal, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({
            estado: "error",
            mensaje: error.code + "=>" + error.message + "=>" + "Error al actualizar ciudadano",
        });
    }
}

export async function deleteCiudadano(req, res) {
    try {
        const resultado = await deleteCiudadanoDB(req.params.codigo_universal);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({
            estado: "error",
            mensaje: error.code + "=>" + error.message + "=>" + "Error al eliminar ciudadano",
        });
    }
}

export async function getPlanetas(req, res) {
    try {
        const resultado = await getPlanetasDB();
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({
            estado: "error",
            mensaje: error.code + "=>" + error.message + "=>" + "Error al obtener planetas",
        });
    }
}

export async function subirImagen(req, res) {
    try {
        console.log('=== DEBUG SUBIR IMAGEN ===');
        console.log('Headers recibidos:', req.headers);
        console.log('Archivo recibido (req.file):', req.file);
        console.log('Archivos recibidos (req.files):', req.files);
        console.log('Body recibido:', req.body);
        console.log('Params recibidos:', req.params);
        console.log('=== FIN DEBUG ===');
        
        // Verificar si se recibió un archivo
        if (!req.file) {
            console.log('ERROR: No se recibió ningún archivo');
            return res.status(400).json({
                estado: 'error',
                mensaje: 'No se recibió ningún archivo. Asegúrate de que:',
                detalles: [
                    'El campo del formulario se llame "file0"',
                    'El Content-Type sea "multipart/form-data"',
                    'El archivo no exceda 5MB',
                    'El archivo sea una imagen válida'
                ]
            });
        }
        
        // Validar la extensión del archivo
        let archivo = req.file.originalname;
        console.log('Procesando archivo:', archivo);
        
        let archivoSeparado = archivo.split('.');
        let extencion = archivoSeparado[archivoSeparado.length - 1]; // Usar el último elemento por si hay múltiples puntos
        
        if (!['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG', 'gif', 'GIF'].includes(extencion)) {
            console.log('ERROR: Extensión no válida:', extencion);
            return res.status(400).json({
                estado: 'error',
                mensaje: `La extensión "${extencion}" no es válida. Solo se permiten: jpg, jpeg, png, gif`
            });
        }
        
        // Procesar la imagen
        let codigo_universal = req.params.codigo_universal;
        let rutaImagen = req.file.filename;
        
        console.log('Actualizando imagen en BD:', { rutaImagen, codigo_universal });
        let resultado = await updateImagenDb(rutaImagen, codigo_universal);
        
        console.log('Resultado de actualización BD:', resultado);
        
        return res.status(200).json({
            estado: 'ok',
            mensaje: 'Imagen subida exitosamente',
            archivo: {
                nombre: req.file.filename,
                nombreOriginal: req.file.originalname,
                ruta: req.file.path,
                tamaño: req.file.size,
                tipo: req.file.mimetype
            },
            ciudadano: codigo_universal
        });
        
    } catch (error) {
        console.error('Error en subirImagen:', error);
        return res.status(500).json({
            estado: 'error',
            mensaje: 'Error interno del servidor al subir imagen',
            detalles: error.message
        });
    }
};