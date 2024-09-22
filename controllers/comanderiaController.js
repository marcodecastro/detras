import pool from '../config/dbpostgresql.js';

export const createOrUpdateComanderia = async (req, res) => {
  const { cim, graus_comanderia } = req.body;
  let updated = false;

  try {
    for (const grau_comanderia of graus_comanderia) {
      const { grau, data, descricao } = grau_comanderia;
      let tabela;

      // Mapeia os graus para as tabelas correspondentes
      if (grau === 'Ordem da Cruz Vermelha') {
        tabela = 'ordem_da_cruz_vermelha';
      } else if (grau === 'Ordem de Malta') {
        tabela = 'ordem_de_malta';
      } else if (grau === 'Ordem do Templo') {
        tabela = 'ordem_do_templo';
      } else {
        continue; // Ignora graus inválidos
      }

      // Converte a data para o formato ISO 8601 (yyyy-MM-dd)
      const isoDate = new Date(data).toISOString().split('T')[0];

      const existingGrau = await pool.query(`SELECT * FROM ${tabela} WHERE cim = $1 AND graus_comanderia = $2`, [cim, grau]);
      if (existingGrau.rows.length > 0) {
        // Atualiza grau existente
        await pool.query(
          `UPDATE ${tabela} SET data_graus_comanderia = $1, descricao = $2 WHERE cim = $3 AND graus_comanderia = $4`,
          [isoDate, descricao, cim, grau]
        );
        updated = true;
      } else {
        // Cria novo grau
        await pool.query(
          `INSERT INTO ${tabela} (cim, graus_comanderia, data_graus_comanderia, descricao) VALUES ($1, $2, $3, $4)`,
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

