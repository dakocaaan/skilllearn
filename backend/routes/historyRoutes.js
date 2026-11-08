
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getHistory,
  recordHistory,
  clearHistory
} = require("../controllers/historyController");

router.use(authMiddleware);

router.get("/", getHistory);
router.post("/", recordHistory);
router.delete("/", clearHistory);

module.exports = router;
