import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (!token) {
    return res.status(405).json({ message: 'нет доступа' });
  }

  try {
    const decoded = jwt.verify(token, 'token');
    req.userId = decoded._id;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'нет доступа' });
  }
};
