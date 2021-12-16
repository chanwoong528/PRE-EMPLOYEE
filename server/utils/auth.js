const util = require("./util");

const auth = {};

auth.validateCreateUserInput = (req, res, next) => {
  if (!req.body) return res.status(400).send({ msg:"User data not received." });
  if (!req.body.email || !req.body.password ||
    !req.body.passwordConf || !req.body.firstname || !req.body.lastname) {
    return res.status(400).send({ msg: "Some required fields are missing value." });
  }
  if (!util.validateEmail(req.body.email)) {
    return res.status(400).send({ msg: "Invalid E-mail address." });
  }
  if (req.body.password !== req.body.passwordConf) {
    return res.status(400).send({ msg: "Password doesn't match." });
  }
  next();
};

auth.validateLocalLoginData = (req, res, next) => {
  console.log("req.session.user: ", req.session.user);
  if (!req.body) return res.status(400).send({ msg:"Login info not received." });
  if (!req.body.email || !req.body.password) return res.status(400).send({ msg:"E-mail or password is missing." });
  // if (!util.validateEmail(email)) return res.status(400).send({ msg:"E-mail invalid." });
  next();
};

auth.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.status(400).send({ msg:"Login required." });
};

auth.isAdmin = (req, res, next) => {
  // TODO:
  next();
}

module.exports = auth;