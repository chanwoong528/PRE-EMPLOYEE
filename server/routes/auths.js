const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
require('dotenv').config({ path:"../../env/db.env"});
const bcrypt = require('bcrypt');
const { Query } = require('pg');
const db = require('../config/db');
const util = require('../util/util');

router.get('/failed', (req, res) => {
  res.status(400).send({ msg: "" });
});

// 200~299 OK
// 400 request invalid
// 500 server err

router.post('/create', async (req, res) => {
  let {email, password, firstname, lastname, position} = req.body;
  if (!email || !password || !firstname || !lastname){
    res.status(400).send({ msg:"Some required fields are missing value." });
  }
  else if (!util.validateEmail(email)) {
    res.status(400).send({ msg:"Invalid E-mail address." });
  }
  else {
    // passed validation, register user
    bcrypt.genSalt(process.env.BC_SALT_ROUNDS, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        
      });
    });
    let query = new Query(`INSERT INTO public.pre_emp_users(
      email, password, firstname, lastname, "position", created_at, updated_at)
      VALUES (${email}, , ?, ?, ?, ?, ?)`);
    
  }

});

router.post('/login', passport.authenticate('local'), (req, res) => {
  
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