const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
require("dotenv").config({ path: "../../env/db.env" });

const bcrypt = require("bcrypt");
const { Query } = require("pg");
const db = require("../config/db");
const util = require("../util/util");

router.get("/failed", (req, res) => {
  res.status(400).send({ msg: "Login failed." });
});

// 200~299 OK
// 400 request invalid
// 500 server err

router.post("/create", async (req, res) => {
  let { email, password, firstname, lastname, position, passwordConf } =
    req.body;
  console.log(email, password, firstname, lastname, position);
  if (!email || !password || !firstname || !lastname) {
    res.status(400).send({ msg: "Some required fields are missing value." });
  } else if (password !== passwordConf) {
    res.status(400).send({ msg: "Password doesn't match." });
  }
  else if (!util.validateEmail(email)) {
    console.log("regex not passed");
    res.status(400).send({ msg: "Invalid E-mail address." });
  }
  else {
    // passed validation, register user
    bcrypt.genSalt(+process.env.BC_SALT_ROUNDS, (err, salt) => {
      if (err) {
        res.status(500).send({ msg: "bcrypt genSalt: An error occurred." });
      } else {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err)
            res.status(500).send({ msg: "bcrypt hash: An error occurred." });
          else {
            let positions = position.join(",");
            let query = new Query(`INSERT INTO public.pre_emp_users(
              email, password, firstname, lastname, "position", created_at, updated_at)
              VALUES ('${email}', '${hash}', '${firstname}', '${lastname}', '${positions}',  TO_CHAR(NOW(),'YYYY-MM-DD'), TO_CHAR(NOW(),'YYYY-MM-DD'))`);

            console.log(positions);
            db().query(query, (err, result) => {
              if (err)
                res.status(500).send({ msg: "DB Create: An error occurred." });
              else {
                res.status(201).send({ msg: "" });
              }
            });
          }
        });
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  if (!req.body.email || !req.body.password){
    console.log("missing");
    return res.status(400).send({ msg:"E-mail or password is missing." });
  }
  passport.authenticate("local-login", (err, user, data) => {
  if (err) {
    console.log("err");
    return res.status(500).send({ msg: "login: An error occurred." });
  }
  if (!user) {
    console.log("incorrect");
    return res.status(400).send({ msg: "Incorrect E-mail or password." });
  }
  else {
    console.log("200");
    return res.status(200).send(user);
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
