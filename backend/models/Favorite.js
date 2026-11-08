
const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true
    }
  },
  { timestamps: true }
);

// Prevent a user from saving the same material twice
favoriteSchema.index(
  { user: 1, material: 1 },
  { unique: true }
);

module.exports = mongoose.model("Favorite", favoriteSchema);
