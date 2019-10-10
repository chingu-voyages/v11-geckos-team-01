const passport = require('passport');
const express = require('express');

const requireLogin = require('../middleware/require-login');

const authRoute = express.Router();

/**
 * Initial Login route
 */
authRoute.get('/github', passport.authenticate('github'));

/**
 * Auth Callback Route for Github
 */
authRoute.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/',
    successRedirect: '/'
  })
);

/**
 * Get Current user route
 */
authRoute.get('/current_user', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user });
  }

  return res.status(200).json({ user: false });
});

/**
 * Logout Route
 */
authRoute.get('/logout', requireLogin(), (req, res) => {
  req.logOut();
  res.redirect('/');
});

module.exports = authRoute;
