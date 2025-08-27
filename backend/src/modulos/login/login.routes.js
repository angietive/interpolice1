import { Router } from 'express';
import { loginUsuario } from './login.controller.js';
import multer from 'multer';

const router = Router();

// Ruta para login
router.post('/login', loginUsuario);

export default router;
