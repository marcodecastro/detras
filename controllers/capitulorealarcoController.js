import pool from '../config/dbpostgresql.js';

export const createOrUpdateCapituloRealArco = async (req, res) => {
  const { cim, graus_capitulorealarco } = req.body;
  let updated = false;

  try {
    for (const grau_realArco of graus_capitulorealarco) {
      const { grau, data, descricao } = grau_realArco;
      let tabela;

      // Mapeia os graus para as tabelas correspondentes
      if (grau === 'Mestre de Marca') {
        tabela = 'mestre_de_marca';
      } else if (grau === 'Past Master') {
        tabela = 'past_master';
      } else if (grau === 'Mui Excelente Mestre') {
        tabela = 'mui_excellente_mestre';
      } else if (grau === 'Maçom do Real Arco') {
        tabela = 'macom_do_real_arco';
      } else {
        continue; // Ignora graus inválidos
      }

      // Converte a data para o formato ISO 8601 (yyyy-MM-dd)
      const isoDate = new Date(data).toISOString().split('T')[0];

      const existingGrau = await pool.query(`SELECT * FROM ${tabela} WHERE cim = $1 AND graus_capitulorealarco = $2`, [cim, grau]);
      if (existingGrau.rows.length > 0) {
        // Atualiza grau existente
        await pool.query(
          `UPDATE ${tabela} SET data_graus_capitulorealarco = $1, descricao = $2 WHERE cim = $3 AND graus_capitulorealarco = $4`,
          [isoDate, descricao, cim, grau]
        );
        updated = true;
      } else {
        // Cria novo grau
        await pool.query(
          `INSERT INTO ${tabela} (cim, graus_capitulorealarco, data_graus_capitulorealarco, descricao) VALUES ($1, $2, $3, $4)`,
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
