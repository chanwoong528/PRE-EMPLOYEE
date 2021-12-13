const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config({ path: "../env/oauth.env" });
const bcrypt = require("bcrypt");
const { Query } = require("pg");

const db = require("./db.js")();

passport.serializeUser(function (user, done) {
  done(null, user.email);
});

passport.deserializeUser(function (email, done) {
  let query = new Query(`SELECT * FROM pre_emp_users WHERE email=${email}`);
  db().query(query, (err, result) => {
    return done(err, result);
  });
});

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      if (!email || !password)
        return done(null, false, { msg: "Missing E-mail or password." });
      let query = new Query(
        `SELECT * FROM pre_emp_users WHERE email='${email}'`
      );
      const { rows } = await db().query(query);
      if (!rows) return done(null, false);
      bcrypt.compare(password, rows[0].password, (err, result) => {
        if (err) return done(err);
        if (!result) return done(null, false);
        const { password, ...user } = rows[0];
        return done(null, user);
      });
    }
  )
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:6000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, account, cb) => {
      let query = new Query(
        `SELECT * FROM pre_emp_users WHERE email=${account.emails[0].value}`
      );
      db().query(query, (err, result) => {
        if (err) return cb(err);
        if (result) {
          // found a user
          return cb(null, result.rows[0]);
        } else {
          // let cquery = new Query (`INSERT INTO pre_emp_users (email, password, firstname, lastname, position, created_at, updated_at) VALUES('${}',~~~)`

          // make it route to user register page
          return cb(null, false);
        }
      });
    }
  )
);

module.exports = passport;
