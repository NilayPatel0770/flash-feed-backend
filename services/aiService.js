require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateSummary = async (content) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
Summarize this news article into 4 concise bullet points.

${content}
        `,
    });

    return response.text;
};

const generateKeywords = async (content) => {

    const response = await ai.models.generateContent({

        model: "gemini-2.5-flash",

        contents: `
Extract only 5 important keywords from this article.

Return ONLY a comma-separated list.

${content}

        `

    });

    return response.text;

};

const analyzeSentiment = async (content) => {

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: `
Analyze the sentiment of this news article.

Return ONLY ONE WORD:

Positive
Negative
Neutral

Article:
${content}
`
    });

    return response.text.trim();

};

module.exports = {
    generateSummary,
    generateKeywords,
    analyzeSentiment
};