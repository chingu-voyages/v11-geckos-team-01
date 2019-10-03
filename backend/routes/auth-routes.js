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
authRoute.get('/current_user', requireLogin(), (req, res) => {
  res.json(req.user);
});

/**
 * Logout Route
 */
authRoute.get('/logout', requireLogin(), (req, res) => {
  req.logOut();
  res.redirect('/');
});

module.exports = authRoute;
