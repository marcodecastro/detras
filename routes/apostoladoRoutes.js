import express from 'express';
import { body } from 'express-validator';
import { createOrUpdateApostolado } from '../controllers/apostoladoController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateToken, checkOwnershipOrAdmin } from '../middleware/authMiddleware.js'; // Certifique-se de importar os middlewares de autenticação e autorização

const router = express.Router();

router.post(
  '/',
  [
    body('cim').isString().notEmpty(),
    body('graus_apostolado').isArray().notEmpty(),
    body('graus_apostolado.*.grau').isString().notEmpty(),
    body('graus_apostolado.*.data').isString().notEmpty(),
    body('graus_apostolado.*.descricao').isString().notEmpty(),
  ],
  validateRequest,
  authenticateToken, 
  checkOwnershipOrAdmin, 
  createOrUpdateApostolado
);

export default router;
