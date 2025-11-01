const express = require("express");

const { userAuth } = require("../middlewares/auth");
const { doProfileEditValidations } = require("../utils/validations");
const { pipeline } = require("nodemailer/lib/xoauth2");

const router = express.Router();

router.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error get profile " + error);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!doProfileEditValidations(req)) {
      throw new Error("Some fields not allowed to do edit the profilr");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({
      message: "Profile updated successfully !!",
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error profile edit " + error);
  }
});

module.exports = router;
