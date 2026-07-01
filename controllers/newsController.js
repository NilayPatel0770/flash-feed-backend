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
  getTrendingArticles
} = require("../services/newsService");

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

        await saveReadingHistory(
            req.user._id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Reading history updated"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const fetchReadingHistory = async (req, res) => {

    try {

        const history =
            await getReadingHistory(req.user._id);

        res.status(200).json({

            success: true,

            count: history.length,

            data: history

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getTrendingNews = async (req, res) => {

    try {

        const news =
            await getTrendingArticles();

        res.status(200).json({

            success: true,

            count: news.length,

            data: news

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getNewsById = async (req, res) => {

    const article = await Article.findById(req.params.id);

    if (!article) {
        return res.status(404).json({
            success: false,
            message: "Article not found"
        });
    }

    await User.findByIdAndUpdate(
        req.user.id,
        {
            $push: {
                readingHistory: {
                    article: article._id
                }
            }
        }
    );

    res.json(article);
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
  getNewsById
};
