const passport = require('passport');
const { Strategy: GithubStratagy } = require('passport-github');

const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GithubStratagy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.CALLBACK_URL || 'http://localhost:3000/auth/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      if (profile) {
        const githubUser = {
          github: {
            id: profile.id,
            displayName: profile.displayName,
            username: profile.username
          }
        };
        const existingUser = await User.findOne(githubUser);

        if (existingUser) {
          return done(null, existingUser);
        }

        const user = new User(githubUser);

        const results = await user.save();

        if (results) {
          return done(null, results);
        }

        return done('could not create user');
      }
      return done('no logged in');
    }
  )
);
