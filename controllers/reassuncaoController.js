import pool from '../config/dbpostgresql.js';

export const createOrUpdateReassuncao = async (req, res) => {
  const { cim, titulos_reassuncao } = req.body;
  let updated = false;

  try {
    for (const reassuncao of titulos_reassuncao) {
      const { titulo_distintivo, data_titulo_distintivo, descricao } = reassuncao;

      const tabela = 'reassuncao';

      const isoDate = new Date(data_titulo_distintivo).toISOString().split('T')[0];

      const existingTitulo = await pool.query(
        `SELECT * FROM ${tabela} WHERE cim = $1 AND titulo_distintivo = $2`,
        [cim, titulo_distintivo]
      );

      if (existingTitulo.rows.length > 0) {
        // Atualiza título existente
        await pool.query(
          `UPDATE ${tabela} SET data_titulo_distintivo = $1, descricao = $2 WHERE cim = $3 AND titulo_distintivo = $4`,
          [isoDate, descricao, cim, titulo_distintivo]
        );
        updated = true;
      } else {
        // Cria novo título
        await pool.query(
          `INSERT INTO ${tabela} (cim, titulo_distintivo, data_titulo_distintivo, descricao) VALUES ($1, $2, $3, $4)`,
          [cim, titulo_distintivo, isoDate, descricao]
        );
      }
    }
    return res.status(201).json({ message: updated ? 'Dados atualizados com sucesso.' : 'Dados enviados com sucesso.' });
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.', error: error.message }] });
  }
};
