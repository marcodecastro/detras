import pool from '../config/dbpostgresql.js';  

// Função para buscar o perfil do membro autenticado com todas as comemorações e dados relevantes
export const getMemberProfile = async (req, res) => {
    const { cim } = req.user;  // Supondo que o middleware de autenticação já adiciona o CIM do membro ao req.user

    try {
        const query = `
            SELECT 
                m.nome,
                m.data_nascimento,
                m.email,
                m.celular,
                c.tabela,
                c.data_comemorativa,
                c.descricao,
                CASE 
                    WHEN c.tabela = 'esposa' THEN e.nome || ' esposa de ' || m.nome || ' nascida em ' || TO_CHAR(e.data_nascimento, 'DD-MM-YYYY') || ' faz ' || EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.data_nascimento)) || ' anos hoje.'
                    WHEN c.tabela = 'filhos' THEN f.nome || ' filho(a) de ' || m.nome || ' nascido(a) em ' || TO_CHAR(f.data_nascimento, 'DD-MM-YYYY') || ' faz ' || EXTRACT(YEAR FROM AGE(CURRENT_DATE, f.data_nascimento)) || ' anos hoje.'
                    WHEN c.tabela = 'casamento' THEN m.nome || ' casamento em ' || TO_CHAR(c.data_comemorativa, 'DD-MM-YYYY') || ' com ' || c.nome_conjuge || ' faz ' || EXTRACT(YEAR FROM AGE(CURRENT_DATE, c.data_comemorativa)) || ' anos hoje.'
                    WHEN c.tabela = 'iniciacao' THEN m.nome || ' Iniciado em ' || TO_CHAR(c.data_comemorativa, 'DD-MM-YYYY')
                    WHEN c.tabela = 'elevacao' THEN m.nome || ' Elevado em ' || TO_CHAR(c.data_comemorativa, 'DD-MM-YYYY')
                    WHEN c.tabela = 'exaltacao' THEN m.nome || ' Exaltado em ' || TO_CHAR(c.data_comemorativa, 'DD-MM-YYYY')
                    WHEN c.tabela = 'instalacao' THEN m.nome || ' Instalado em ' || TO_CHAR(c.data_comemorativa, 'DD-MM-YYYY')
                    WHEN c.tabela = 'reassuncao' THEN m.nome || ' Reconduzido em ' || TO_CHAR(c.data_comemorativa, 'DD-MM-YYYY')
                    WHEN c.tabela IN ('benemerito_ordem', 'grande_benemerito_ordem', 'estrela_distincao_maconica', 'cruz_perfeicao_maconica', 'comenda_ordem_merito_d_pedro') THEN 
                        m.nome || ' Condecorado em ' || TO_CHAR(c.data_comemorativa, 'DD-MM-YYYY') || ' com o título de "' ||
                        CASE
                            WHEN c.tabela = 'benemerito_ordem' THEN 'Benemérito da Ordem'
                            WHEN c.tabela = 'grande_benemerito_ordem' THEN 'Grande Benemérito da Ordem'
                            WHEN c.tabela = 'estrela_distincao_maconica' THEN 'Estrela da Distinção Maçônica'
                            WHEN c.tabela = 'cruz_perfeicao_maconica' THEN 'Cruz da Perfeição Maçônica'
                            WHEN c.tabela = 'comenda_ordem_merito_d_pedro' THEN 'Comenda da Ordem do Mérito D. Pedro'
                        END || '"'
                    ELSE m.nome || ' ' || COALESCE(c.descricao, '') || ' em ' || TO_CHAR(c.data_comemorativa, 'DD-MM-YYYY')
                END AS detalhes_completos
            FROM (
                SELECT 'iniciacao' AS tabela, cim, data_grau_simbolico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM iniciacao
                WHERE cim = $1

                UNION ALL

                SELECT 'elevacao' AS tabela, cim, data_grau_simbolico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM elevacao
                WHERE cim = $1

                UNION ALL

                SELECT 'exaltacao' AS tabela, cim, data_grau_simbolico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM exaltacao
                WHERE cim = $1

                UNION ALL

                SELECT 'mestre_maçom_da_marca' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_maçom_da_marca
                WHERE cim = $1

                UNION ALL

                SELECT 'nautas_da_arca_real' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM nautas_da_arca_real
                WHERE cim = $1

                UNION ALL

                SELECT 'arco_real' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM arco_real
                WHERE cim = $1

                UNION ALL

                SELECT 'cavaleiro_templario' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_templario
                WHERE cim = $1

                UNION ALL

                SELECT 'cavaleiro_de_malta' AS tabela, cim, data_graus_adicionais AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_de_malta
                WHERE cim = $1

                UNION ALL

                SELECT 'mestre_secreto' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_secreto
                WHERE cim = $1

                UNION ALL

                SELECT 'primeiro_eleito_ou_eleito_dos_nove' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM primeiro_eleito_ou_eleito_dos_nove
                WHERE cim = $1

                UNION ALL

                SELECT 'mestre_escoces_ou_grao_mestre_arquiteto' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_escoces_ou_grao_mestre_arquiteto
                WHERE cim = $1

                UNION ALL

                SELECT 'grande_eleito_ou_perfeito_e_sublime_macom' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM grande_eleito_ou_perfeito_e_sublime_macom
                WHERE cim = $1

                UNION ALL

                SELECT 'cavaleiro_do_oriente_da_espada_ou_da_aguia' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_do_oriente_da_espada_ou_da_aguia
                WHERE cim = $1

                UNION ALL

                SELECT 'cavaleiro_rosa_cruz' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_rosa_cruz
                WHERE cim = $1

                UNION ALL

                SELECT 'cavaleiro_noaquita_ou_cavaleiro_prussiano' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_noaquita_ou_cavaleiro_prussiano
                WHERE cim = $1

                UNION ALL

                SELECT 'cavaleiro_do_real_machado_ou_príncipe_do_libano' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_do_real_machado_ou_príncipe_do_libano
                WHERE cim = $1

                UNION ALL

                SELECT 'cavaleiro_de_santo_andre' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_de_santo_andre
                WHERE cim = $1

                UNION ALL

                SELECT 'cavaleiro_kadosch' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_kadosch
                WHERE cim = $1

                UNION ALL

                SELECT 'sublime_iniciado_e_grande_preceptor' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM sublime_iniciado_e_grande_preceptor
                WHERE cim = $1

                UNION ALL

                SELECT 'prelado_corregedor_e_ouvidor_geral' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM prelado_corregedor_e_ouvidor_geral
                WHERE cim = $1

                UNION ALL

                SELECT 'patriarca_inspetor_geral' AS tabela, cim, data_graus_filosoficos AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM patriarca_inspetor_geral
                WHERE cim = $1

                UNION ALL

                SELECT 'instalacao' AS tabela, cim, data_titulo_distintivo AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM instalacao
                WHERE cim = $1

                UNION ALL

                SELECT 'reassuncao' AS tabela, cim, data_titulo_distintivo AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM reassuncao
                WHERE cim = $1

                UNION ALL

                SELECT 'benemerito_ordem' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM benemerito_ordem
                WHERE cim = $1

                UNION ALL

                SELECT 'grande_benemerito_ordem' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM grande_benemerito_ordem
                WHERE cim = $1

                UNION ALL

                SELECT 'estrela_distincao_maconica' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM estrela_distincao_maconica
                WHERE cim = $1

                UNION ALL

                SELECT 'cruz_perfeicao_maconica' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cruz_perfeicao_maconica
                WHERE cim = $1

                UNION ALL

                SELECT 'comenda_ordem_merito_d_pedro' AS tabela, cim, data_titulo_condecoracoes AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM comenda_ordem_merito_d_pedro
                WHERE cim = $1

                UNION ALL

                SELECT 'recruta' AS tabela, cim, data_graus_apostolado AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM recruta
                WHERE cim = $1

                UNION ALL

                SELECT 'cavaleiro_de_santa_cruz' AS tabela, cim, data_graus_apostolado AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM cavaleiro_de_santa_cruz
                WHERE cim = $1

                UNION ALL

                SELECT 'mestre_de_marca' AS tabela, cim, data_graus_capitulorealarco AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_de_marca
                WHERE cim = $1

                UNION ALL

                SELECT 'past_master' AS tabela, cim, data_graus_capitulorealarco AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM past_master
                WHERE cim = $1

                UNION ALL

                SELECT 'mui_excelente_mestre' AS tabela, cim, data_graus_capitulorealarco AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mui_excelente_mestre
                WHERE cim = $1

                UNION ALL

                SELECT 'maçom_do_real_arco' AS tabela, cim, data_graus_capitulorealarco AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM maçom_do_real_arco
                WHERE cim = $1

                UNION ALL

                SELECT 'mestre_real' AS tabela, cim, data_graus_conselhocriptico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_real
                WHERE cim = $1

                UNION ALL

                SELECT 'mestre_eleito' AS tabela, cim, data_graus_conselhocriptico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM mestre_eleito
                WHERE cim = $1

                UNION ALL

                SELECT 'super_excelente_mestre' AS tabela, cim, data_graus_conselhocriptico AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM super_excelente_mestre
                WHERE cim = $1

                UNION ALL

                SELECT 'ordem_da_cruz_vermelha' AS tabela, cim, data_graus_comanderia AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM ordem_da_cruz_vermelha
                WHERE cim = $1

                UNION ALL

                SELECT 'ordem_de_malta' AS tabela, cim, data_graus_comanderia AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM ordem_de_malta
                WHERE cim = $1

                UNION ALL

                SELECT 'ordem_do_templo' AS tabela, cim, data_graus_comanderia AS data_comemorativa, descricao, NULL as nome_conjuge
                FROM ordem_do_templo
                WHERE cim = $1

                UNION ALL

                SELECT 'esposa' AS tabela, cim, data_nascimento AS data_comemorativa, NULL as descricao, NULL as nome_conjuge
                FROM esposa
                WHERE cim = $1

                UNION ALL

                SELECT 'filhos' AS tabela, cim, data_nascimento AS data_comemorativa, NULL as descricao, NULL as nome_conjuge
                FROM filhos
                WHERE cim = $1

                UNION ALL

                SELECT 'casamento' AS tabela, cim, data_casamento AS data_comemorativa, NULL as descricao, nome_conjuge
                FROM casamento
                WHERE cim = $1
            ) c
            JOIN membro m ON c.cim = m.cim
            LEFT JOIN esposa e ON c.cim = e.cim AND c.tabela = 'esposa'
            LEFT JOIN filhos f ON c.cim = f.cim AND c.tabela = 'filhos';
        `;

        const { rows } = await pool.query(query, [cim]);

        // Agrupando os resultados em diferentes categorias
        const member = rows.length > 0 ? {
            nome: rows[0].nome,
            data_nascimento: rows[0].data_nascimento,
            email: rows[0].email,
            celular: rows[0].celular,
        } : {};

        const comemoracoes = rows.map(row => ({
            descricao: row.detalhes_completos
        }));

        res.status(200).json({ member, comemoracoes, eventos: [] }); // Aqui eventos pode ser ajustado se você tiver eventos em outra query
    } catch (error) {
        console.error('Erro ao buscar perfil do membro:', error);
        res.status(500).json({ message: 'Erro ao buscar perfil do membro' });
    }
};



