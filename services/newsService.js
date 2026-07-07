const Article = require("../models/Article");
const User = require("../models/User");
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
  // Category Filter
  if (query.category) {
    filter.category = {
      $regex: `^${query.category}$`,
      $options: "i",
    };
  }

  // Search
  if (query.search) {
    filter.$or = [
      {
        title: {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        content: {
          $regex: query.search,
          $options: "i",
        },
      },
    ];
  }

  const total = await Article.countDocuments(filter);

  const articles = await Article.find(filter)
    .sort({ publishedAt : -1 })
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    articles,
  };
};
// Get Single Article
const getArticleById = async (id) => {
  const article = await Article.findById(id);

  return article;
};

// Update Article
const updateArticle = async (id, articleData) => {
  const article = await Article.findByIdAndUpdate(id, articleData, {
    new: true,
    runValidators: true,
  });

  return article;
};

// Delete Article
const deleteArticle = async (id) => {
  const article = await Article.findByIdAndDelete(id);

  return article;
};

const bookmarkArticle = async (userId, articleId) => {
  const user = await User.findById(userId);
  const article = await Article.findById(articleId);

  if (!user || !article) {
    throw new Error("User or Article not found");
  }

  if (user.bookmarks.includes(articleId)) {
    throw new Error("Article already bookmarked");
  }

  console.log("========== BOOKMARK DEBUG ==========");
  console.log("Before:", article.bookmarks);

  user.bookmarks.push(articleId);

  article.bookmarks += 1;

  console.log("After Increment:", article.bookmarks);

  await user.save();
  await article.save();

  const updatedArticle = await Article.findById(articleId);

  console.log("Saved In Mongo:", updatedArticle.bookmarks);
  console.log("===================================");

  return updatedArticle;
};

const removeBookmark = async (userId, articleId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const article = await Article.findById(articleId);

  user.bookmarks = user.bookmarks.filter((id) => id.toString() !== articleId);

  article.bookmarks = Math.max(article.bookmarks - 1, 0);

  await user.save();
  await article.save();

  return article;
};

const getBookmarks = async (userId) => {
  const user = await User.findById(userId).populate("bookmarks");

  return user.bookmarks;
};

const likeArticle = async (userId, articleId) => {
  const user = await User.findById(userId);
  const article = await Article.findById(articleId);

  if (!user || !article) {
    throw new Error("User or Article not found");
  }

  if (user.likedArticles.includes(articleId)) {
    throw new Error("Article already liked");
  }

  user.likedArticles.push(articleId);

  article.likes += 1;

  await user.save();
  await article.save();

  return article;
};

const unlikeArticle = async (userId, articleId) => {
  const user = await User.findById(userId);
  const article = await Article.findById(articleId);

  if (!user || !article) {
    throw new Error("User or Article not found");
  }

  user.likedArticles = user.likedArticles.filter(
    (id) => id.toString() !== articleId,
  );

  article.likes = Math.max(article.likes - 1, 0);

  await user.save();
  await article.save();

  return article;
};

const getLikedArticles = async (userId) => {
  const user = await User.findById(userId).populate("likedArticles");

  return user.likedArticles;
};

const saveReadingHistory = async (userId, articleId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const alreadyExists = user.readingHistory.find(
    (item) => item.article.toString() === articleId,
  );

  if (!alreadyExists) {
    user.readingHistory.push({
      article: articleId,
    });

    await user.save();
  }

  return user;
};

const getReadingHistory = async (userId) => {
  const user = await User.findById(userId).populate("readingHistory.article");

  return user.readingHistory;
};

const incrementViews = async (articleId) => {
  const article = await Article.findByIdAndUpdate(
    articleId,
    {
      $inc: {
        views: 1,
      },
    },
    {
      new: true,
    },
  );

  return article;
};

// const getTrendingArticles = async () => {
//   const filter = {};

// if (query.category) {
//     filter.category = query.category;
// }

// if (query.search) {
//     filter.$or = [
//         {
//             title: {
//                 $regex: query.search,
//                 $options: "i"
//             }
//         },
//         {
//             description: {
//                 $regex: query.search,
//                 $options: "i"
//             }
//         },
//         {
//             keywords: {
//                 $in: [new RegExp(query.search, "i")]
//             }
//         }
//     ];
// }
//     return await Article.find()
//         .sort({
//             views: -1,
//             likes: -1
//         })
//         .limit(10);

// };
const getTrendingArticles = async () => {
  return await Article.find()

    .sort({
      views: -1,
      likes: -1,
      publishedAt: -1,
    })

    .limit(20);
};

module.exports = {
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
  getTrendingArticles,
};
