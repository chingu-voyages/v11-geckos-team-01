const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

const authRoutes = require('./routes/auth-routes.js');
const templateRoutes = require('./routes/template-routes');

require('./services/passport.js');

const isDevelopment = process.env.NODE_ENV === 'development';
const app = express();

app.use([
  express.json(),
  express.urlencoded({ extended: true }),
  cors(),
  cookieParser(),
  helmet(), // adds some security
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
app.use('/api/templates', templateRoutes);

app.get('/', express.static(path.resolve(__dirname, '../client/build')));

module.exports = app;
