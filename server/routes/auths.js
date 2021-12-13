const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
require("dotenv").config({ path: "../../env/db.env" });

const bcrypt = require("bcrypt");
const pgQuery = require("../util/pgQuery");

const pool = require("../config/db");
const util = require("../util/util");

router.get("/failed", (req, res) => {
  res.status(400).send({ msg: "Login failed." });
});

router.post("/create", async (req, res) => {
  let { email, password, firstname, lastname, position, passwordConf } = req.body;
  if (!email || !password || !firstname || !lastname) {
    res.status(400).send({ msg: "Some required fields are missing value." });
  } else if (password !== passwordConf) {
    res.status(400).send({ msg: "Password doesn't match." });
  }
  else if (!util.validateEmail(email)) {
    res.status(400).send({ msg: "Invalid E-mail address." });
  }
  else {
    // passed validation, register user
    util.encryptPassword(password, (err, hash, data) => {
      if (err) res.status(data.status).send({ msg:data.msg });
      else {
        pgQuery.insertIntoDefaultUsersQuery(pool, email, hash, firstname, lastname, position.join(","),
        (err, result, data) => {
          if (err || !result) res.status(data.status).send({ msg:data.msg });
          else res.status(201).send({ msg:"User registration successful." });
        });
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  if (!req.body.email || !req.body.password){
    return res.status(400).send({ msg:"E-mail or password is missing." });
  }
  passport.authenticate("local-login", (err, user, data) => {
  if (err) {
    return res.status(500).send({ msg: "login: An error occurred." });
  }
  if (!user) {
    return res.status(data.status).send({ msg } = data);
  }
  else {
    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(200).send(user);
    });
  }
})(req, res, next);
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failed" }),
  function (req, res) {
    console.log("successful");
    // Successful authentication, status 200 and send .
    res.status(200);
  }
);

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).send({ msg:"session terminated." });
});

module.exports = router;
