const express = require("express");
require("dotenv").config();
const connectDb = require("./src/util/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const userRouter = require("./src/router/user");
const adminRouter = require("./src/router/admin");
const authRouter = require("./src/router/auth");
const postRouter = require("./src/router/post");
const { errorMiddleware } = require("./src/middleware/error");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET,{sameSite:'none'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

app.use(
  "/public/profile",
  express.static(path.join(__dirname, "src/public/profile"))
);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "dist", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.status(200).json("Dev server runing");
  });
}
app.use(errorMiddleware);
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    const URI = process.env.MONGO_URI;
    await connectDb(URI);
    console.log("db connected");
    app.listen(PORT, () => {
      console.log(`server listening on PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
