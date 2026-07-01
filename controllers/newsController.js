const mongoose = require("mongoose");
const {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  bookmarkArticle,
  removeBookmark,
  getBookmarks,
  likeArticle,
  unlikeArticle,
  getLikedArticles,
  saveReadingHistory,
  getReadingHistory,
  incrementViews,
  getTrendingArticles,
} = require("../services/newsService");
const User = require("../models/User");
const Article = require("../models/Article");
const { updateUserInterest } = require("../services/userInterestService");

const addArticle = async (req, res) => {
  try {
    const { title, description, content, category } = req.body;

    if (!title || !description || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }
    const article = await createArticle(req.body);

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getArticles = async (req, res) => {
  try {
    const result = await getAllArticles(req.query);

    res.status(200).json({
      success: true,

      total: result.total,

      page: result.page,

      limit: result.limit,

      count: result.articles.length,

      data: result.articles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getArticle = async (req, res) => {
  try {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Article ID",
      });
    }

    // const article = await getArticleById(req.params.id);
    const article = await incrementViews(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,

      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const editArticle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Article ID",
      });
    }

    const article = await updateArticle(req.params.id, req.body);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: article,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeArticle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Article ID",
      });
    }

    const article = await deleteArticle(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addBookmark = async (req, res) => {
  try {
    await bookmarkArticle(req.user._id, req.params.id);

    res.status(200).json({
      success: true,

      message: "Article bookmarked",
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

const deleteBookmark = async (req, res) => {
  try {
    await removeBookmark(req.user._id, req.params.id);

    res.status(200).json({
      success: true,

      message: "Bookmark removed",
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

const fetchBookmarks = async (req, res) => {
  try {
    const bookmarks = await getBookmarks(req.user._id);

    res.status(200).json({
      success: true,

      count: bookmarks.length,

      data: bookmarks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const addLike = async (req, res) => {
  try {
    await likeArticle(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Article liked successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const removeLike = async (req, res) => {
  try {
    await unlikeArticle(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Like removed successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const fetchLikedArticles = async (req, res) => {
  try {
    const articles = await getLikedArticles(req.user._id);

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addReadingHistory = async (req, res) => {
  try {
    await saveReadingHistory(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Reading history updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const fetchReadingHistory = async (req, res) => {
  try {
    const history = await getReadingHistory(req.user._id);

    res.status(200).json({
      success: true,

      count: history.length,

      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const getTrendingNews = async (req, res) => {
  try {
    const news = await getTrendingArticles();

    res.status(200).json({
      success: true,

      count: news.length,

      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const getNewsById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    console.log("========== GET NEWS ==========");
    console.log("req.user:", req.user);
    console.log("==============================");
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // Increase view count
    article.views += 1;
    await article.save();

    // Update reading history only for logged-in users
    if (req.user) {
      console.log("User authenticated:", req.user.id);
      const user = await User.findById(req.user.id);
console.log("User found:", !!user);

if (user) {
    console.log("Reading History Before:", user.readingHistory);
}
      if (user) {
        if (!user.readingHistory) {
          user.readingHistory = [];
        }

        const existing = user.readingHistory.find(
          (item) => item.article.toString() === article._id.toString(),
        );

        if (existing) {
          // Update last viewed time
          existing.viewedAt = new Date();
        } else {
          // Add new history entry
          user.readingHistory.push({
            article: article._id,
            viewedAt: new Date(),
          });
        }

        // Save preferred category
        await updateUserInterest(req.user.id, article.category);

        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
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
  addReadingHistory,
  fetchReadingHistory,
  getTrendingNews,
  getNewsById,
};
