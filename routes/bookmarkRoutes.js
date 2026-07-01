const express = require("express");
const router = express.Router();

const {
    addBookmark,
    removeBookmark,
    getBookmarks
} = require("../controllers/bookmarkController");

const protect = require("../middleware/authMiddleware");

// Add bookmark
router.post("/:articleId", protect, addBookmark);

// Remove bookmark
router.delete("/:articleId", protect, removeBookmark);

// Get all bookmarks
router.get("/", protect, getBookmarks);

module.exports = router;