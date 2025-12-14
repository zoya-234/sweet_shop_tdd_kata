const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔒 protected route
router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Protected data",
  });
});

module.exports = router;
