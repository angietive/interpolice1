import express from 'express';
import {
    getAllEvidencias,
    getEvidenciaById,
    getEvidenciasByDelito,
    createEvidencia,
    updateEvidencia,
    deleteEvidencia
} from './evidencia.controller.js';
import multer from 'multer';
const router = express.Router();

// Rutas para evidencias
router.get('/evidencias', getAllEvidencias);
router.get('/evidencias/:id_evidencia', getEvidenciaById);
router.get('/evidencias/delito/:id_delito', getEvidenciasByDelito);
router.post('/evidencias', createEvidencia);
router.put('/evidencias/:id_evidencia', updateEvidencia);
router.delete('/evidencias/:id_evidencia', deleteEvidencia);

export default router;