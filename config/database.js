const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/pdf1");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "This is an error"));

db.once("open", function () {
  console.log("succesfully Connected to the database");
});

module.exports = db;
