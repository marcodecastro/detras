import pool from '../config/dbpostgresql.js';
import { logger } from '../middleware/logger.js';

export const createOrUpdateCasamento = async (req, res) => {
  const { cim, nome_conjuge, data_casamento } = req.body;

  // Verificação de propriedade ou se é um administrador
  if (req.user.cim != cim && !req.user.is_admin) {
    logger.warn('Acesso negado. Tentativa de modificar dados de outro usuário.');
    return res.status(403).json({ error: 'Acesso negado. Você só pode modificar seus próprios dados.' });
  }

  try {
    // Verifica se o casamento já existe para este membro
    const existingCasamento = await pool.query('SELECT * FROM casamento WHERE cim = $1', [cim]);

    if (existingCasamento.rows.length > 0) {
      // Atualiza casamento existente
      const updatedCasamento = await pool.query(
        'UPDATE casamento SET nome_conjuge = $1, data_casamento = $2 WHERE cim = $3 RETURNING *',
        [nome_conjuge, data_casamento, cim]
      );
      return res.status(200).json({ message: 'Casamento atualizado com sucesso.', casamento: updatedCasamento.rows[0] });
    } else {
      // Cria novo casamento
      const newCasamento = await pool.query(
        'INSERT INTO casamento (cim, nome_conjuge, data_casamento) VALUES ($1, $2, $3) RETURNING *',
        [cim, nome_conjuge, data_casamento]
      );
      return res.status(201).json({ message: 'Casamento cadastrado com sucesso.', casamento: newCasamento.rows[0] });
    }
  } catch (error) {
    logger.error('Erro no servidor:', error);
    res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.', error: error.message }] });
  }
};

