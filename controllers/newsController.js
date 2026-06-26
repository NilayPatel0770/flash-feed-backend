const mongoose = require("mongoose");
const { createArticle, getAllArticles, getArticleById, updateArticle, deleteArticle } = require("../services/newsService");

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
                message: "Invalid Article ID"
            });
        }

        const article = await getArticleById(req.params.id);

        if (!article) {

            return res.status(404).json({
                success: false,
                message: "Article not found"
            });

        }

        res.status(200).json({

            success: true,

            data: article

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const editArticle = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Article ID"
            });

        }

        const article = await updateArticle(
            req.params.id,
            req.body
        );

        if (!article) {

            return res.status(404).json({
                success: false,
                message: "Article not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Article updated successfully",
            data: article
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const removeArticle = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Article ID"
            });

        }

        const article = await deleteArticle(req.params.id);

        if (!article) {

            return res.status(404).json({
                success: false,
                message: "Article not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Article deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
  addArticle,
  getArticles,
  getArticle,
  editArticle,
  removeArticle
};
