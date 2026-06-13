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

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Expense created
 */
router.post("/", protect, createExpense);

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get all expenses
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of expenses
 */

router.get("/", protect, getExpenses);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted
 */
router.delete("/:id", protect, deleteExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     summary: Update expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense updated
 */

router.put("/:id", protect, updateExpense);

/**
 * @swagger
 * /summary:
 *   get:
 *     summary: Dashboard summary
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get("/summary", protect, getSummary);
module.exports = router;