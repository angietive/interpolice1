import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Genera un código QR para un ciudadano basado en sus datos
 * @param {Object} ciudadanoData - Datos del ciudadano
 * @param {number} ciudadanoData.id_ciudadano - ID del ciudadano
 * @param {string} ciudadanoData.nombre - Nombre del ciudadano
 * @param {string} ciudadanoData.apellido - Apellido del ciudadano
 * @param {string} ciudadanoData.fecha_nacimiento - Fecha de nacimiento (YYYY-MM-DD)
 * @returns {Promise<string>} - Nombre del archivo QR generado
 */
export async function generateCiudadanoQR(ciudadanoData) {
    try {
        const { id_ciudadano, nombre, apellido, fecha_nacimiento } = ciudadanoData;
        
        // Crear el string para el código QR concatenando los datos
        const qrData = `${id_ciudadano}${nombre}${apellido}${fecha_nacimiento}`;
        
        // Crear nombre único para el archivo QR
        const qrFileName = `qr_ciudadano_${id_ciudadano}_${Date.now()}.png`;
        
        // Definir la ruta donde se guardará el QR
        const qrFolderPath = path.join(__dirname, '../../../public/qr');
        const qrFilePath = path.join(qrFolderPath, qrFileName);
        
        // Asegurar que el directorio existe
        if (!fs.existsSync(qrFolderPath)) {
            fs.mkdirSync(qrFolderPath, { recursive: true });
        }
        
        // Configuración del QR
        const qrOptions = {
            errorCorrectionLevel: 'M',
            type: 'png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',  // Color del código QR
                light: '#FFFFFF'  // Color del fondo
            }
        };
        
        // Generar y guardar el código QR
        await QRCode.toFile(qrFilePath, qrData, qrOptions);
        
        console.log(`Código QR generado exitosamente: ${qrFileName}`);
        
        return qrFileName;
        
    } catch (error) {
        console.error('Error al generar código QR:', error);
        throw new Error(`Error al generar código QR: ${error.message}`);
    }
}

/**
 * Elimina un archivo QR específico
 * @param {string} qrFileName - Nombre del archivo QR a eliminar
 * @returns {boolean} - true si se eliminó correctamente, false en caso contrario
 */
export function deleteQRFile(qrFileName) {
    try {
        if (!qrFileName) return false;
        
        const qrFolderPath = path.join(__dirname, '../../../public/qr');
        const qrFilePath = path.join(qrFolderPath, qrFileName);
        
        if (fs.existsSync(qrFilePath)) {
            fs.unlinkSync(qrFilePath);
            console.log(`Archivo QR eliminado: ${qrFileName}`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error al eliminar archivo QR:', error);
        return false;
    }
}

/**
 * Obtiene la ruta completa para servir el archivo QR
 * @param {string} qrFileName - Nombre del archivo QR
 * @returns {string} - Ruta relativa para servir el archivo
 */
export function getQRFilePath(qrFileName) {
    return `/qr/${qrFileName}`;
}