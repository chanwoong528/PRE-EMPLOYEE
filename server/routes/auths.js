const express = require('express');
const router = express.router();
const passport = require('../config/passport');

router.get('/failed', (req, res) => {
  res.status(400).send({ msg: "" });
});

// 200~299 OK
// 400 request invalid
// 500 server err

router.post('/create', (req, res) => {
  
});

router.get('/google', passport.authenticate('google', {scope:['email', 'profile']}));

router.get('/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/failed' }),
  function (req, res) {
    console.log("successful");
    // Successful authentication, status 200 and send .
    res.status(200);
  }
);

module.exports = router;