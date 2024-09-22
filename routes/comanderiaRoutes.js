import express from 'express';
import { body } from 'express-validator';
import { createOrUpdateComanderia } from '../controllers/comanderiaController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateToken, checkOwnershipOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/',
  [
    body('cim').isString().notEmpty(),
    body('graus_comanderia').isArray().notEmpty(),
    body('graus_comanderia.*.grau').isString().notEmpty(),
    body('graus_comanderia.*.data').isString().notEmpty(),
    body('graus_comanderia.*.descricao').isString().notEmpty(),
  ],
  validateRequest,
  authenticateToken,
  checkOwnershipOrAdmin,
  createOrUpdateComanderia
);

export default router;
