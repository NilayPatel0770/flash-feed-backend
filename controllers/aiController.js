const { generateSummary , generateKeywords: generateKeywordsService, analyzeSentiment} = require("../services/aiService");

const summarizeArticle = async (req, res) => {
    try {

        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required",
            });
        }

        const summary = await generateSummary(content);

        res.status(200).json({
            success: true,
            summary,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const generateKeywords = async (req, res) => {

    try {

        const { content } = req.body;

        const keywords =
            await aiService.generateKeywordsService(content);

        res.status(200).json({

            success:true,

            keywords:
                keywords.split(",")

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

const getSentiment = async (req, res) => {

    try {

        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }

        const sentiment = await analyzeSentiment(content);

        res.status(200).json({
            success: true,
            sentiment
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    summarizeArticle,
    generateKeywords,
    getSentiment
};