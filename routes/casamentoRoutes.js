import express from 'express';
import { body } from 'express-validator';
import { createOrUpdateCasamento } from '../controllers/casamentoController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateToken, checkOwnershipOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  [
    body('cim').isLength({ min: 1 }).withMessage('CIM é obrigatório.'),
    body('nome_conjuge').isLength({ min: 1 }).withMessage('Nome do cônjuge é obrigatório.'),
    body('data_casamento').isDate().withMessage('Data de casamento inválida.'),
  ],
  validateRequest,
  checkOwnershipOrAdmin,
  createOrUpdateCasamento
);

export default router;

