const User = require("../models/User");
const Article = require("../models/Article");
const { updateUserInterest } = require("../services/userInterestService");

// Like Article
const likeArticle = async (req, res) => {
  try {
    const userId = req.user.id;
    const { articleId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // Prevent duplicate likes
    const alreadyLiked = user.likedArticles.some(
      (id) => id.toString() === articleId,
    );

    if (alreadyLiked) {
      return res.status(400).json({
        success: false,
        message: "Article already liked",
      });
    }

    user.likedArticles.push(articleId);
    await user.save();

    article.likes += 1;
    await article.save();
    await updateUserInterest(req.user.id, article.category);

    res.status(200).json({
      success: true,
      message: "Article liked successfully",
      likes: article.likes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Unlike Article
const unlikeArticle = async (req, res) => {
  try {
    const userId = req.user.id;
    const { articleId } = req.params;

    const user = await User.findById(userId);

    const article = await Article.findById(articleId);

    if (!user || !article) {
      return res.status(404).json({
        success: false,
        message: "User or Article not found",
      });
    }

    user.likedArticles = user.likedArticles.filter(
      (id) => id.toString() !== articleId,
    );

    await user.save();

    if (article.likes > 0) {
      article.likes -= 1;
    }

    await article.save();

    res.status(200).json({
      success: true,
      message: "Article unliked successfully",
      likes: article.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Liked Articles
const getLikedArticles = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("likedArticles");

    res.status(200).json({
      success: true,
      count: user.likedArticles.length,
      articles: user.likedArticles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  likeArticle,
  unlikeArticle,
  getLikedArticles,
};
