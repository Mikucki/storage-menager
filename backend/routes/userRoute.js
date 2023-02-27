const { Router } = require("express");
const cookieParser = require("cookie-parser");
const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
} = require("../controllers/userController.js");
const protect = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/register", protect, registerUser);
router.post("/login", protect, loginUser);
router.get("/logout", protect, logoutUser);
router.get("/getuser", protect, getUser);

module.exports = router;
