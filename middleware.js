const jwt = require('jsonwebtoken');
require('dotenv').config()
const secretKey = process.env.JWT_SECRET_KEY;

// Middleware pour vérifier si le jeton d'accès est valide
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Access denied');
  }

  const token = authHeader.split(' ')[1];
  console.log(token);
  console.log(secretKey);

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log(token);
    req.userInfo = {
      userId: decoded.userId,
      //email: decoded.email
    };
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

  

// Middleware pour vérifier si l'utilisateur a l'autorisation d'accéder à la fonctionnalité de messagerie

// const verifyAccess = (req, res, next) => {
//   const user = req.user;
//   const userId = req.params.userId;
//   if (user.role !== 'admin' && user.id !== userId) {
//     return res.status(403).send('Forbidden');
//   }
//   next();
// };

module.exports = {
  verifyToken,
//   verifyAccess
};
