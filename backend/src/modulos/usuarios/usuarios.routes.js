import express from 'express';
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from './usuarios.controller.js';

import { authMiddleware } from '../helpers/admTokens.js';
const router = express.Router();

// Rutas para usuarios
router.get('/usuarios', getAllUsuarios);
router.get('/usuarios/:id_usuario', getUsuarioById);
router.post('/usuarios',authMiddleware, createUsuario);
router.put('/usuarios/:id_usuario',authMiddleware, updateUsuario);
router.delete('/usuarios/:id_usuario',authMiddleware, deleteUsuario);

export default router;