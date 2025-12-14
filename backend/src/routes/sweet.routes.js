const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  addSweet,
  getSweets,
} = require("../controllers/sweet.controller");

router.post("/", authMiddleware, addSweet);
router.get("/", getSweets);

module.exports = router;
