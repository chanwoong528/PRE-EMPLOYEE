const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
require("dotenv").config({ path: "../../env/db.env" });
require("dotenv").config({ path: "../../env/server.env" });

const bcrypt = require("bcrypt");
const pgQuery = require("../utils/pgUtil");

const pool = require("../db/db");
const util = require("../utils/util");
const auth = require("../utils/auth");

router.get("/failed", (req, res) => {
  console.log("failed.");
  res.status(400).send({ msg: "Login failed." });
});

router.post("/create", auth.validateCreateUserInput, async (req, res) => {
  const { email, password, firstname, lastname, position } = req.body;
  util.encryptPassword(password, async (err, hash, data) => {
    if (err) return res.status(data.status).send({ msg: data.msg });
    else {
      const result = await pgQuery.insertLocalUser(pool, {
        email,
        hash,
        firstname,
        lastname,
        position
      });
      if (result)
        return res.status(201).send({ msg: "User registration successful." });
      else return res.status(500).send({ msg: "User registration failed." });
    }
  });
});

router.post("/login", auth.validateLocalLoginData, (req, res, next) => {
  passport.authenticate("local-login", (err, user, data) => {
    try{
      if (err) throw new Error(err);
      if (!user) {
        return res.status(data.status).send(({ msg } = data));
      } else {
        req.login(user, (err) => {
          if (err) throw new Error(err);
          else {
            req.session.user = user;
            return res.status(200).send(user.email);
          }
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ msg: "login: An error occurred." });
    }
  })(req, res, next);
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", (err, user) => {
      try{
        if (err) throw new Error("Google Login: Authentication returned error.");
        console.log('=====================');
        console.log("session (not initialized): ", req.session);
        if (user) {
          req.login(user, (err) => {
            req.session.user = user;
            console.log("req.session.user (initialized): ", req.session.user);
            console.log('=====================');
            if (err) throw new Error("Google Login: req.login returned error.");
            return res.redirect("http://localhost:3000");
          });
        }
        else {
          return res.status(500).send({ msg:"oauth login failed." });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).send({ msg:"Google Login: An error occurred." });
      }
    })(req, res, next);
  }
);

// router.get("/google/callback", passport.authenticate("google", { 
//     successRedirect: "http://localhost:3000/",
//     failureRedirect: "http://localhost:3000/login"
//   }),
//   (req, res) => {
//     console.log("succcesssss: ", req.user);
//     console.log(req.session);
//     res.send({ user:req.user });
//   }
// );

// router.get("/logout", function (req, res) {
//   req.logout();
//   res.status(200).send({ msg: "session terminated." });
// });

// router.get("/google/callback", passport.authenticate("google", (err, user) => {
//   if (err) res.redirect(process.env.SERVER_REACT_URL + '/login');
//   else {
//     req.login(user, (err) => {
//       if (err) {
//         console.log("google login failed: req.login returned error.");
//         console.log(err);
//         res.redirect(process.env.SERVER_REACT_URL + '/login');
//       }
//       else {
//         console.log("succcesssss: ", req.user);
//         res.redirect(process.env.SERVER_REACT_URL);
//       }
//     });
//   }
// }));

router.get("/logout", function (req, res) {
req.logout();
res.status(200).send({ msg: "session terminated." });
});

module.exports = router;
