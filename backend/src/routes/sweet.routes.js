const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  addSweet,
  getSweets,
  updateSweet,
  deleteSweet,
  searchSweets,
  purchaseSweet,
  restockSweet
} = require("../controllers/sweet.controller");

router.post("/", authMiddleware, addSweet);
router.get("/", getSweets);
router.put("/:id", authMiddleware, updateSweet);
router.delete("/:id", authMiddleware, deleteSweet);
router.get("/search", searchSweets);
router.post("/purchase/:id", authMiddleware, purchaseSweet);
router.post("/restock/:id", authMiddleware, restockSweet);

module.exports = router;
