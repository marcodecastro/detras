import express from 'express';
import { authenticateToken, checkOwnershipOrAdmin } from '../middleware/authMiddleware.js';
import { getMemberProfile } from '../controllers/profileController.js';

const router = express.Router();

// Rota de perfil protegida
router.get('/profile', authenticateToken, getMemberProfile);

// Exemplo de rota protegida por ownership ou admin
router.put('/profile/update', authenticateToken, checkOwnershipOrAdmin, (req, res) => {
    // Lógica para atualizar o perfil do membro
    res.status(200).json({ message: 'Perfil atualizado com sucesso.' });
  });

export default router;
