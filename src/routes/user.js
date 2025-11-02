const express = require("express");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const router = express.Router();

router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName age gender photoUrl about skills"
    );

    console.log(loggedInUser, connectionRequest);

    res.json({
      message: "Data fetched successfully !!",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).json({ message: "Error received request " + error });
  }
});

module.exports = router;
