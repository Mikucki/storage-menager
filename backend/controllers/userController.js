const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const { now } = require("mongoose");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  //validation

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all riquired fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Make your password at least 7 carracters");
  }

  //check if user email already exist
  if (email === (await User.findOne({ email }))) {
    res.status(400);
    throw new Error("User with that email already exists");
  }

  //Create new User
  const createUser = await User.create({
    name,
    password,
    email,
  });

  const token = generateToken(createUser._id);

  //send http-only cookie
  //what do we want to call it in the frontend, pointer,
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (createUser) {
    const { _id, name, email, photo, phone, bio } = createUser;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Fill all fields email and password");
  }
  let user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Sorry no such user");
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  const token = generateToken(user._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      message: "User Loged in",
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid emial or password");
  }

  //get 3email and password from the user body and check if its right ok ?
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.status(200).json({
    message: "Succesfully loged out",
  });
});

const getUser = asyncHandler(async (req, res) => {
  res.send("user get");
});

module.exports = { registerUser, loginUser, logoutUser, getUser };
