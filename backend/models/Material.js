
const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Dutch",
        "Japanese"
      ]
    },
    language: {
      type: String,
      enum: ["Dutch", "Japanese", null],
      default: null
    },
    level: {
      type: String,
      enum: [
        "Beginner",
        "Elementary",
        "Intermediate",
        "Advanced"
      ],
      default: "Beginner"
    },
    type: {
      type: String,
      enum: [
        "article",
        "video",
        "quiz",
        "practice",
        "course"
      ],
      required: true
    },
    resourceUrl: {
      type: String,
      required: true
    },
    sourceName: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      default: ""
    },
    isFree: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Material",
  materialSchema
);
