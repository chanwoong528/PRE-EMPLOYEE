const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config({ path: "../env/oauth.env" });
const bcrypt = require("bcrypt");
const pgUtil = require('../utils/pgUtil');

const pool = require("../db/db.js");
const util = require("../utils/util");

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  pgUtil.selectLocalUserCB(pool, email, (err, user) => {
    if(err) return done(err);
    if(!user) return done(null, false);
    else {
      return done(null, omitPassword(user));
    }
  });
});

// passport.use(
//   "local-login",
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//       passReqToCallback: true,
//     },
//     async (req, email, password, done) => {
//       pgq.selectLocalUser(pool, email, (err, user, data) => {
//         if (err) return done(err);
//         if (!user) return done(null, false, data);
//         else {
//           bcrypt.compare(password, user.password, (err, result) => {
//             if (err) return done(err);
//             if (!result) return done(null, false, { status:406, msg:"Password doesn't match." });
//             // console.log(data.rows[0]);
//             return done(null, util.omitPassword(user));
//           });
//         }
//       });
//     }
//   )
// );

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await pgUtil.selectLocalUser(pool, email);
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return done(err);
        if (!result) return done(null, false, { status:406, msg:"Password doesn't match." });
        // console.log(data.rows[0]);
        return done(null, util.omitPassword(user));
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
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, account, cb) => {
      console.log("GoogleStrategy");
      // account.emails[0].value || profile.getEmail()
      pgUtil.selectLocalUserCB(pool, account.emails[0].value, (err, user, data) => {
        if (err) return cb(err);
        if (user) return cb(null, util.omitPassword(user));
        else {
          // TODO:
          // search OAuth database (oauth_users)
          // create one if non-existant

          return cb(null, false, data);
        }
      });
    }
  )
);

module.exports = passport;
