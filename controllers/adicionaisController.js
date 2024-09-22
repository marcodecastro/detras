import pool from '../config/dbpostgresql.js';
import { parse } from 'date-fns';

export const createOrUpdateAdicionais = async (req, res) => {
  const { cim, graus_adicionais } = req.body;

  // Verificação de propriedade ou se é um administrador
  if (req.user.cim != cim && !req.user.is_admin) {
    return res.status(403).json({ error: 'Acesso negado. Você só pode modificar seus próprios dados.' });
  }

  try {
    let updateCount = 0;
    let createCount = 0;

    for (const grau_adicional of graus_adicionais) {
      const { grau, data, descricao } = grau_adicional;
      let tabela;
      if (grau === 'Mestre Maçom da Marca') {
        tabela = 'mestre_maçom_da_marca';
      } else if (grau === 'Nautas da Arca Real') {
        tabela = 'nautas_da_arca_real';
      } else if (grau === 'Arco Real') {
        tabela = 'arco_real';
      } else if (grau === 'Cavaleiro Templário') {
        tabela = 'cavaleiro_templario';
      } else if (grau === 'Cavaleiro de Malta') {
        tabela = 'cavaleiro_de_malta';
      } else {
        continue; 
      }

      const isoDate = new Date(data).toISOString().split('T')[0];

      const existingGrau = await pool.query(`SELECT * FROM ${tabela} WHERE cim = $1`, [cim]);
      if (existingGrau.rows.length > 0) {
        // Atualiza grau existente
        await pool.query(
          `UPDATE ${tabela} SET graus_adicionais = $1, data_graus_adicionais = $2, descricao = $3 WHERE cim = $4`,
          [grau, isoDate, descricao, cim]
        );
        updateCount++;
      } else {
        // Cria novo grau
        await pool.query(
          `INSERT INTO ${tabela} (cim, graus_adicionais, data_graus_adicionais, descricao) VALUES ($1, $2, $3, $4)`,
          [cim, grau, isoDate, descricao]
        );
        createCount++;
      }
    }

    let message;
    if (updateCount > 0 && createCount > 0) {
      message = 'Graus adicionais atualizados e cadastrados com sucesso.';
    } else if (updateCount > 0) {
      message = 'Graus adicionais atualizados com sucesso.';
    } else if (createCount > 0) {
      message = 'Graus adicionais cadastrados com sucesso.';
    } else {
      message = 'Nenhuma alteração feita nos graus adicionais.';
    }

    return res.status(201).json({ message });
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.', error: error.message }] });
  }
};
