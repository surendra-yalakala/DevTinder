const express = require("express");

const connectDB = require("./config/database");

const app = express();

//handler

app.get("/user", (req, res) => {
  console.log(req.query);
  res.send({ firstName: "Surendra", lastName: "Yalakala", city: "Vijayawada" });
});
// app.get("/user/:userId/:firstName", (req, res) => {
//   console.log(req.params);
//   res.send({ firstName: "Surendra", lastName: "Yalakala", city: "Vijayawada" });
// });

app.post("/user", (req, res) => {
  res.send("Data inserted successfully");
});

// app.use("/test", (req, res) => {
//   res.send("Welcome to test");
// });
// app.use("/home", (req, res) => {
//   res.send("Welcome to home");
// });

connectDB()
  .then(() => {
    console.log("Data base connection established successfully");

    // attching the port
    app.listen(7777, () => {
      console.log("Server creation successfully done !!");
    });
  })
  .catch((err) => {
    console.error("Database connection failed");
  });
