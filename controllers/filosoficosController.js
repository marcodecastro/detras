import pool from '../config/dbpostgresql.js';
import { logger } from '../middleware/logger.js';

export const createOrUpdateFilosoficos = async (req, res) => {
  const { cim, graus_filosoficos } = req.body;

  // Verificação de propriedade ou se é um administrador
  if (req.user.cim != cim && !req.user.is_admin) {
    logger.warn('Acesso negado. Tentativa de modificar dados de outro usuário.');
    return res.status(403).json({ error: 'Acesso negado. Você só pode modificar seus próprios dados.' });
  }

  try {
    let updateCount = 0;
    let createCount = 0;

    for (const grau_filosofico of graus_filosoficos) {
      const { grau, data, descricao } = grau_filosofico;
      let tabela;

      // Mapeia os graus para as tabelas correspondentes
      if (grau.includes('Mestre Secreto')) {
        tabela = 'mestre_secreto';
      } else if (grau.includes('Primeiro Eleito ou Eleito dos Nove')) {
        tabela = 'primeiro_eleito_ou_eleito_dos_nove';
      } else if (grau.includes('Mestre Escocês ou Grão-Mestre Arquiteto')) {
        tabela = 'mestre_escoces_ou_grao_mestre_arquiteto';
      } else if (grau.includes('Grande Eleito ou Perfeito e Sublime Maçom')) {
        tabela = 'grande_eleito_ou_perfeito_e_sublime_macom';
      } else if (grau.includes('Cavaleiro do Oriente, da Espada ou da Águia')) {
        tabela = 'cavaleiro_do_oriente_da_espada_ou_da_aguia';
      } else if (grau.includes('Cavaleiro Rosa-Cruz')) {
        tabela = 'cavaleiro_rosa_cruz';
      } else if (grau.includes('Cavaleiro Noaquita ou Cavaleiro Prussiano')) {
        tabela = 'cavaleiro_noaquita_ou_cavaleiro_prussiano';
      } else if (grau.includes('Cavaleiro do Real Machado ou Príncipe do Líbano')) {
        tabela = 'cavaleiro_do_real_machado_ou_principe_do_libano';
      } else if (grau.includes('Cavaleiro de Santo André')) {
        tabela = 'cavaleiro_de_santo_andre';
      } else if (grau.includes('Cavaleiro Kadosch')) {
        tabela = 'cavaleiro_kadosch';
      } else if (grau.includes('Sublime Iniciado e Grande Preceptor')) {
        tabela = 'sublime_iniciado_e_grande_preceptor';
      } else if (grau.includes('Prelado Corregedor e Ouvidor Geral')) {
        tabela = 'prelado_corregedor_e_ouvidor_geral';
      } else if (grau.includes('Patriarca Inspetor-Geral')) {
        tabela = 'patriarca_inspetor_geral';
      } else {
        continue; // Ignora graus inválidos
      }

      const isoDate = new Date(data).toISOString().split('T')[0];

      const existingGrau = await pool.query(`SELECT * FROM ${tabela} WHERE cim = $1`, [cim]);
      if (existingGrau.rows.length > 0) {
        // Atualiza grau existente
        await pool.query(
          `UPDATE ${tabela} SET graus_filosoficos = $1, data_graus_filosoficos = $2, descricao = $3 WHERE cim = $4`,
          [grau, isoDate, descricao, cim]
        );
        updateCount++;
      } else {
        // Cria novo grau
        await pool.query(
          `INSERT INTO ${tabela} (cim, graus_filosoficos, data_graus_filosoficos, descricao) VALUES ($1, $2, $3, $4)`,
          [cim, grau, isoDate, descricao]
        );
        createCount++;
      }
    }

    let message;
    if (updateCount > 0 && createCount > 0) {
      message = 'Graus filosóficos atualizados e cadastrados com sucesso.';
    } else if (updateCount > 0) {
      message = 'Graus filosóficos atualizados com sucesso.';
    } else if (createCount > 0) {
      message = 'Graus filosóficos cadastrados com sucesso.';
    } else {
      message = 'Nenhuma alteração feita nos graus filosóficos.';
    }

    logger.info('Operação bem-sucedida para CIM:', cim);
    return res.status(201).json({ message });
  } catch (error) {
    logger.error('Erro ao processar graus filosóficos:', error.message);
    res.status(500).json({ errors: [{ msg: 'Erro ao processar a solicitação. Por favor, tente novamente mais tarde.' }] });
  }
};
