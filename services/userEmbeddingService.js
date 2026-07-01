const Article = require("../models/Article");

const generateUserEmbedding = async (user) => {

    const vectors = [];

    console.log("================================");
console.log("Reading History Count:", user.readingHistory.length);

for (const item of user.readingHistory) {

    console.log("Searching Article:", item.article.toString());

    const article = await Article.findById(item.article);

    if (!article) {
        console.log("❌ Article NOT FOUND");
        continue;
    }

    console.log("✅ Article Found:", article.title);
    console.log("Embedding Exists:", !!article.embedding);
    console.log("Embedding Length:", article.embedding?.length);

    if (article.embedding && article.embedding.length > 0) {
        vectors.push(article.embedding);
        console.log("✅ Embedding Added");
    }
}

console.log("Total Vectors:", vectors.length);
console.log("================================");

    // Liked Articles
    for (const id of user.likedArticles) {

        const article = await Article.findById(id);

        if (
            article &&
            article.embedding &&
            article.embedding.length
        ) {
            vectors.push(article.embedding);
        }

    }

    // Bookmarks
    for (const id of user.bookmarks) {

        const article = await Article.findById(id);

        if (
            article &&
            article.embedding &&
            article.embedding.length
        ) {
            vectors.push(article.embedding);
        }

    }

    if (vectors.length === 0) {
        return [];
    }

    const dimension = vectors[0].length;

    const average = Array(dimension).fill(0);

    vectors.forEach(vector => {

        vector.forEach((value, index) => {

            average[index] += value;

        });

    });
    console.log("Vectors:", vectors.length);

if (vectors.length > 0) {
    console.log("Embedding Length:", vectors[0].length);
}

    return average.map(value => value / vectors.length);

};

module.exports = {
    generateUserEmbedding
};