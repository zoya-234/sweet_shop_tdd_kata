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

// Public / user routes
router.get("/", getSweets);
router.put("/:id", authMiddleware, updateSweet);
router.post("/purchase/:id", authMiddleware, purchaseSweet);
router.get("/search", searchSweets);


// Admin-only routes
router.post("/", auth, admin, addSweet);          // ✅ admin
router.delete("/:id", auth, admin, deleteSweet);  // ✅ admin
router.post("/restock/:id", auth, admin, restockSweet); // ✅ admin



module.exports = router;
