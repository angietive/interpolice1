import express from 'express';
import {
    getAllCiudadano,
    getCiudadanoByCodigo_universal,
    createCiudadano,
    updateCiudadano,
    deleteCiudadano,
    getPlanetas,
    subirImagen,
    getCiudadanoQR
} from './ciudadano.controller.js';
import multer from 'multer';
import { authMiddleware } from '../helpers/admTokens.js';
const router = express.Router();

const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/img/user');
  },
  filename: (req, file, cb) => {
    cb(null, 'USER-'+Date.now() + '-' + file.originalname);
  },
});

const subir = multer({ storage: almacenamiento }).single('file0');

// Rutas para ciudadanos
router.get('/ciudadanosTodos', getAllCiudadano);
router.get('/ciudadanos/:codigo_universal', getCiudadanoByCodigo_universal);
router.get('/ciudadanos/:codigo_universal/qr', getCiudadanoQR);
router.post('/ciudadanos',authMiddleware, createCiudadano);
router.post('/subirImagen/:codigo_universal', subir, subirImagen);
router.put('/ciudadanos/:codigo_universal',authMiddleware, updateCiudadano);
router.delete('/ciudadanos/:codigo_universal',authMiddleware, deleteCiudadano);

// Ruta para obtener planetas
router.get('/planetas', getPlanetas);

export default router;