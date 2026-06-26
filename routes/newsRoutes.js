const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addArticle,
  getArticles,
  getArticle,
  editArticle,
  removeArticle,
  addBookmark,
  deleteBookmark,
  fetchBookmarks,
  addLike,
  removeLike,
  fetchLikedArticles,
} = require("../controllers/newsController");

router.post("/", addArticle);
router.get("/", getArticles);
router.get("/liked", protect, fetchLikedArticles);

router.post("/:id/like", protect, addLike);
router.delete("/:id/like", protect, removeLike);

router.post("/:id/bookmark", protect, addBookmark);
router.delete("/:id/bookmark", protect, deleteBookmark);
router.get("/bookmarks", protect, fetchBookmarks);

router.get("/:id", getArticle);
router.put("/:id", editArticle);
router.delete("/:id", removeArticle);

module.exports = router;
