import jwt from 'jsonwebtoken';

// Middleware para autenticar o token JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não encontrado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user; // Define o usuário autenticado na requisição
    next();
  });
};

// Middleware para verificar se o usuário é o proprietário dos dados ou um administrador
export const checkOwnershipOrAdmin = (req, res, next) => {
  const { cim } = req.body; // CIM enviado na requisição
  const { user } = req; // Usuário autenticado obtido do middleware authenticateToken

  // Verifica se o usuário é administrador ou se o CIM do usuário autenticado coincide com o CIM enviado
  if (user.is_admin || user.cim === cim) {
    next();
  } else {
    return res.status(403).json({
      error: 'Acesso negado',
      message: 'Você não está autorizado a criar ou alterar dados de outro membro.',
    });
  }
};
