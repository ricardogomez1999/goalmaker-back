import { Router } from "express";
import { body, param, query } from "express-validator";
import { ExpenseControllers } from "../controllers/ExpenseController";
import { handleInputError } from "../middleware/validation";
import { IncomeControllers } from "../controllers/IncomeControllers";
import { TransactionController } from "../controllers/TransactionsController";
import { authenticate } from "../middleware/auth";

const router = Router();

//Expenses Routes
router.use(authenticate);

router.post(
  "/expense",
  body("name").notEmpty().withMessage("The expense name is mandatory"),
  body("quantity").notEmpty().withMessage("The quatity is mandatory"),
  body("quantity").isNumeric().withMessage("The quatity needs to be a number"),
  body("category").notEmpty().withMessage("The category is mandatory"),
  handleInputError,
  ExpenseControllers.createExpense
);
router.get("/expense", ExpenseControllers.getAllExpenses);
router.get(
  "/expense/current-month",
  ExpenseControllers.getCurrentMonthExpenses
);
router.get(
  "/expense/by-date-range",
  query("startDate").notEmpty().withMessage("start date is mandatory"),
  query("endDate").notEmpty().withMessage("end date is mandatory"),
  handleInputError,
  ExpenseControllers.getExpensesByDateRange
);
router.get(
  "/expense/:id",
  param("id").isMongoId().withMessage("Not valid ID"),
  handleInputError,
  ExpenseControllers.getExpenseById
);

router.put(
  "/expense/:id",
  param("id").isMongoId().withMessage("Not valid ID"),
  body("name").notEmpty().withMessage("The expense name is mandatory"),
  body("quantity").notEmpty().withMessage("The quatity is mandatory"),
  body("quantity").isNumeric().withMessage("The quatity needs to be a number"),
  body("category").notEmpty().withMessage("The category is mandatory"),
  handleInputError,
  ExpenseControllers.updateExpense
);

router.delete(
  "/expense/:id",
  param("id").isMongoId().withMessage("Not valid ID"),
  handleInputError,
  ExpenseControllers.deleteExpense
);

router.get("/expenses-by-category", ExpenseControllers.getExpensesByCategory);

//Income
router.post(
  "/income",
  body("name").notEmpty().withMessage("The expense name is mandatory"),
  body("quantity").notEmpty().withMessage("The quatity is mandatory"),
  body("quantity").isNumeric().withMessage("The quatity needs to be a number"),
  body("category").notEmpty().withMessage("The category is mandatory"),
  handleInputError,
  IncomeControllers.createIncome
);
router.get("/income", IncomeControllers.getAllIncomes);
router.get("/income/current-month", IncomeControllers.getCurrentMonthIncomes);
router.get(
  "/income/by-date-range",
  query("startDate").notEmpty().withMessage("start date is mandatory"),
  query("endDate").notEmpty().withMessage("end date is mandatory"),
  handleInputError,
  IncomeControllers.getIncomesByDateRange
);
router.get(
  "/income/:id",
  param("id").isMongoId().withMessage("Not valid ID"),
  handleInputError,
  IncomeControllers.getIncomeById
);

router.put(
  "/income/:id",
  param("id").isMongoId().withMessage("Not valid ID"),
  body("name").notEmpty().withMessage("The expense name is mandatory"),
  body("quantity").notEmpty().withMessage("The quatity is mandatory"),
  body("quantity").isNumeric().withMessage("The quatity needs to be a number"),
  body("category").notEmpty().withMessage("The category is mandatory"),
  handleInputError,
  IncomeControllers.updateIncome
);

router.delete(
  "/income/:id",
  param("id").isMongoId().withMessage("Not valid ID"),
  handleInputError,
  IncomeControllers.deleteIncome
);

router.get("/incomes-by-category", IncomeControllers.getIncomesByCategory);

//Budget
router.post(
  "/budget",
  body("quantity").notEmpty().withMessage("You need to enter a budget"),
  body("quantity").isNumeric().withMessage("Budget needs to be a number"),
  handleInputError,
  ExpenseControllers.createBudget
);

//Latest transactions
router.get("/transactions", TransactionController.getLatestTransactions);

router.get("/budget", ExpenseControllers.getUsersBudget);
export default router;
