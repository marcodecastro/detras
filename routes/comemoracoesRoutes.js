import express from 'express';
import { fetchComemoracoes, fetchComemoracoesSemana, fetchComemoracoesBrasil } from '../controllers/comemoracoesController.js';

const router = express.Router();


router.get('/comemoracoes', fetchComemoracoes);
router.get('/comemoracoes-semana', fetchComemoracoesSemana);
router.get('/comemoracoes-brasil', fetchComemoracoesBrasil);


export default router;


