const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { findOne } = require("../models/User");
const User = require("../models/User");

const router = express.Router();

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    /**
     * validations
     * 1. invalid status
     * 4. fromUser != to user
     * */
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type " + status,
      });
    }

    // 2. already connection
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({
        message: "User not found ",
      });
    }

    // 3. to user not found
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).json({
        message: "Connection request already exists !!",
      });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.json({
      message: "Connection request sent successfully!!",
      data,
    });
  } catch (error) {
    res.status(400).send("Error connection request " + error);
  }
});

module.exports = router;
