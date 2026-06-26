const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    author: {
      type: String,
      default: "Unknown",
    },

    source: {
      type: String,
      default: "Flash Feed",
    },

    sourceUrl: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    publishedAt: {
      type: Date,
      default: Date.now,
    },

    // AI Fields
    summary: {
      type: String,
      default: "",
    },

    keywords: {
      type: [String],
      default: [],
    },

    embedding: {
      type: [Number],
      default: [],
    },

    sentiment: {
    type: String,
    enum: ["Positive", "Negative", "Neutral"],
    default: "Neutral",
},

    // Statistics
    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    bookmarks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Article", articleSchema);
