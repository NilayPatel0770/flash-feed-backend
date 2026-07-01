const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addToHistory,
    getReadingHistory,
    clearReadingHistory
} = require("../controllers/historyController");

// Add article to reading history
router.post("/:articleId", protect, addToHistory);

// Get reading history
router.get("/", protect, getReadingHistory);

// Clear reading history
router.delete("/", protect, clearReadingHistory);

module.exports = router;