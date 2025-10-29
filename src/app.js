const express = require("express");

const connectDB = require("./config/database");
const User = require("./models/User");

const app = express();

// this will get json object from request
app.use(express.json());

//handler

// app.get("/user", (req, res) => {
//   console.log(req.query);
//   res.send({ firstName: "Surendra", lastName: "Yalakala", city: "Vijayawada" });
// });
// app.get("/user/:userId/:firstName", (req, res) => {
//   console.log(req.params);
//   res.send({ firstName: "Surendra", lastName: "Yalakala", city: "Vijayawada" });
// });

app.post("/signup", async (req, res) => {
  // const userData = new User({
  //   firstName: "surendra",
  //   lastName: "yalakala",
  //   emailId: "learn.vahini.surendra@gmail.com",
  //   password: "abc@123",
  //   age: 33,
  // });

  const userData = new User(req.body);

  try {
    await userData.save();
    res.send("Data inserted successfully");
  } catch (error) {
    res.status(400).send("Error user data insertion ", error);
  }
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
    console.error("Database connection failed ", err);
  });
