
const mongoose = require("mongoose");
const Favorite = require("../models/Favorite");
const Material = require("../models/Material");

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.user.id
    })
      .populate("material")
      .sort({ createdAt: -1 });

    res.json({
      count: favorites.length,
      favorites: favorites.filter((item) => item.material)
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load favorites"
    });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { materialId } = req.body;

    if (!mongoose.isValidObjectId(materialId)) {
      return res.status(400).json({
        message: "Invalid material ID"
      });
    }

    const material = await Material.findById(materialId);

    if (!material) {
      return res.status(404).json({
        message: "Material not found"
      });
    }

    const favorite = await Favorite.findOneAndUpdate(
      { user: req.user.id, material: materialId },
      { $setOnInsert: { user: req.user.id, material: materialId } },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Material saved to favorites",
      favorite
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save favorite"
    });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.materialId)) {
      return res.status(400).json({
        message: "Invalid material ID"
      });
    }

    await Favorite.findOneAndDelete({
      user: req.user.id,
      material: req.params.materialId
    });

    res.json({
      message: "Material removed from favorites"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove favorite"
    });
  }
};
