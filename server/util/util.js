const bcrypt = require('bcrypt');
require('dotenv').config({ path: "../env/db.env" });

const util = {};

util.validateEmail = (email) => {
  let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.match(re);
};

util.encryptPassword = async (password, cb) => {
  bcrypt.genSalt(+process.env.BC_SALT_ROUNDS, (err, salt) => {
    if (err) return cb(err, false, { status:500, msg:"bcrypt genSalt: An error occurred." });
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return cb(err, false, { status:500, msg: "bcrypt hash: An error occurred." });
      return cb(null, hash);
    });
  });
};

util.omitPassword = (user) => {
  const { password, ...ret } = user;
  return ret;
};

module.exports = util;