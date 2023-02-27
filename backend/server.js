const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());

const PORT = process.env.PORT || 8080;

//conect to mongooBD and start server

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_LINK);
    console.log("Mongo Database started");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`saerver started on port ${PORT}`);
});
