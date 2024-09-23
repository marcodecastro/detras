/*import pool from '../config/dbpostgresql.js';
import { logger } from '../middleware/logger.js';

export const createOrUpdateSimbolicos = async (req, res) => {
  const { cim, graus_simbolicos } = req.body;

  // Verificação de propriedade ou se é um administrador
  if (req.user.cim != cim && !req.user.is_admin) {
    logger.warn('Acesso negado. Tentativa de modificar dados de outro usuário.');
    return res.status(403).json({ error: 'Acesso negado. Você só pode modificar seus próprios dados.' });
  }

  try {
    let updateCount = 0;
    let createCount = 0;

    for (const grau_simbolico of graus_simbolicos) {
      const { grau, data, descricao } = grau_simbolico;
      let tabela;
      if (grau === 'Aprendiz Maçom') {
        tabela = 'iniciacao';
      } else if (grau === 'Companheiro Maçom') {
        tabela = 'elevacao';
      } else if (grau === 'Mestre Maçom') {
        tabela = 'exaltacao';
      } else {
        continue; // Ignora graus inválidos
      }

      const existingGrau = await pool.query(`SELECT * FROM ${tabela} WHERE cim = $1`, [cim]);
      if (existingGrau.rows.length > 0) {
        // Atualiza grau existente
        await pool.query(
          `UPDATE ${tabela} SET grau_simbolico = $1, data_grau_simbolico = $2, descricao = $3 WHERE cim = $4`,
          [grau, data, descricao, cim]
        );
        updateCount++;
      } else {
        // Cria novo grau
        await pool.query(
          `INSERT INTO ${tabela} (cim, grau_simbolico, data_grau_simbolico, descricao) VALUES ($1, $2, $3, $4)`,
          [cim, grau, data, descricao]
        );
        createCount++;
      }
    }

    let message;
    if (updateCount > 0 && createCount > 0) {
      message = 'Graus simbólicos atualizados e cadastrados com sucesso.';
    } else if (updateCount > 0) {
      message = 'Graus simbólicos atualizados com sucesso.';
    } else if (createCount > 0) {
      message = 'Graus simbólicos cadastrados com sucesso.';
    } else {
      message = 'Nenhuma alteração feita nos graus simbólicos.';
    }

    return res.status(201).json({ message });
  } catch (error) {
    logger.error('Erro no servidor:', error);
    res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.', error: error.message }] });
  }
}; */





/*import pool from '../config/dbpostgresql.js';
import { logger } from '../middleware/logger.js';

export const createOrUpdateSimbolicos = async (req, res) => {
  const { cim, graus_simbolicos } = req.body;

  // Verificação de propriedade ou se é um administrador
  if (req.user.cim != cim && !req.user.is_admin) {
    logger.warn('Acesso negado. Tentativa de modificar dados de outro usuário.');
    return res.status(403).json({ error: 'Acesso negado. Você só pode modificar seus próprios dados.' });
  }

  try {
    let updateCount = 0;
    let createCount = 0;

    for (const grau_simbolico of graus_simbolicos) {
      const { grau, data, descricao } = grau_simbolico; // `cim` é usado como identificador único
      let tabela;
      if (grau === 'Aprendiz Maçom') {
        tabela = 'iniciacao';
      } else if (grau === 'Companheiro Maçom') {
        tabela = 'elevacao';
      } else if (grau === 'Mestre Maçom') {
        tabela = 'exaltacao';
      } else {
        continue; // Ignora graus inválidos
      }

      // Verifica se o grau já existe para este membro pelo `cim` e `grau`
      const existingGrau = await pool.query(`SELECT * FROM ${tabela} WHERE cim = $1 AND grau_simbolico = $2`, [cim, grau]);
      if (existingGrau.rows.length > 0) {
        // Atualiza grau existente
        await pool.query(
          `UPDATE ${tabela} SET data_grau_simbolico = $1, descricao = $2 WHERE cim = $3 AND grau_simbolico = $4`,
          [data, descricao, cim, grau]
        );
        updateCount++;
      } else {
        // Cria novo grau
        await pool.query(
          `INSERT INTO ${tabela} (cim, grau_simbolico, data_grau_simbolico, descricao) VALUES ($1, $2, $3, $4) RETURNING *`,
          [cim, grau, data, descricao]
        );
        createCount++;
      }
    }

    let message = 'Graus simbólicos atualizados e cadastrados com sucesso';
    //let message;
    if (updateCount > 0 && createCount > 0) {
      message = 'Graus simbólicos atualizados e cadastrados com sucesso.';
    } else if (updateCount > 0) {
      message = 'Graus simbólicos atualizados com sucesso.';
    } else if (createCount > 0) {
      message = 'Graus simbólicos cadastrados com sucesso.';
    } else {
      message = 'Nenhuma alteração feita nos graus simbólicos.';
    }

    return res.status(201).json({ message });
  } catch (error) {
    logger.error('Erro no servidor:', error);
    res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.', error: error.message }] });
  }
}; */




import pool from '../config/dbpostgresql.js';
import { logger } from '../middleware/logger.js';

export const createOrUpdateSimbolicos = async (req, res) => {
  const { cim, graus_simbolicos } = req.body;

  if (req.user.cim !== cim && !req.user.is_admin) {
    logger.warn('Acesso negado. Tentativa de modificar dados de outro usuário.');
    return res.status(403).json({ error: 'Acesso negado. Você só pode modificar seus próprios dados.' });
  }

  try {
    let updateCount = 0;
    let createCount = 0;

    for (const grau_simbolico of graus_simbolicos) {
      const { grau, data, descricao } = grau_simbolico;
      let tabela;
      if (grau === 'Aprendiz Maçom') {
        tabela = 'iniciacao';
      } else if (grau === 'Companheiro Maçom') {
        tabela = 'elevacao';
      } else if (grau === 'Mestre Maçom') {
        tabela = 'exaltacao';
      } else {
        continue;
      }

      const existingGrau = await pool.query(`SELECT * FROM ${tabela} WHERE cim = $1 AND grau_simbolico = $2`, [cim, grau]);
      if (existingGrau.rows.length > 0) {
        // Atualiza grau existente
        await pool.query(
          `UPDATE ${tabela} SET data_grau_simbolico = $1, descricao = $2 WHERE cim = $3 AND grau_simbolico = $4`,
          [data, descricao, cim, grau]
        );
        updateCount++;
      } else {
        // Cria novo grau
        await pool.query(
          `INSERT INTO ${tabela} (cim, grau_simbolico, data_grau_simbolico, descricao) VALUES ($1, $2, $3, $4) RETURNING *`,
          [cim, grau, data, descricao]
        );
        createCount++;
      }
    }

    let message;
    if (updateCount > 0 && createCount > 0) {
      message = 'Graus simbólicos atualizados e cadastrados com sucesso.';
    } else if (updateCount > 0) {
      message = 'Graus simbólicos atualizados com sucesso.';
    } else if (createCount > 0) {
      message = 'Graus simbólicos cadastrados com sucesso.';
    } else {
      message = 'Nenhuma alteração feita nos graus simbólicos.';
    }

    // Log para depuração
    logger.info(`Mensagem de sucesso enviada: ${message}`);

    return res.status(201).json({ message });
  } catch (error) {
    logger.error('Erro no servidor:', error);
    return res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.', error: error.message }] });
  }
};

