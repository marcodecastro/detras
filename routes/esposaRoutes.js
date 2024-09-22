import express from 'express';
import { createOrUpdateEsposa } from '../controllers/esposaController.js';
import { authenticateToken, checkOwnershipOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, checkOwnershipOrAdmin, createOrUpdateEsposa);

export default router; 




