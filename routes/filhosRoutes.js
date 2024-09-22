import express from 'express';
import { createOrUpdateFilhos } from '../controllers/filhosController.js';
import { authenticateToken, checkOwnershipOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, checkOwnershipOrAdmin, createOrUpdateFilhos);

export default router;

