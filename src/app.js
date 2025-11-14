const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require("dotenv").config();
require("./utils/cronJob");

const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");
const initializeSocket = require("./utils/socket");

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
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);

initializeSocket(server);

// connecting to database

connectDB()
  .then(() => {
    console.log("Data base connection established successfully");

    // attching the port
    server.listen(process.env.PORT, () => {
      console.log("Server creation successfully done !!");
    });
  })
  .catch((err) => {
    console.error("Database connection failed ", err);
  });
