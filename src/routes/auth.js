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

    const jwtToken = await userData.getJWT();

    res.cookie("token", jwtToken, {
      expires: new Date(Date.now() + 1000 * 60 * 60),
    });

    await userData.save();
    res.json({ data: userData });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });

    if (!user?.emailId) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const isPwdCorrect = await user.validatePassword(req.body.password);
    if (!isPwdCorrect) {
      return res.status(400).send({ message: "Invalid credentials" });
    } else {
      const jwtToken = await user.getJWT();

      res.cookie("token", jwtToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60),
      });
      res.send(user);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send({ message: "Logout successfull !!" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const { emailId, newPassword } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();

    res.send({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message || "Something went wrong" });
  }
});

module.exports = router;
