const express = require("express");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/User");
const { MEMEBERSHIP_AMOUNTS } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { userAuth } = require("../middlewares/auth");

// Route to create a new order
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    const amount = MEMEBERSHIP_AMOUNTS[membershipType];
    if (!amount) {
      return res.status(400).json({ error: "Invalid membership type" });
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    };

    const order = await razorpayInstance.orders.create(options);
    // console.log("order creation :: ", order);

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: options.notes,
    });

    const savedPayment = await payment.save();

    res.json({
      ...savedPayment.toJSON(),
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

// Route to handle webhook for payment status updates
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    console.log("webhook called");

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["X-Razorpay-Signature"];
    const body = req.body;

    if (!validateWebhookSignature(JSON.stringify(body), signature, secret)) {
      return res.status(400).json({ msg: "Invalid webhook signature" });
    }

    console.log("Webhook signature done");

    //   update payment status in DB
    const paymentDetails = body.payload.payment.entity;

    const payemnt = await Payment.findOne({
      orderId: paymentDetails.order_id,
    });
    payemnt.status = paymentDetails.status;
    await payemnt.save();

    console.log("payment saved in DB");

    const user = await User.findById({ _id: payemnt.userId });
    user.isPremium = true;
    user.membershipType = payemnt.notes.membershipType;
    console.log("user saved");
    await user.save();

    const event = req.body;

    //   if (event.event === "payment.captured") {
    //     const paymentId = event.payload.payment.entity.id;
    //     const orderId = event.payload.payment.entity.order_id;

    //     try {
    //       const payment = await Payment.findOne({ orderId });
    //       if (payment) {
    //         payment.paymentId = paymentId;
    //         payment.status = "captured";
    //         await payment.save();

    //         await User.findByIdAndUpdate(payment.userId, {
    //           membershipStatus: payment.notes.membershipType,
    //         });
    //       }
    //       res.json({ status: "ok" });
    //     } catch (error) {
    //       res.status(500).json({ error: "Internal Server Error" });
    //     }
    //   } else {
    //     res.json({ status: "ignored" });
    //   }
    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user.toJSON();

  return res.json({ ...user });
});

module.exports = paymentRouter;
