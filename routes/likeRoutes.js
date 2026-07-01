const express = require("express");
const router = express.Router();

const {
    likeArticle,
    unlikeArticle,
    getLikedArticles
} = require("../controllers/likeController");

const protect  = require("../middleware/authMiddleware");

// Like an article
router.post("/:articleId", protect, likeArticle);

// Unlike an article
router.delete("/:articleId", protect, unlikeArticle);

// Get all liked articles
router.get("/", protect, getLikedArticles);

module.exports = router;