const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
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
router.put("/:id", auth, updateSweet);
router.post("/purchase/:id", auth, purchaseSweet);
router.get("/search", searchSweets);


// Admin-only routes
router.post("/", auth, admin, addSweet);          // ✅ admin
router.delete("/:id", auth, admin, deleteSweet);  // ✅ admin
router.post("/restock/:id", auth, admin, restockSweet); // ✅ admin



module.exports = router;
