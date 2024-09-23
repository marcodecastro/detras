import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import adicionaisRoutes from './routes/adicionaisRoutes.js';
import apostoladoRoutes from './routes/apostoladoRoutes.js';
import capitulorealarcoRoutes from './routes/capitulorealarcoRoutes.js';
import comanderiaRoutes from './routes/comanderiaRoutes.js';
import membroRoutes from './routes/membroRoutes.js';
import esposaRoutes from './routes/esposaRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';
import filhosRoutes from './routes/filhosRoutes.js';
import filosoficosRoutes from './routes/filosoficosRoutes.js';
import casamentoRoutes from './routes/casamentoRoutes.js';
import comemoracoesRoutes from './routes/comemoracoesRoutes.js';
import simbolicosRoutes from './routes/simbolicosRoutes.js'; 


dotenv.config();

const app = express();

const allowedOrigins = {
  origin: process.env.CORS_ORIGIN,    
  optionsSuccessStatus: 200,
};

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Permitir envio de cookies, se necessário.
  optionsSuccessStatus: 204, // Para compatibilidade com alguns navegadores antigos.
}; 

app.use(cors(corsOptions));

app.use(bodyParser.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/membro', membroRoutes);
app.use('/api/adicionais', adicionaisRoutes);
app.use('/api/apostolado', apostoladoRoutes);
app.use('/api/esposa', esposaRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/filhos', filhosRoutes);
app.use('/api/casamento', casamentoRoutes);
app.use('/api/capitulorealarco', capitulorealarcoRoutes);
app.use('/api/comanderia', comanderiaRoutes);
app.use('/api/comemoracoes', comemoracoesRoutes);
app.use('/api/comemoracoes-semana', comemoracoesRoutes);
app.use('/api/comemoracoes-brasil', comemoracoesRoutes);
app.use('/api/filosoficos', filosoficosRoutes);
app.use('api/simbolicos', simbolicosRoutes);


// Rota de teste
app.get('/', (req, res) => {
  res.send('API rodando');
});

// Configurar a porta e iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
