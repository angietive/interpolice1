import { Router } from 'express';
import {
	getAllDelitos,
	getDelitoById,
	createDelito,
	updateDelito,
	deleteDelito
} from './delito.controller.js';
import multer from 'multer';
const router = Router();

// Endpoints CRUD para delitos
router.get('/', getAllDelitos);
router.get('/:id', getDelitoById);
router.post('/', createDelito);
router.put('/:id', updateDelito);
router.delete('/:id', deleteDelito);

export default router;
