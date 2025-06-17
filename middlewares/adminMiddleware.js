const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next(); // Cho phép truy cập nếu là admin
  }

  return res.status(403).json({ message: 'Access denied. Admins only.' });
};

module.exports = adminMiddleware;
