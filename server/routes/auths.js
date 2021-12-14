const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
require("dotenv").config({ path: "../../env/db.env" });

const bcrypt = require("bcrypt");
const pgQuery = require("../utils/pgUtil");

const pool = require("../db/db");
const util = require("../utils/util");
const auth = require("../utils/auth");

router.get("/failed", (req, res) => {
  console.log("failed.");
  res.status(400).send({ msg: "Login failed." });
});

router.post("/create", auth.validateLocalCreateData, async (req, res) => {
  const { email, password, firstname, lastname, position } = req.body;
  util.encryptPassword(password, async (err, hash, data) => {
    if (err) return res.status(data.status).send({ msg:data.msg });
    else {
      const result = await pgQuery.insertLocalUser(
        pool, email, hash, firstname, lastname, position);
      if (result) return res.status(201).send({ msg:"User registration successful." });
      else return res.status(500).send({ msg:"User registration failed."});
    }
  });
});

router.post("/login", auth.validateLocalLoginData, (req, res, next) => {
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
  passport.authenticate("google", { scope: ["profile"] })
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
