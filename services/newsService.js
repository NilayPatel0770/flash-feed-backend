const Article = require("../models/Article");

// Create Article
const createArticle = async (articleData) => {
    return await Article.create(articleData);
};

// Get All Articles
const getAllArticles = async (query) => {

    const page = parseInt(query.page) || 1;

    const limit = parseInt(query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {};

    // Category Filter
    if (query.category) {
        filter.category = query.category;
    }

    // Search
    if (query.search) {
        filter.$or = [
            {
                title: {
                    $regex: query.search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: query.search,
                    $options: "i"
                }
            },
            {
                content: {
                    $regex: query.search,
                    $options: "i"
                }
            }
        ];
    }

    const total = await Article.countDocuments(filter);

    const articles = await Article.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return {
        total,
        page,
        limit,
        articles
    };

};
// Get Single Article
const getArticleById = async (id) => {

    const article = await Article.findById(id);

    return article;

};

// Update Article
const updateArticle = async (id, articleData) => {
    const article = await Article.findByIdAndUpdate(
        id,
        articleData,
        {
            new: true,
            runValidators: true,
        }
    );

    return article;
};

// Delete Article
const deleteArticle = async (id) => {

    const article = await Article.findByIdAndDelete(id);

    return article;

};

module.exports = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle
};