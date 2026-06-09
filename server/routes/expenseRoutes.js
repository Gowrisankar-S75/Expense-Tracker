const express = require("express");
const router = express.Router();

const {
  createExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
    getSummary,
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createExpense);
router.get("/", protect, getExpenses);
router.delete("/:id", protect, deleteExpense);
router.put("/:id", protect, updateExpense);
router.get("/summary", protect, getSummary);
module.exports = router;