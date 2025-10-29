const express = require("express");

const app = express();

//handler
app.use("/test", (req, res) => {
  res.send("Welcome to test");
});
app.use("/home", (req, res) => {
  res.send("Welcome to home");
});

// attching the port
app.listen(7777, () => {
  console.log("Server creation successfully done !!");
});
