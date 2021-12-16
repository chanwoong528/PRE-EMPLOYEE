const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config({ path: "../env/oauth.env" });
const bcrypt = require("bcrypt");
const pgUtil = require("../utils/pgUtil");

const pool = require("../db/db.js");
const util = require("../utils/util");

passport.serializeUser((user, done) => {
  const id = user.email || user.username;
  console.log("serialize: ", id);
  done(null, id);
});

passport.deserializeUser((email, done) => {
  pgUtil.selectLocalUserCB(pool, email, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false);
    else {
      return done(null, util.omitPassword(user));
    }
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
      const user = await pgUtil.selectLocalUser(pool, email);
      if (!user) return done(null, false, {
        status: 406,
        msg: "No such user exists.",
      });
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return done(err);
        if (!result)
          return done(null, false, {
            status: 406,
            msg: "Password doesn't match.",
          });
        // console.log(data.rows[0]);
        return done(null, util.omitPassword(user));
      });
    }
  )
);

// passport.use(
//   "google",
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, account, cb) => {
//       console.log("GoogleStrategy");
//       // console.log(account);
//       // account.emails[0].value || profile.getEmail()
//       try {
//         let user = await pgUtil.selectLocalUser(pool, account.emails[0].value);
//         if (user) return cb(null, util.omitPassword(user));
//         // TODO:
//         // search OAuth database (oauth_users)
//         // create one if non-existant
//         const googleUser = {
//           provider:account.provider,
//           username:account.emails[0].value,
//           firstname:account.name.givenName,
//           lastname:account.name.familyName,
//         };
//         const oauth_user = await pgUtil.selectOauthUser(pool, googleUser.username);
//         if (oauth_user) return cb(null, util.omitPassword(oauth_user));
//         await pgUtil.insertOauthUser(pool, googleUser);
//         oauth_user = await pgUtil.selectOauthUser(pool, googleUser.username);
//         return cb (null, oauth_user);
//       } catch (err) {
//         console.log(err);
//         return cb (null, false);
//       }
      
//     }
//   )
// );

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, account, cb) => {
      console.log("GoogleStrategy");
      if (!account) return cb (err);
      const googleUser = {
        provider:account.provider,
        username:account.emails[0].value,
        firstname:account.name.givenName,
        lastname:account.name.familyName,
      };
      return cb (null, googleUser);
    }
  )
);

module.exports = passport;
