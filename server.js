"use strict";

const mysql = require("mysql");
const { initApp } = require("./lib/Functions");
const { askPrompts } = require("./lib/prompts");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "team_db"
  });

  connection.connect(err => {
    if (err) { throw err; }
    askPrompts();
    initApp();
  });

  module.exports = connection;
