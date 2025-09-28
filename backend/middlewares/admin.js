// Middleware to check if user is admin
module.exports = function (req, res, next) {
  console.log('Admin middleware triggered', { user: req.user });
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required'
    });
  }
  next();
};
