import pool from '../config/dbpostgresql.js';
import { logger } from '../middleware/logger.js';
import bcrypt from 'bcrypt';

export const createOrUpdateMembro = async (req, res) => {
  const { nome, cim, data_nascimento, email, senha, celular } = req.body;

  // Verificação de propriedade ou se é um administrador
  if (req.user.cim != cim && !req.user.is_admin) {
    logger.warn('Acesso negado. Tentativa de modificar dados de outro usuário.');
    return res.status(403).json({ error: 'Acesso negado. Você só pode modificar seus próprios dados.' });
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);
    const existingUser = await pool.query('SELECT * FROM membro WHERE cim = $1', [cim]);

    if (existingUser.rows.length > 0) {
      // Atualiza membro existente
      const updatedMembro = await pool.query(
        'UPDATE membro SET nome = $1, data_nascimento = $2, email = $3, celular = $4, senha = $5 WHERE cim = $6 RETURNING *',
        [nome, data_nascimento, email, celular, hashedSenha, cim]
      );
      return res.status(200).json({ message: 'Membro atualizado com sucesso.', membro: updatedMembro.rows[0] });
    } else {
      // Cria novo membro
      const newMembro = await pool.query(
        'INSERT INTO membro (nome, cim, data_nascimento, email, celular, senha) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [nome, cim, data_nascimento, email, celular, hashedSenha]
      );
      return res.status(201).json({ message: 'Membro cadastrado com sucesso.', membro: newMembro.rows[0] });
    }
  } catch (error) {
    logger.error('Erro no servidor:', error);
    res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.', error: error.message }] });
  }
};

// Retorna todos os membros
export const getMembros = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM membro');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.' }] });
  }
};
