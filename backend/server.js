const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoute.js");
const errorHandler = require("./middleware/errorMiddleware.js");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 8080;
// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes Milldleware

app.use("/api/users", userRoute);
//Routes
app.get("/", (req, res) => {
  res.send("home page");
});

//error middleware

app.use(errorHandler);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_LINK);
    console.log("Mongo Database Connected");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`saerver started on port ${PORT}`);
});
