const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger");

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.send("Expense Tracker API Running");
});

const PORT = process.env.PORT || 5000;

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});