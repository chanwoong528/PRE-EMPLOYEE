const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy()
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv').config();
const { Pool, Result, Query } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PW,
  port: process.env.PG_PORT,
});

passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  let query = new Query (`SELECT * FROM pre_emp_users WHERE email=${email}`);
  pool.query(query, (err, res) => {
    return done(err, res);
  });
});

passport.use('local-login',
  new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true,
  },
  (req, email, password, done) => {
    let query = new Query (`SELECT * FROM pre_emp_users WHERE email=${email}`);
    pool.query(query, (err, res) => {
      if (err) return done(err, null);
      if (res) {
        // res.rows[0] contains info, e.g., res.rows[0].email
        // compare passwords
        if (true) {
          return done(null, res.rows[0]);
        }
      }
      // user non-existant, handle this in router
      return done(null, null);
    });
  })
);

passport.use('google',
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:6000/auth/google/callback",
  },
  (accessToken, refreshToken, profile, account, cb) => {
    let query = new Query (`SELECT * FROM pre_emp_users WHERE email=${account.emails[0].value}`);
    pool.query(query, (err, res) => {
      if (err) return cb(err, null);
      if (res) {
        // found a user
        return cb(null, res.rows[0]);
      }
      else {
        // let cquery = new Query (`INSERT INTO pre_emp_users (email, password, firstname, lastname, position, created_at, updated_at) VALUES('${}',~~~)`

        // make it route to user register page
        return cb(null, null);
      }
    });
  })
);