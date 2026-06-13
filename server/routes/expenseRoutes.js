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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - category
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: Rent
 *               amount:
 *                 type: number
 *                 example: 7500
 *               category:
 *                 type: string
 *                 example: Living
 *               type:
 *                 type: string
 *                 enum:
 *                   - income
 *                   - expense
 *                 example: expense
 *     responses:
 *       201:
 *         description: Expense created successfully
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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: rent
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - income
 *             - expense
 *     responses:
 *       200:
 *         description: Expenses retrieved successfully
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Rent
 *               amount:
 *                 type: number
 *                 example: 9000
 *               category:
 *                 type: string
 *                 example: Living
 *               type:
 *                 type: string
 *                 enum:
 *                   - income
 *                   - expense
 *     responses:
 *       200:
 *         description: Expense updated successfully
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