import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak diberikan' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded; // Harus ada role di payload JWT
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

export default auth; 