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
  db.query(query, (err, result) => {
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
      let query = new Query(
        `SELECT * FROM pre_emp_users WHERE email='${email}'`
      );
      try{
        db.connect((err, client, release) => {
          if (err) throw new Error(err);
          client.query(query, (err, data) => {
            release();
            if (err) throw new Error(err);
            if (!data.rows[0]) {
              return done(null, false, { status:400, msg:"No such user found." });
            }
            bcrypt.compare(password, data.rows[0].password, (err, result) => {
              if (err) throw new Error(err);
              if (!result) return done(null, false, { status:400, msg:"Password doesn't match." });
              // console.log(data.rows[0]);
              const { password, ...user } = data.rows[0];
              return done(null, user, { status:200, msg:"User verified." });
            });
          });
          
        });
      } catch(err) {
        return done (err, false, { status:500, msg:"db.connect error" });
      }
      
      // const { rows } = await db.query(query);
      
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
      console.log("GoogleStrategy");
      let query = new Query(
        `SELECT * FROM pre_emp_users WHERE email='${account.emails[0].value}'`
      );
      db.query(query, (err, result) => {
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
