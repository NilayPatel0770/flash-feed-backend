const axios = require("axios");
const User = require("../models/User");

const {
    generateUserEmbedding
} = require("../services/userEmbeddingService");

const getPersonalizedRecommendations = async (req, res) => {
console.log(">>> Controller Hit <<<");
    try {

        const user = await User.findById(req.user.id);
        console.log("User Found:", !!user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const embedding = await generateUserEmbedding(user);

        console.log("Embedding Length:", embedding.length);

console.log("Calling FastAPI...");

        if (embedding.length === 0) {
            return res.status(400).json({
                success: false,
                message: "User has no embeddings"
            });
        }

        const response = await axios.post(
            "http://127.0.0.1:8000/recommend/personalized",
            {
                embedding
            }
        );

        res.json(response.data);

    } catch (error) {

    console.log("========== AXIOS ERROR ==========");

    console.log("Message:", error.message);

    if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Response Data:", JSON.stringify(error.response.data, null, 2));
    }

    if (error.request) {
        console.log("No response received from FastAPI");
    }

    console.log("===============================");

    return res.status(500).json({
        success: false,
        message: error.response?.data || error.message
    });
}

};

module.exports = {
    getPersonalizedRecommendations
};