/**
 * Require Login Middleware
 */
module.exports = (options = { logedIn: true }) => (req, res, next) => {
  if (req.isAuthenticated() === options.logedIn) {
    return next();
  }

  return res.sendStatus(401);
};
