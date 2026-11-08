
const express = require("express");
const router = express.Router();

const {
  getMaterials,
  getMaterialById
} = require("../controllers/materialController");

const authMiddleware = require("../middleware/authMiddleware");

// All learning materials require login
router.get("/", authMiddleware, getMaterials);

router.get("/:id", authMiddleware, getMaterialById);

module.exports = router;
