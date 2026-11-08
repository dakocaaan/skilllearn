
const User = require("../models/User");
const Material = require("../models/Material");
const Favorite = require("../models/Favorite");
const LearningHistory = require("../models/LearningHistory");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const [
      totalMaterials,
      totalFavorites,
      totalStarted
    ] = await Promise.all([
      Material.countDocuments(),
      Favorite.countDocuments({ user: req.user.id }),
      LearningHistory.countDocuments({ user: req.user.id })
    ]);

    res.json({
      user,
      stats: {
        totalMaterials,
        totalFavorites,
        totalStarted
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load profile"
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Name is required"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile"
    });
  }
};
