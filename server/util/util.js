const util = {};

util.validateEmail = (email) => {
  let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.test(re);
}

module.exports = util;