
const Material = require("../models/Material");

// GET ALL MATERIALS
exports.getMaterials = async (req, res) => {
  try {
    const { category, language, level, type, search } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (language) filter.language = language;
    if (level) filter.level = level;
    if (type) filter.type = type;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const materials = await Material.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: materials.length,
      materials
    });

  } catch (error) {
    console.error("Get materials error:", error.message);

    res.status(500).json({
      message: "Failed to retrieve materials."
    });
  }
};

// GET MATERIAL BY ID
exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: "Learning material not found."
      });
    }

    res.status(200).json(material);

  } catch (error) {
    res.status(400).json({
      message: "Invalid material ID."
    });
  }
};

module.exports = {
  getMaterials: exports.getMaterials,
  getMaterialById: exports.getMaterialById
};
