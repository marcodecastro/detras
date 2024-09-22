import pool from '../config/dbpostgresql.js';

export const fetchComemoracoes = async (req, res) => {
    try {
        const today = new Date();
        const offset = today.getTimezoneOffset();
        const todayUTC = new Date(today.getTime() - (offset * 60 * 1000));
        const month = todayUTC.getMonth() + 1; // Mês começa do zero
        const day = todayUTC.getDate();
        const year = todayUTC.getFullYear();

        const query = `
            SELECT 
                CASE 
                    WHEN c.tabela = 'esposa' THEN e.nome || ' esposa de ' || m.nome || ' Nascida em, ' || TO_CHAR(e.data_nascimento, 'DD-MM-YYYY') || ' ' || COALESCE(c.descricao, '') || ' faz ' || EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.data_nascimento)) || ' anos hoje.'
                    WHEN c.tabela = 'filhos' THEN f.nome || ' filho(a) de ' || m.nome || ' Nascido(a) em, ' || TO_CHAR(f.data_nascimento, 'DD-MM-YYYY') || ' ' || COALESCE(c.descricao, '') || ' faz ' || EXTRACT(YEAR FROM AGE(CURRENT_DATE, f.data_nascimento)) || ' anos hoje.'
                    WHEN c.tabela = 'casamento' THEN m.nome || ' casou-se em, ' || TO_CHAR(c.data_comemorativa, 'DD-MM-YYYY') || ' com ' || c.nome_conjuge || ' faz ' || EXTRACT(YEAR FROM AGE(CURRENT_DATE, c.data_comemorativa)) || ' anos hoje.'
                    ELSE m.nome || ' ' || 
                        CASE 
                            WHEN c.tabela = 'iniciacao' THEN 'Iniciado em, ' 
                            WHEN c.tabela = 'elevacao' THEN 'Elevado em, ' 
                            WHEN c.tabela = 'exaltacao' THEN 'Exaltado em, ' 
                            WHEN c.tabela = 'mestre_maçom_da_marca' THEN 'Elevado Mestre Maçom da Marca em, '
                            WHEN c.tabela = 'nautas_da_arca_real' THEN 'Elevado Nautas da Arca Real em, '
                            WHEN c.tabela = 'arco_real' THEN 'Elevado no Arco Real em, '
                            WHEN c.tabela = 'cavaleiro_templario' THEN 'Armado Cavaleiro Templário em, '
                            WHEN c.tabela = 'cavaleiro_de_malta' THEN 'Armado Cavaleiro de Malta em, '
                            WHEN c.tabela = 'mestre_secreto' THEN 'Elevado Mestre Secreto em, '
                            WHEN c.tabela = 'primeiro_eleito_ou_eleito_dos_nove' THEN 'Elevado Primeiro Eleito ou Eleito dos Nove em, '
                            WHEN c.tabela = 'mestre_escoces_ou_grao_mestre_arquiteto' THEN 'Elevado Mestre Escocês ou Grande Arquiteto em, '
                            WHEN c.tabela = 'grande_eleito_ou_perfeito_e_sublime_macom' THEN 'Elevado Grande Eleito ou Perfeito e Sublime Maçom em, '
                            WHEN c.tabela = 'cavaleiro_do_oriente_da_espada_ou_da_aguia' THEN 'Elevado Cavaleiro do Oriente da Espada ou da Águia em, '
                            WHEN c.tabela = 'cavaleiro_rosa_cruz' THEN 'Elevado Cavaleiro Rosa Cruz em, '
                            WHEN c.tabela = 'cavaleiro_noaquita_ou_cavaleiro_prussiano' THEN 'Elevado Cavaleiro Noaquita ou Cavaleiro Prussiano em, '
                            WHEN c.tabela = 'cavaleiro_do_real_machado_ou_príncipe_do_libano' THEN 'Elevado Cavaleiro do Real Machado ou Príncipe do Líbano em, '
                            WHEN c.tabela = 'cavaleiro_de_santo_andre' THEN 'Elevado Cavaleiro de Santo André em, '
                            WHEN c.tabela = 'cavaleiro_kadosch' THEN 'Elevado Cavaleiro Kadosh em, '
                            WHEN c.tabela = 'sublime_iniciado_e_grande_preceptor' THEN 'Elevado Sublime Iniciado e Grande Preceptor em, '
                            WHEN c.tabela = 'prelado_corregedor_e_ouvidor_geral' THEN 'Elevado Prelado Corregedor e Ouvidor Geral em, '
                            WHEN c.tabela = 'patriarca_inspetor_geral' THEN 'Elevado Patriarca Inspecor Geral em, '
                            WHEN c.tabela = 'instalacao' THEN 'Instalado em, '
                            WHEN c.tabela = 'reassuncao' THEN 'Reassumiu em, '
                            WHEN c.tabela = 'benemerito_ordem' THEN 'Condecorado Benemérito da Ordem em, '
                            WHEN c.tabela = 'grande_benemerito_ordem' THEN 'Condecorado Grande Benemérito da Ordem em, '
                            WHEN c.tabela = 'estrela_distincao_maconica' THEN 'Condecorado com a Estrela da Distinção Maçônica em, '
                            WHEN c.tabela = 'cruz_perfeicao_maconica' THEN 'Condecorado com a Cruz da Perfeição Maçônica em, '
                            WHEN c.tabela = 'comenda_ordem_merito_d_pedro' THEN 'Condecorado com a Comenda da Ordem do Mérito D. Pedro em, '
                            WHEN c.tabela = 'recruta' THEN 'Instalado em, '
                            WHEN c.tabela = 'cavaleiro_de_santa_cruz' THEN 'Ordenado em, '
                            WHEN c.tabela = 'mestre_de_marca' THEN 'Adiantado Mestre de Marca em, '
                            WHEN c.tabela = 'past_master' THEN 'Induzido à cadeira do Oriente Past Master em, '
                            WHEN c.tabela = 'mui_excelente_mestre' THEN 'Recebido e Reconhecido Mui Excelente Mestre em, '
                            WHEN c.tabela = 'maçom_do_real_arco' THEN 'Exaltado Maçom do Real Arco em, '
                            WHEN c.tabela = 'mestre_real' THEN 'Exaltado Mestre Real em, '
                            WHEN c.tabela = 'mestre_eleito' THEN 'Exaltado Mestre Eleito em, '
                            WHEN c.tabela = 'super_excelente_mestre' THEN 'Exaltado Super Excelente Mestre em, '
                            WHEN c.tabela = 'ordem_da_cruz_vermelha' THEN 'Investido à Ordem da Cruz Vermelha em, '
                            WHEN c.tabela = 'ordem_de_malta' THEN 'Investido à Ordem de Malta em, '
                            WHEN c.tabela = 'ordem_do_templo' THEN 'Investido à Ordem do Templo em, '
                            WHEN c.tabela = 'membro' THEN 'Nascido em, '
                            WHEN c.tabela = 'filhos' THEN 'Filho(a) Nascido em, '
                            WHEN c.tabela = 'casamento' THEN 'Casamento em, '
                        END || 
                        TO_CHAR(c.data_comemorativa, 'DD-MM-YYYY') || ' ' || COALESCE(c.descricao, '') || ' faz ' || 
                        EXTRACT(YEAR FROM AGE(CURRENT_DATE, c.data_comemorativa)) || ' anos hoje.'
                END AS detalhes_completos
            FROM (
                SELECT 'iniciacao' AS tabela, cim, data_grau_simbolico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM iniciacao
                WHERE EXTRACT(DAY FROM data_grau_simbolico) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_grau_simbolico) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'elevacao' AS tabela, cim, data_grau_simbolico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM elevacao
                WHERE EXTRACT(DAY FROM data_grau_simbolico) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_grau_simbolico) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'exaltacao' AS tabela, cim, data_grau_simbolico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM exaltacao
                WHERE EXTRACT(DAY FROM data_grau_simbolico) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_grau_simbolico) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'mestre_maçom_da_marca' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_maçom_da_marca
                WHERE EXTRACT(DAY FROM data_graus_adicionais) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_adicionais) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'nautas_da_arca_real' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM nautas_da_arca_real
                WHERE EXTRACT(DAY FROM data_graus_adicionais) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_adicionais) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'arco_real' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM arco_real
                WHERE EXTRACT(DAY FROM data_graus_adicionais) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_adicionais) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_templario' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_templario
                WHERE EXTRACT(DAY FROM data_graus_adicionais) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_adicionais) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_de_malta' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_de_malta
                WHERE EXTRACT(DAY FROM data_graus_adicionais) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_adicionais) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'mestre_secreto' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_secreto
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'primeiro_eleito_ou_eleito_dos_nove' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM primeiro_eleito_ou_eleito_dos_nove
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'mestre_escoces_ou_grao_mestre_arquiteto' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_escoces_ou_grao_mestre_arquiteto
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'grande_eleito_ou_perfeito_e_sublime_macom' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM grande_eleito_ou_perfeito_e_sublime_macom
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_do_oriente_da_espada_ou_da_aguia' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_do_oriente_da_espada_ou_da_aguia
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_rosa_cruz' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_rosa_cruz
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_noaquita_ou_cavaleiro_prussiano' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_noaquita_ou_cavaleiro_prussiano
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_do_real_machado_ou_príncipe_do_libano' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_do_real_machado_ou_príncipe_do_libano
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_de_santo_andre' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_de_santo_andre
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_kadosch' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_kadosch
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'sublime_iniciado_e_grande_preceptor' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM sublime_iniciado_e_grande_preceptor
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'prelado_corregedor_e_ouvidor_geral' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM prelado_corregedor_e_ouvidor_geral
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'patriarca_inspetor_geral' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM patriarca_inspetor_geral
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'instalacao' AS tabela, cim, data_titulo_distintivo AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM instalacao
                WHERE EXTRACT(DAY FROM data_titulo_distintivo) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_titulo_distintivo) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'reassuncao' AS tabela, cim, data_titulo_distintivo AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM reassuncao
                WHERE EXTRACT(DAY FROM data_titulo_distintivo) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_titulo_distintivo) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'benemerito_ordem' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM benemerito_ordem
                WHERE EXTRACT(DAY FROM data_titulo_condecoracoes) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_titulo_condecoracoes) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'grande_benemerito_ordem' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM grande_benemerito_ordem
                WHERE EXTRACT(DAY FROM data_titulo_condecoracoes) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_titulo_condecoracoes) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'estrela_distincao_maconica' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM estrela_distincao_maconica
                WHERE EXTRACT(DAY FROM data_titulo_condecoracoes) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_titulo_condecoracoes) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cruz_perfeicao_maconica' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cruz_perfeicao_maconica
                WHERE EXTRACT(DAY FROM data_titulo_condecoracoes) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_titulo_condecoracoes) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'comenda_ordem_merito_d_pedro' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM comenda_ordem_merito_d_pedro
                WHERE EXTRACT(DAY FROM data_titulo_condecoracoes) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_titulo_condecoracoes) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'recruta' AS tabela, cim, data_graus_apostolado AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM recruta
                WHERE EXTRACT(DAY FROM data_graus_apostolado) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_apostolado) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_de_santa_cruz' AS tabela, cim, data_graus_apostolado AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_de_santa_cruz
                WHERE EXTRACT(DAY FROM data_graus_apostolado) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_apostolado) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'mestre_de_marca' AS tabela, cim, data_graus_capitulorealarco AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_de_marca
                WHERE EXTRACT(DAY FROM data_graus_capitulorealarco) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_capitulorealarco) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'past_master' AS tabela, cim, data_graus_capitulorealarco AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM past_master
                WHERE EXTRACT(DAY FROM data_graus_capitulorealarco) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_capitulorealarco) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'mui_excelente_mestre' AS tabela, cim, data_graus_capitulorealarco AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mui_excelente_mestre
                WHERE EXTRACT(DAY FROM data_graus_capitulorealarco) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_capitulorealarco) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'maçom_do_real_arco' AS tabela, cim, data_graus_capitulorealarco AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM maçom_do_real_arco
                WHERE EXTRACT(DAY FROM data_graus_capitulorealarco) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_capitulorealarco) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'mestre_real' AS tabela, cim, data_graus_conselhocriptico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_real
                WHERE EXTRACT(DAY FROM data_graus_conselhocriptico) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_conselhocriptico) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'mestre_eleito' AS tabela, cim, data_graus_conselhocriptico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_eleito
                WHERE EXTRACT(DAY FROM data_graus_conselhocriptico) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_conselhocriptico) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'super_excelente_mestre' AS tabela, cim, data_graus_conselhocriptico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM super_excelente_mestre
                WHERE EXTRACT(DAY FROM data_graus_conselhocriptico) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_conselhocriptico) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'ordem_da_cruz_vermelha' AS tabela, cim, data_graus_comanderia AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM ordem_da_cruz_vermelha
                WHERE EXTRACT(DAY FROM data_graus_comanderia) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_comanderia) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'ordem_de_malta' AS tabela, cim, data_graus_comanderia AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM ordem_de_malta
                WHERE EXTRACT(DAY FROM data_graus_comanderia) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_comanderia) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'ordem_do_templo' AS tabela, cim, data_graus_comanderia AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM ordem_do_templo
                WHERE EXTRACT(DAY FROM data_graus_comanderia) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_graus_comanderia) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'membro' AS tabela, cim, data_nascimento AS data_comemorativa, NULL as descricao, NULL as nome_conjuge
                FROM membro
                WHERE EXTRACT(DAY FROM data_nascimento) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_nascimento) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'esposa' AS tabela, cim, data_nascimento AS data_comemorativa, NULL as descricao, NULL as nome_conjuge
                FROM esposa
                WHERE EXTRACT(DAY FROM data_nascimento) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_nascimento) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'filhos' AS tabela, cim, data_nascimento AS data_comemorativa, NULL as descricao, NULL as nome_conjuge
                FROM filhos
                WHERE EXTRACT(DAY FROM data_nascimento) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_nascimento) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'casamento' AS tabela, cim, data_casamento AS data_comemorativa, NULL as descricao, nome_conjuge
                FROM casamento
                WHERE EXTRACT(DAY FROM data_casamento) = EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM data_casamento) = EXTRACT(MONTH FROM CURRENT_DATE)
            ) c
            JOIN membro m ON c.cim = m.cim
            LEFT JOIN esposa e ON c.cim = e.cim AND c.tabela = 'esposa'
            LEFT JOIN filhos f ON c.cim = f.cim AND c.tabela = 'filhos';
        `;

        const { rows } = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar comemorações:', error);
        res.status(500).json({ message: 'Erro ao buscar comemorações' });
    }
}; 


export const fetchComemoracoesSemana = async (req, res) => {
    try {
        const today = new Date();
        const offset = today.getTimezoneOffset();
        const todayUTC = new Date(today.getTime() - (offset * 60 * 1000));
        const month = todayUTC.getMonth() + 1; 
        const day = todayUTC.getDate();
        const year = todayUTC.getFullYear();

        const query = `
            SELECT 
                CASE 
                    WHEN c.tabela = 'esposa' THEN e.nome || ' esposa de ' || m.nome || ' Nascida em, ' || TO_CHAR(e.data_nascimento, 'DD-MM-YYYY') || ' ' || COALESCE(c.descricao, '') || ' faz ' || EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.data_nascimento)) || ' anos esta semana.'
                    WHEN c.tabela = 'filhos' THEN f.nome || ' filho(a) de ' || m.nome || ' Nascido(a) em, ' || TO_CHAR(f.data_nascimento, 'DD-MM-YYYY') || ' ' || COALESCE(c.descricao, '') || ' faz ' || EXTRACT(YEAR FROM AGE(CURRENT_DATE, f.data_nascimento)) || ' anos esta semana.'
                    WHEN c.tabela = 'casamento' THEN m.nome || ' Casamento em, ' || TO_CHAR(c.data_comemorativa, 'DD-MM-YYYY') || ' com ' || c.nome_conjuge || ' faz ' || EXTRACT(YEAR FROM AGE(CURRENT_DATE, c.data_comemorativa)) || ' anos esta semana.'
                    ELSE m.nome || ' ' || 
                        CASE 
                            WHEN c.tabela = 'iniciacao' THEN 'Iniciado em, ' 
                            WHEN c.tabela = 'elevacao' THEN 'Elevado em, ' 
                            WHEN c.tabela = 'exaltacao' THEN 'Exaltado em, ' 
                            WHEN c.tabela = 'mestre_maçom_da_marca' THEN 'Elevado Mestre Maçom da Marca em, '
                            WHEN c.tabela = 'nautas_da_arca_real' THEN 'Elevado Nautas da Arca Real em, '
                            WHEN c.tabela = 'arco_real' THEN 'Elevado no Arco Real em, '
                            WHEN c.tabela = 'cavaleiro_templario' THEN 'Armado Cavaleiro Templário em, '
                            WHEN c.tabela = 'cavaleiro_de_malta' THEN 'Armado Cavaleiro de Malta em, '
                            WHEN c.tabela = 'mestre_secreto' THEN 'Elevado Mestre Secreto em, '
                            WHEN c.tabela = 'primeiro_eleito_ou_eleito_dos_nove' THEN 'Elevado Primeiro Eleito ou Eleito dos Nove em, '
                            WHEN c.tabela = 'mestre_escoces_ou_grao_mestre_arquiteto' THEN 'Elevado Mestre Escocês ou Grande Arquiteto em, '
                            WHEN c.tabela = 'grande_eleito_ou_perfeito_e_sublime_macom' THEN 'Elevado Grande Eleito ou Perfeito e Sublime Maçom em, '
                            WHEN c.tabela = 'cavaleiro_do_oriente_da_espada_ou_da_aguia' THEN 'Elevado Cavaleiro do Oriente da Espada ou da Águia em, '
                            WHEN c.tabela = 'cavaleiro_rosa_cruz' THEN 'Elevado Cavaleiro Rosa Cruz em, '
                            WHEN c.tabela = 'cavaleiro_noaquita_ou_cavaleiro_prussiano' THEN 'Elevado Cavaleiro Noaquita ou Cavaleiro Prussiano em, '
                            WHEN c.tabela = 'cavaleiro_do_real_machado_ou_príncipe_do_libano' THEN 'Elevado Cavaleiro do Real Machado ou Príncipe do Líbano em, '
                            WHEN c.tabela = 'cavaleiro_de_santo_andre' THEN 'Elevado Cavaleiro de Santo André em, '
                            WHEN c.tabela = 'cavaleiro_kadosch' THEN 'Elevado Cavaleiro Kadosh em, '
                            WHEN c.tabela = 'sublime_iniciado_e_grande_preceptor' THEN 'Elevado Sublime Iniciado e Grande Preceptor em, '
                            WHEN c.tabela = 'prelado_corregedor_e_ouvidor_geral' THEN 'Elevado Prelado Corregedor e Ouvidor Geral em, '
                            WHEN c.tabela = 'patriarca_inspetor_geral' THEN 'Elevado Patriarca Inspecor Geral em, '
                            WHEN c.tabela = 'instalacao' THEN 'Instalado em, '
                            WHEN c.tabela = 'reassuncao' THEN 'Reassumiu em, '
                            WHEN c.tabela = 'benemerito_ordem' THEN 'Condecorado Benemérito da Ordem em, '
                            WHEN c.tabela = 'grande_benemerito_ordem' THEN 'Condecorado Grande Benemérito da Ordem em, '
                            WHEN c.tabela = 'estrela_distincao_maconica' THEN 'Condecorado com a Estrela da Distinção Maçônica em, '
                            WHEN c.tabela = 'cruz_perfeicao_maconica' THEN 'Condecorado com a Cruz da Perfeição Maçônica em, '
                            WHEN c.tabela = 'comenda_ordem_merito_d_pedro' THEN 'Condecorado com a Comenda da Ordem do Mérito D. Pedro em, '
                            WHEN c.tabela = 'recruta' THEN 'Instalado em, '
                            WHEN c.tabela = 'cavaleiro_de_santa_cruz' THEN 'Ordenado em, '
                            WHEN c.tabela = 'mestre_de_marca' THEN 'Adiantado Mestre de Marca em, '
                            WHEN c.tabela = 'past_master' THEN 'Induzido à cadeira do Oriente Past Master em, '
                            WHEN c.tabela = 'mui_excelente_mestre' THEN 'Recebido e Reconhecido Mui Excelente Mestre em, '
                            WHEN c.tabela = 'maçom_do_real_arco' THEN 'Exaltado Maçom do Real Arco em, '
                            WHEN c.tabela = 'mestre_real' THEN 'Exaltado Mestre Real em, '
                            WHEN c.tabela = 'mestre_eleito' THEN 'Exaltado Mestre Eleito em, '
                            WHEN c.tabela = 'super_excelente_mestre' THEN 'Exaltado Super Excelente Mestre em, '
                            WHEN c.tabela = 'ordem_da_cruz_vermelha' THEN 'Investido à Ordem da Cruz Vermelha em, '
                            WHEN c.tabela = 'ordem_de_malta' THEN 'Investido à Ordem de Malta em, '
                            WHEN c.tabela = 'ordem_do_templo' THEN 'Investido à Ordem do Templo em, '
                            WHEN c.tabela = 'membro' THEN 'Nascido em, '
                            WHEN c.tabela = 'filhos' THEN 'Filho(a) Nascido em, '
                            WHEN c.tabela = 'casamento' THEN 'Casamento em, '
                        END || 
                        TO_CHAR(c.data_comemorativa, 'DD-MM-YYYY') || ' ' || COALESCE(c.descricao, '') || ' faz ' || 
                        EXTRACT(YEAR FROM AGE(CURRENT_DATE, c.data_comemorativa)) || ' anos esta semana.'
                END AS detalhes_completos
            FROM (
                SELECT 'iniciacao' AS tabela, cim, data_grau_simbolico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM iniciacao
                WHERE EXTRACT(DAY FROM data_grau_simbolico) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_grau_simbolico) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_grau_simbolico) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'elevacao' AS tabela, cim, data_grau_simbolico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM elevacao
                WHERE EXTRACT(DAY FROM data_grau_simbolico) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_grau_simbolico) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_grau_simbolico) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'exaltacao' AS tabela, cim, data_grau_simbolico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM exaltacao
                WHERE EXTRACT(DAY FROM data_grau_simbolico) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_grau_simbolico) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_grau_simbolico) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'mestre_maçom_da_marca' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_maçom_da_marca
                WHERE EXTRACT(DAY FROM data_graus_adicionais) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_adicionais) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_adicionais) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'nautas_da_arca_real' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM nautas_da_arca_real
                WHERE EXTRACT(DAY FROM data_graus_adicionais) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_adicionais) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_adicionais) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'arco_real' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM arco_real
                WHERE EXTRACT(DAY FROM data_graus_adicionais) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_adicionais) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_adicionais) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_templario' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_templario
                WHERE EXTRACT(DAY FROM data_graus_adicionais) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_adicionais) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_adicionais) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_de_malta' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_de_malta
                WHERE EXTRACT(DAY FROM data_graus_adicionais) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_adicionais) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_adicionais) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'mestre_secreto' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_secreto
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_filosoficos) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'primeiro_eleito_ou_eleito_dos_nove' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM primeiro_eleito_ou_eleito_dos_nove
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_filosoficos) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'mestre_escoces_ou_grao_mestre_arquiteto' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_escoces_ou_grao_mestre_arquiteto
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_filosoficos) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'grande_eleito_ou_perfeito_e_sublime_macom' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM grande_eleito_ou_perfeito_e_sublime_macom
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_filosoficos) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_do_oriente_da_espada_ou_da_aguia' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_do_oriente_da_espada_ou_da_aguia
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_filosoficos) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_rosa_cruz' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_rosa_cruz
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_filosoficos) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_noaquita_ou_cavaleiro_prussiano' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_noaquita_ou_cavaleiro_prussiano
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_filosoficos) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_do_real_machado_ou_príncipe_do_libano' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_do_real_machado_ou_príncipe_do_libano
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_filosoficos) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_de_santo_andre' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_de_santo_andre
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_filosoficos) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_kadosch' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_kadosch
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_filosoficos) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'sublime_iniciado_e_grande_preceptor' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM sublime_iniciado_e_grande_preceptor
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_filosoficos) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'prelado_corregedor_e_ouvidor_geral' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM prelado_corregedor_e_ouvidor_geral
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_filosoficos) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'patriarca_inspetor_geral' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM patriarca_inspetor_geral
                WHERE EXTRACT(DAY FROM data_graus_filosoficos) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_filosoficos) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_filosoficos) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'instalacao' AS tabela, cim, data_titulo_distintivo AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM instalacao
                WHERE EXTRACT(DAY FROM data_titulo_distintivo) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_titulo_distintivo) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_titulo_distintivo) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'reassuncao' AS tabela, cim, data_titulo_distintivo AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM reassuncao
                WHERE EXTRACT(DAY FROM data_titulo_distintivo) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_titulo_distintivo) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_titulo_distintivo) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'benemerito_ordem' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM benemerito_ordem
                WHERE EXTRACT(DAY FROM data_titulo_condecoracoes) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_titulo_condecoracoes) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_titulo_condecoracoes) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'grande_benemerito_ordem' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM grande_benemerito_ordem
                WHERE EXTRACT(DAY FROM data_titulo_condecoracoes) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_titulo_condecoracoes) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_titulo_condecoracoes) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'estrela_distincao_maconica' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM estrela_distincao_maconica
                WHERE EXTRACT(DAY FROM data_titulo_condecoracoes) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_titulo_condecoracoes) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_titulo_condecoracoes) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cruz_perfeicao_maconica' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cruz_perfeicao_maconica
                WHERE EXTRACT(DAY FROM data_titulo_condecoracoes) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_titulo_condecoracoes) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_titulo_condecoracoes) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'comenda_ordem_merito_d_pedro' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM comenda_ordem_merito_d_pedro
                WHERE EXTRACT(DAY FROM data_titulo_condecoracoes) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_titulo_condecoracoes) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_titulo_condecoracoes) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'recruta' AS tabela, cim, data_graus_apostolado AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM recruta
                WHERE EXTRACT(DAY FROM data_graus_apostolado) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_apostolado) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_apostolado) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'cavaleiro_de_santa_cruz' AS tabela, cim, data_graus_apostolado AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_de_santa_cruz
                WHERE EXTRACT(DAY FROM data_graus_apostolado) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_apostolado) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_apostolado) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'mestre_de_marca' AS tabela, cim, data_graus_capitulorealarco AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_de_marca
                WHERE EXTRACT(DAY FROM data_graus_capitulorealarco) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_capitulorealarco) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_capitulorealarco) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'past_master' AS tabela, cim, data_graus_capitulorealarco AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM past_master
                WHERE EXTRACT(DAY FROM data_graus_capitulorealarco) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_capitulorealarco) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_capitulorealarco) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'mui_excelente_mestre' AS tabela, cim, data_graus_capitulorealarco AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mui_excelente_mestre
                WHERE EXTRACT(DAY FROM data_graus_capitulorealarco) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_capitulorealarco) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_capitulorealarco) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'maçom_do_real_arco' AS tabela, cim, data_graus_capitulorealarco AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM maçom_do_real_arco
                WHERE EXTRACT(DAY FROM data_graus_capitulorealarco) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_capitulorealarco) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_capitulorealarco) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'mestre_real' AS tabela, cim, data_graus_conselhocriptico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_real
                WHERE EXTRACT(DAY FROM data_graus_conselhocriptico) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_conselhocriptico) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_conselhocriptico) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'mestre_eleito' AS tabela, cim, data_graus_conselhocriptico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_eleito
                WHERE EXTRACT(DAY FROM data_graus_conselhocriptico) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_conselhocriptico) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_conselhocriptico) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'super_excelente_mestre' AS tabela, cim, data_graus_conselhocriptico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM super_excelente_mestre
                WHERE EXTRACT(DAY FROM data_graus_conselhocriptico) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_conselhocriptico) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_conselhocriptico) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'ordem_da_cruz_vermelha' AS tabela, cim, data_graus_comanderia AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM ordem_da_cruz_vermelha
                WHERE EXTRACT(DAY FROM data_graus_comanderia) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_comanderia) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_comanderia) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'ordem_de_malta' AS tabela, cim, data_graus_comanderia AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM ordem_de_malta
                WHERE EXTRACT(DAY FROM data_graus_comanderia) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_comanderia) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_comanderia) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'ordem_do_templo' AS tabela, cim, data_graus_comanderia AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM ordem_do_templo
                WHERE EXTRACT(DAY FROM data_graus_comanderia) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_graus_comanderia) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_graus_comanderia) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'membro' AS tabela, cim, data_nascimento AS data_comemorativa, NULL as descricao, NULL as nome_conjuge
                FROM membro
                WHERE EXTRACT(DAY FROM data_nascimento) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_nascimento) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_nascimento) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'esposa' AS tabela, cim, data_nascimento AS data_comemorativa, NULL as descricao, NULL as nome_conjuge
                FROM esposa
                WHERE EXTRACT(DAY FROM data_nascimento) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_nascimento) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_nascimento) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'filhos' AS tabela, cim, data_nascimento AS data_comemorativa, NULL as descricao, NULL as nome_conjuge
                FROM filhos
                WHERE EXTRACT(DAY FROM data_nascimento) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_nascimento) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_nascimento) = EXTRACT(MONTH FROM CURRENT_DATE)

                UNION ALL

                SELECT 'casamento' AS tabela, cim, data_casamento AS data_comemorativa, NULL as descricao, nome_conjuge
                FROM casamento
                WHERE EXTRACT(DAY FROM data_casamento) > EXTRACT(DAY FROM CURRENT_DATE)
                AND EXTRACT(DAY FROM data_casamento) <= EXTRACT(DAY FROM CURRENT_DATE) + 6
                AND EXTRACT(MONTH FROM data_casamento) = EXTRACT(MONTH FROM CURRENT_DATE)
            ) c
            JOIN membro m ON c.cim = m.cim
            LEFT JOIN esposa e ON c.cim = e.cim AND c.tabela = 'esposa'
            LEFT JOIN filhos f ON c.cim = f.cim AND c.tabela = 'filhos';
        `;

        const { rows } = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar comemorações da semana:',  error);
        res.status(500).json({ message: 'Erro ao buscar comemorações da semana' });
    }
};


// Função para buscar comemorações brasileiras
export const fetchComemoracoesBrasil = async (req, res) => {
    try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;  // Mês atual (1-12)
        const currentDay = today.getDate();  // Dia atual (1-31)

        // Função para verificar se uma data está dentro dos próximos 7 dias
        const isWithinNext7Days = (month, day) => {
            const currentDate = new Date(today.getFullYear(), currentMonth - 1, currentDay);
            const targetDate = new Date(today.getFullYear(), month - 1, day);
            const diffTime = targetDate - currentDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays >= 0;
        };

        const { rows: data } = await pool.query('SELECT * FROM comemoracoes_brasil');

        //console.log('Dados brutos do banco de dados:', data);

        const result = [];
        data.forEach(monthData => {
            const comemoracoes = monthData.comemoracoes; // JSONB data já está em formato objeto
            comemoracoes.forEach(comemoracao => {
                if (isWithinNext7Days(monthData.id, comemoracao.dia)) {
                    const dataFormatada = `${String(comemoracao.dia).padStart(2, '0')}/${String(monthData.id).padStart(2, '0')}`;
                    result.push({
                        data_comemorativa: dataFormatada,
                        nome: comemoracao.nome
                    });
                  //console.log(`Adicionando comemoração: ${comemoracao.nome} na data: ${dataFormatada}`);
                }
            });
        });

        //console.log('Resultado final formatado:', result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Erro ao buscar comemorações brasileiras:', error);
        res.status(500).json({ message: 'Erro ao buscar comemorações brasileiras' });
    }
};