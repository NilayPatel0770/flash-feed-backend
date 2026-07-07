const User = require("../models/User");
const Article = require("../models/Article");

// Add article to reading history
const addToHistory = async (req, res) => {
    try {

        const { articleId } = req.params;

        const user = await User.findById(req.user.id);

        const article = await Article.findById(articleId);

        if (!user || !article) {
            return res.status(404).json({
                success: false,
                message: "User or Article not found"
            });
        }

        // Increment article views
        article.views += 1;
        await article.save();

        // Check if article already exists in history
        const existing = user.readingHistory.find(
            item => item.article.toString() === articleId
        );

        if (existing) {

            existing.viewedAt = new Date();

        } else {

            user.readingHistory.push({
                article: articleId,
                viewedAt: new Date()
            });

        }

        await user.save();

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


// Get Reading History
const getReadingHistory = async (userId) => {

    const user = await User.findById(userId)
        .populate("readingHistory.article");

    user.readingHistory =
        user.readingHistory.filter(
            item => item.article
        );

    await user.save();

    return user.readingHistory;

};


// Clear Reading History
const clearReadingHistory = async (req, res) => {

    try {

        await User.findByIdAndUpdate(
            req.user.id,
            {
                readingHistory: []
            }
        );

        res.status(200).json({
            success: true,
            message: "Reading history cleared"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    addToHistory,
    getReadingHistory,
    clearReadingHistory
};