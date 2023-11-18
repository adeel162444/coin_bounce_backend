const express = require("express");
const dbConnection = require("./database/db");
const userRouter = require("./routes/userRoute");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const blogRouter = require("./routes/blogRoute");
const commentRouter = require("./routes/commentRoute");
const app = express();
const port = process.env.PORT;
const cors = require("cors");
app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//routes

app.use("/uploads", express.static(__dirname + "/uploads"));

app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);
dbConnection();
//creating a server
app.listen(port, () => {
  console.log(`listening to the port: ${port}`);
});
