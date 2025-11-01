const express = require("express");

const { userAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/profile", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error get profile " + error);
  }
});

module.exports = router;
