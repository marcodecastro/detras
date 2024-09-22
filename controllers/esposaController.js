import pool from '../config/dbpostgresql.js';
import { logger } from '../middleware/logger.js';

export const createOrUpdateEsposa = async (req, res) => {
  const { nome, cim, data_nascimento } = req.body;

  // Verificação de propriedade ou se é um administrador
  if (req.user.cim != cim && !req.user.is_admin) {
    logger.warn('Acesso negado. Tentativa de modificar dados de outro usuário.');
    return res.status(403).json({ error: 'Acesso negado. Você só pode modificar seus próprios dados.' });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM esposa WHERE cim = $1', [cim]);

    if (existingUser.rows.length > 0) {
      // Atualiza esposa existente
      const updatedEsposa = await pool.query(
        'UPDATE esposa SET nome = $1, data_nascimento = $2 WHERE cim = $3 RETURNING *',
        [nome, data_nascimento, cim]
      );
      return res.status(200).json({ message: 'Esposa atualizada com sucesso.', esposa: updatedEsposa.rows[0] });
    } else {
      // Cria nova esposa
      const newEsposa = await pool.query(
        'INSERT INTO esposa (nome, cim, data_nascimento) VALUES ($1, $2, $3) RETURNING *',
        [nome, cim, data_nascimento]
      );
      return res.status(201).json({ message: 'Esposa cadastrada com sucesso.', esposa: newEsposa.rows[0] });
    }
  } catch (error) {
    logger.error('Erro no servidor:', error);
    res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.', error: error.message }] });
  }
};

