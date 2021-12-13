const auth = {};

/**
 * Middleware that checks if the req was sent by a logged in user. 
 */
auth.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.status(400).send({ msg:"Login required." });
};

/**
 * Middleware that checks if the req was sent by an admin. 
 */
auth.isAdmin = (req, res, next) => {
  
}

module.exports = auth;