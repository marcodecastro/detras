import express from 'express';
import { body } from 'express-validator';
import { createOrUpdateAdicionais } from '../controllers/adicionaisController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateToken, checkOwnershipOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  [
    body('cim').isLength({ min: 1 }).withMessage('CIM é obrigatório.'),
    body('graus_adicionais.*.grau').isLength({ min: 1 }).withMessage('Grau é obrigatório.'),
    body('graus_adicionais.*.data').isISO8601().toDate().withMessage('Data inválida.'),
    body('graus_adicionais.*.descricao').isLength({ min: 1 }).withMessage('Descrição é obrigatória.'),
  ],
  validateRequest,
  checkOwnershipOrAdmin,
  createOrUpdateAdicionais
);

router.use((err, req, res, next) => {
  console.error('Erro na rota:', err);
  res.status(500).json({ errors: [{ msg: 'Erro interno na aplicação.' }] });
});

export default router;
