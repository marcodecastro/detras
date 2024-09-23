import express from 'express';
import { body } from 'express-validator';
import { createOrUpdateReassuncao } from '../controllers/reassuncaoController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateToken, checkOwnershipOrAdmin } from '../middleware/authMiddleware.js'; // Certifique-se de importar os middlewares de autenticação e autorização

const router = express.Router();

router.post(
  '/',
  [
    body('cim').isString().notEmpty(),
    body('titulos_reassuncao').isArray().notEmpty(),
    body('titulos_reassuncao.*.titulo_distintivo').isString().notEmpty(),
    body('titulos_reassuncao.*.data_titulo_distintivo').isString().notEmpty(),
    body('titulos_reassuncao.*.descricao').isString().notEmpty(),
  ],
  validateRequest,
  authenticateToken, // Adiciona o middleware de autenticação
  checkOwnershipOrAdmin, // Adiciona o middleware de autorização
  createOrUpdateReassuncao
);

export default router;
