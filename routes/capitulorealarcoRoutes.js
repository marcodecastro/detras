import express from 'express';
import { body } from 'express-validator';
import { createOrUpdateCapituloRealArco } from '../controllers/capitulorealarcoController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateToken, checkOwnershipOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/',
  [
    body('cim').isString().notEmpty(),
    body('graus_capitulorealarco').isArray().notEmpty(),
    body('graus_capitulorealarco.*.grau').isString().notEmpty(),
    body('graus_capitulorealarco.*.data').isString().notEmpty(),
    body('graus_capitulorealarco.*.descricao').isString().notEmpty(),
  ],
  validateRequest,
  authenticateToken,
  checkOwnershipOrAdmin,
  createOrUpdateCapituloRealArco
);

export default router;

