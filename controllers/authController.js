import pool from '../config/dbpostgresql.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Registro de membro
export const registerMembro = async (req, res) => {
  const { nome, cim, senha, data_nascimento, email, celular } = req.body;

  try {
    // Verificar se o email ou CIM já existem
    const existingUser = await pool.query('SELECT * FROM membro WHERE email = $1 OR cim = $2', [email, cim]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ errors: [{ msg: 'Email ou CIM já estão em uso.' }] });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha, 10);
    const newMembro = await pool.query(
      'INSERT INTO membro (nome, cim, data_nascimento, email, celular, senha) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, cim, data_nascimento, email, celular, hashedPassword]
    );

    // Gerar o token JWT
    const token = jwt.sign(
      { id: newMembro.rows[0].id, cim: newMembro.rows[0].cim, is_admin: newMembro.rows[0].is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Retornar a resposta com o token
    res.status(201).json({ message: 'Membro cadastrado com sucesso.', token });
  } catch (error) {
    console.error('Erro ao registrar membro:', error);
    res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.', error: error.message }] });
  }
};

// Login de membro
export const loginMembro = async (req, res) => {
  const { cim, senha, email } = req.body;

  try {
    // Verificar se existe um membro com o CIM ou Email fornecido
    const result = await pool.query('SELECT * FROM membro WHERE cim = $1 AND email = $2', [cim, email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const membro = result.rows[0];

    // Verificar a senha
    const validPassword = await bcrypt.compare(senha, membro.senha);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar o token JWT
    const token = jwt.sign(
      { id: membro.id, cim: membro.cim, is_admin: membro.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Retornar a resposta com o token e os dados do usuário
    res.status(200).json({ token, membro: { nome: membro.nome, cim: membro.cim, email: membro.email, is_admin: membro.is_admin } });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ errors: [{ msg: 'Erro interno no servidor.', error: error.message }] });
  }
};

// Validação de usuário autenticado
export const validateUser = (req, res) => {
  const { user } = req; // usuário obtido do middleware authenticateToken
  if (user) {
    res.json({
      id: user.id,
      cim: user.cim,
      is_admin: user.is_admin,
      email: user.email,
      nome: user.nome,
    }); // retorna os dados do usuário autenticado
  } else {
    res.status(401).json({ error: 'Usuário não autenticado' });
  }
};