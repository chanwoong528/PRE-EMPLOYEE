require("dotenv").config({ path: "../env/server.env" });
const express = require("express");
const cors = require("cors");
const app = express();
const passport = require("./config/passport");

// DB
const db = require("./db/db");
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

// session / passport
const session = require("express-session");
const bodyParser = require("body-parser");
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SERVER_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", require("./routes/auths"));
app.get("*", (req, res) => res.status(404).send({ err: "Invalid Access" }));

// port
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server 🚀: ${PORT}`);
});
