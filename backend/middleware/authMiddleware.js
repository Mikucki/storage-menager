const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("not authorzied please login");
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(verified.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("user nor found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("not authorzied please login");
  }
});

module.exports = protect;
