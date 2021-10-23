const express = require("express");
app = express();
const path = require("path");
const PORT = 8000;
const router = require("./router/index");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("assets"));

app.get("/", router);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Starts successfully");
  }
});
