console.clear();
require("dotenv").config();
require("./config/db");
const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./routes/users.routes");
const pinRouter = require("./routes/pins.routes");
const commentRouter = require("./routes/comments.routes");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/pin", pinRouter);
app.use("/api/comment", commentRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server Started in port ${process.env.PORT}`)
);
