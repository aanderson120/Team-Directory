const mysql = require ("mysql");
const { functions } = require("./lib/functions");
const { prompts } = require("./lib/prompts");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "team__db"
  });

  connection.connect(err => {
    if (err) throw err;
    prompts();
    functions();
  });