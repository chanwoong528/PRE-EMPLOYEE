require("dotenv").config({ path: "../env/db.env" });
require("dotenv").config({ path: "../env/port.env" });
const express = require("express");
const cors = require("cors");
const PORT = process.env.SERVER_PORT || 6000;

const app = express();

const { Client, Query } = require("pg");

let client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PW,
  port: process.env.PG_PORT,
});

client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("db connected");
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "PUT", "GET", "PATCH"],
    credentials: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server 🚀: ${PORT}`);
});
