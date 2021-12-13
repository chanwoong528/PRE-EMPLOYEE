const util = {};

util.validateEmail = (email) => {
  let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.match(re);
}

module.exports = util;