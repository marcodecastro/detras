import express from 'express';
import { body } from 'express-validator';
import { createOrUpdateSimbolicos } from '../controllers/simbolicosController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateToken, checkOwnershipOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  [
    body('cim').isLength({ min: 1 }).withMessage('CIM é obrigatório.'),
    body('graus_simbolicos.*.grau').isLength({ min: 1 }).withMessage('Grau é obrigatório.'),
    body('graus_simbolicos.*.data').isDate().withMessage('Data inválida.'),
    body('graus_simbolicos.*.descricao').isLength({ min: 1 }).withMessage('Descrição é obrigatória.'),
  ],
  validateRequest,
  checkOwnershipOrAdmin,
  createOrUpdateSimbolicos
);

export default router;

