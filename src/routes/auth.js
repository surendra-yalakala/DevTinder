const express = require("express");
const bcrypt = require("bcrypt");

const { doValidateSignUpData } = require("../utils/validations");
const User = require("../models/User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    // validation
    doValidateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    // encrypt the password
    const hashPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    await userData.save();
    res.send("Data inserted successfully");
  } catch (error) {
    res.status(400).send("Error user data insertion " + error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });

    if (!user?.emailId) {
      throw new Error("Invalid credentials");
    }

    const isPwdCorrect = await user.validatePassword(req.body.password);
    if (!isPwdCorrect) {
      throw new Error("Invalid credentials");
    } else {
      const jwtToken = await user.getJWT();

      res.cookie("token", jwtToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60),
      });
      res.send("Login Success !!");
    }
  } catch (error) {
    res.status(400).send("Error user login " + error);
  }
});

module.exports = router;
