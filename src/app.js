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
    res.status(400).send("Error user data insertion " + error);
  }
});

// GET
// Get all documents
app.get("/user", async (req, res) => {
  try {
    const resData = await User.find({});
    res.send(resData);
  } catch (error) {
    res.status(400).send("Error get user data " + error);
  }
});

app.get("/userById", async (req, res) => {
  try {
    const userId = req.body.userId;
    const resData = await User.findById({ _id: userId });
    res.send(resData);
  } catch (error) {
    res.status(400).send("Error get user data by id " + error);
  }
});

// Update
app.patch("/updateUser/:userId", async (req, res) => {
  try {
    const ALLOWED_FIELDS = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];
    const isAllowedFieldsOnly = Object.keys(req.body).every((field) => {
      return ALLOWED_FIELDS.includes(field);
    });

    if (!isAllowedFieldsOnly) {
      throw new Error("Email and some fields are restricted to update");
    }

    const userId = req.params.userId;
    const updatedData = await User.findByIdAndUpdate(
      { _id: userId },
      req.body,
      { returnDocument: "after", runValidators: true }
    );
    res.send(updatedData);
  } catch (error) {
    res.status(400).send("Error update user by id " + error);
  }
});

// Delete
app.delete("/deleteUserById", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId);
    res.send("User Deleted successfully");
  } catch (error) {
    res.status(400).send("Error delete " + error);
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
