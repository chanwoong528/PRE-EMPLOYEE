const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
require('dotenv').config({ path:"../../env/db.env"});
const bcrypt = require('bcrypt');
const { Query } = require('pg');
const db = require('../config/db');
const util = require('../util/util');

router.get('/failed', (req, res) => {
  res.status(400).send({ msg: "Login failed." });
});

// 200~299 OK
// 400 request invalid
// 500 server err

router.post('/create', async (req, res) => {
  let { email, password, firstname, lastname, position } = req.body;
  if (!email || !password || !firstname || !lastname){
    res.status(400).send({ msg:"Some required fields are missing value." });
  }
  else if (password !== passwordConfirmation) {
    res.status(400).send({ msg:"Password doesn't match." });
  }
  else if (!util.validateEmail(email)) {
    res.status(400).send({ msg:"Invalid E-mail address." });
  }
  else {
    // passed validation, register user
    bcrypt.genSalt(process.env.BC_SALT_ROUNDS, (err, salt) => {
      if (err) res.status(500).send({ msg:"bcrypt genSalt: An error occurred."});
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) res.status(500).send({ msg:"bcrypt hash: An error occurred."});
        else {
          let query = new Query(`INSERT INTO public.pre_emp_users(
            email, password, firstname, lastname, "position", created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`);
          let positions = position.join(",");
          let values = [email, hash, firstname, lastname, positions, TO_CHAR(NOW(),'YYYY-MM-DD'), TO_CHAR(NOW(),'YYYY-MM-DD')];
          db().query(query, values, (err, result) => {
            if (err) res.status(500).send({ msg:"DB Create: An error occurred." });
            else {
              res.status(201).send({ msg:"" });
            }
          });
        }
      });
    });
  }
});

router.post('/login', (req, res) => {
  passport.authenticate('local-login', (err, user) => {
    if (err) res.status(500).send({ msg:"login: An error occurred." });
    if (!user) res.status(400).send({ msg:"No such user found." });
    else {
      res.status(200).send(user);
    }
  });
});

router.get('/google', passport.authenticate('google', {scope:['email', 'profile']}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/failed' }),
  function (req, res) {
    console.log("successful");
    // Successful authentication, status 200 and send .
    res.status(200);
  }
);

module.exports = router;