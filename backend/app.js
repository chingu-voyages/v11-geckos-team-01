const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');

const authRoutes = require('./routes/auth-routes.js');

require('./services/passport.js');

const isDevelopment = process.env.NODE_ENV === 'development';
const app = express();

app.use([
  express.json(),
  express.urlencoded({ extended: true }),
  cors(),
  cookieParser(),
  session({
    secret: process.env.COOKIE_SECRET || 'keyboard cat',
    resave: true,
    saveUninitialized: true
  })
]);

if (isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

app.get('/', express.static('./build'));

module.exports = app;
