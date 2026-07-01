const axios = require("axios");

const getRecommendations = async (req, res) => {
    try {
        const { articleId } = req.params;

        const response = await axios.get(
            `http://127.0.0.1:8000/recommend/${articleId}`
        );

        res.status(200).json(response.data);

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch recommendations"
        });
    }
};

module.exports = {
    getRecommendations
};