import express from 'express';
import { body } from 'express-validator';
import { createOrUpdateInstalacao } from '../controllers/instalacaoController.js';
//import { validateRequest } from '../middleware/validateRequest.js';
//import { authenticateToken, checkOwnershipOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/',
  [
    body('cim').isLength({ min: 1 }).withMessage('CIM é obrigatório.'),
    body('titulos_instalacao.*.titulo').isLength({ min: 1 }).withMessage('Título é obrigatório.'),
    body('titulos_instalacao.*.data').isISO8601().withMessage('Data inválida.'),
    body('titulos_instalacao.*.descricao').isLength({ min: 1 }).withMessage('Descrição é obrigatória.'),
  ],
  //validateRequest,
  //authenticateToken,
  //checkOwnershipOrAdmin,
  createOrUpdateInstalacao
);

export default router;
