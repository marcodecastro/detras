import pool from '../config/dbpostgresql.js';

export const createOrUpdateApostolado = async (req, res) => {
  const { cim, graus_apostolado } = req.body;
  let updated = false;

  try {
    for (const apostolado of graus_apostolado) {
      const { grau, data, descricao } = apostolado;
      let tabela;

      // Mapeia os graus para as tabelas correspondentes
      if (grau === 'Recruta') {
        tabela = 'recruta';
      } else if (grau === 'Cavaleiro de Santa Cruz') {
        tabela = 'cavaleiro_santa_cruz';
      }

      // Converte a data para o formato ISO 8601 (yyyy-MM-dd)
      const isoDate = new Date(data).toISOString().split('T')[0];

      const existingGrau = await pool.query(`SELECT * FROM ${tabela} WHERE cim = $1 AND graus_apostolado = $2`, [cim, grau]);
      if (existingGrau.rows.length > 0) {
        // Atualiza grau existente
        await pool.query(
          `UPDATE ${tabela} SET data_graus_apostolado = $1, descricao = $2 WHERE cim = $3 AND graus_apostolado = $4`,
          [isoDate, descricao, cim, grau]
        );
        updated = true;
      } else {
        // Cria novo grau
        await pool.query(
          `INSERT INTO ${tabela} (cim, graus_apostolado, data_graus_apostolado, descricao) VALUES ($1, $2, $3, $4)`,
          [cim, grau, isoDate, descricao]
        );
      }
    }
    return res.status(201).json({ message: updated ? 'Dados atualizados com sucesso.' : 'Dados enviados com sucesso.' });
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.', error: error.message }] });
  }
};
