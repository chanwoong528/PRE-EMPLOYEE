require("dotenv").config({ path: "../env/server.env" });
const express = require("express");
const cors = require("cors");
const app = express();

// DB
const db = require("./config/db");
db().connect();

// others
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "PUT", "GET", "PATCH"],
    credentials: true,
  })
);

// session
const session = require("express-session");
app.use(
  session({
    secret: process.env.SERVER_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// passport
const passport = require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", require("./routes/auths"));
app.get("*", (req, res) => res.status(404).send({ err: "Invalid Access" }));

// port
const PORT = process.env.SERVER_PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server 🚀: ${PORT}`);
});
