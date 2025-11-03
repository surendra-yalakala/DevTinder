const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send({ message: "Token expired" });
    }

    const decodedObj = await jwt.verify(token, "DevTinder$119");
    const { _id } = decodedObj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error " + error);
  }
};

module.exports = { userAuth };
