import express from 'express';
import { registrarPresenca, listarPresencas, listarMembros, listarReunioes, gerarRelatorio } from '../controllers/presencasController.js';

const router = express.Router();

router.post('/registrar', registrarPresenca);
router.get('/listar', listarPresencas);
router.get('/membros', listarMembros);
router.get('/reunioes', listarReunioes);
router.get('/relatorio', gerarRelatorio);

export default router; 

