import pool from '../config/dbpostgresql.js';
import { logger } from '../middleware/logger.js';

export const createOrUpdateFilhos = async (req, res) => {
  const { nome, cim, data_nascimento } = req.body;

  // Verificação de propriedade ou se é um administrador
  if (req.user.cim != cim && !req.user.is_admin) {
    logger.warn('Acesso negado. Tentativa de modificar dados de outro usuário.');
    return res.status(403).json({ error: 'Acesso negado. Você só pode modificar seus próprios dados.' });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM filhos WHERE cim = $1 AND nome = $2', [cim, nome]);

    if (existingUser.rows.length > 0) {
      // Atualiza filho existente
      const updatedFilho = await pool.query(
        'UPDATE filhos SET data_nascimento = $1 WHERE cim = $2 AND nome = $3 RETURNING *',
        [data_nascimento, cim, nome]
      );
      return res.status(200).json({ message: 'Filho atualizado com sucesso.', filho: updatedFilho.rows[0] });
    } else {
      // Cria novo filho
      const newFilho = await pool.query(
        'INSERT INTO filhos (nome, cim, data_nascimento) VALUES ($1, $2, $3) RETURNING *',
        [nome, cim, data_nascimento]
      );
      return res.status(201).json({ message: 'Filho cadastrado com sucesso.', filho: newFilho.rows[0] });
    }
  } catch (error) {
    logger.error('Erro no servidor:', error);
    res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.', error: error.message }] });
  }
};
