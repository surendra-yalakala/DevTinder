const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://learnvahinisurendra_db_user:3TEBwbP60SQPBgts@namastenode.8dfp8pn.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
