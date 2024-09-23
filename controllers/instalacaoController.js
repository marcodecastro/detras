import pool from '../config/dbpostgresql.js';

export const createOrUpdateInstalacao = async (req, res) => {
  const { cim, titulos_instalacao } = req.body;
  let updated = false;

  try {
    for (const instalacao of titulos_instalacao) {
      const { titulo, data, descricao } = instalacao;
      let tabela;

      // Mapeia os títulos para as tabelas correspondentes
      if (titulo === 'Mestre Instalado') {
        tabela = 'instalacao';
      } else if (titulo === 'Past Master') {
        tabela = 'instalacao';
      }

      // Converte a data para o formato ISO 8601 (yyyy-MM-dd)
      const isoDate = new Date(data).toISOString().split('T')[0];

      const existingTitulo = await pool.query(`SELECT * FROM ${tabela} WHERE cim = $1 AND titulo_distintivo = $2`, [cim, titulo]);
      if (existingTitulo.rows.length > 0) {
        // Atualiza título existente
        await pool.query(
          `UPDATE ${tabela} SET data_titulo_distintivo = $1, descricao = $2 WHERE cim = $3 AND titulo_distintivo = $4`,
          [isoDate, descricao, cim, titulo]
        );
        updated = true;
      } else {
        // Cria novo título
        await pool.query(
          `INSERT INTO ${tabela} (cim, titulo_distintivo, data_titulo_distintivo, descricao) VALUES ($1, $2, $3, $4)`,
          [cim, titulo, isoDate, descricao]
        );
      }
    }
    return res.status(201).json({ message: updated ? 'Dados atualizados com sucesso.' : 'Dados enviados com sucesso.' });
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.', error: error.message }] });
  }
};
