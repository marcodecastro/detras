import express from 'express';
import { createOrUpdateMembro, getMembros } from '../controllers/membroController.js';
import { authenticateToken, checkOwnershipOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rota para criar ou atualizar membros (protegida por autenticação e verificação de propriedade/admin)
router.post('/', authenticateToken, checkOwnershipOrAdmin, createOrUpdateMembro);

// Rota para obter membros (apenas autenticados)
router.get('/', authenticateToken, getMembros);

export default router;


