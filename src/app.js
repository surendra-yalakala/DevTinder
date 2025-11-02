const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// this will get json object from request
app.use(express.json());
// parse the JWT token
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
