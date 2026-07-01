const User = require("../models/User");
const Article = require("../models/Article");

// Add Bookmark
const addBookmark = async (req, res) => {
  try {
    const { articleId } = req.params;

    const user = await User.findById(req.user.id);

    const article = await Article.findById(articleId);

    if (!user || !article) {
      return res.status(404).json({
        success: false,
        message: "User or Article not found",
      });
    }

    const exists = user.bookmarks.some((id) => id.toString() === articleId);

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Article already bookmarked",
      });
    }

    user.bookmarks.push(articleId);
    await user.save();

    article.bookmarks += 1;
    await article.save();
    await updateUserInterest(req.user.id, article.category);

    res.status(200).json({
      success: true,
      message: "Bookmark added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Bookmark
const removeBookmark = async (req, res) => {
  try {
    const { articleId } = req.params;

    const user = await User.findById(req.user.id);

    const article = await Article.findById(articleId);

    if (!user || !article) {
      return res.status(404).json({
        success: false,
        message: "User or Article not found",
      });
    }

    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== articleId);

    await user.save();

    if (article.bookmarks > 0) {
      article.bookmarks -= 1;
    }

    await article.save();

    res.status(200).json({
      success: true,
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Bookmarks
const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("bookmarks");

    res.status(200).json({
      success: true,
      count: user.bookmarks.length,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  getBookmarks,
};
