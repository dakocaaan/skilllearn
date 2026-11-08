
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getFavorites,
  addFavorite,
  removeFavorite
} = require("../controllers/favoriteController");

router.use(authMiddleware);

router.get("/", getFavorites);
router.post("/", addFavorite);
router.delete("/:materialId", removeFavorite);

module.exports = router;
