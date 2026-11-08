
const mongoose = require("mongoose");
const LearningHistory = require("../models/LearningHistory");
const Material = require("../models/Material");

exports.getHistory = async (req, res) => {
  try {
    const history = await LearningHistory.find({
      user: req.user.id
    })
      .populate("material")
      .sort({ lastAccessed: -1 });

    res.json({
      count: history.length,
      history: history.filter((item) => item.material)
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load learning history"
    });
  }
};

exports.recordHistory = async (req, res) => {
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

    const record = await LearningHistory.findOneAndUpdate(
      { user: req.user.id, material: materialId },
      {
        $set: { lastAccessed: new Date() },
        $inc: { accessCount: 1 },
        $setOnInsert: {
          user: req.user.id,
          material: materialId
        }
      },
      { upsert: true, new: true }
    );

    res.json({
      message: "Learning activity recorded",
      record
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to record learning history"
    });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    await LearningHistory.deleteMany({
      user: req.user.id
    });

    res.json({
      message: "Learning history cleared"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear learning history"
    });
  }
};
