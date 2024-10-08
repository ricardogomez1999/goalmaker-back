import type { Request, Response } from "express";
import Expense from "../models/Expense";
import Budget from "../models/Budget";
import mongoose from "mongoose";

export class ExpenseControllers {
  static createExpense = async (req: Request, res: Response) => {
    const expense = new Expense(req.body);

    expense.user = req.user.id;

    try {
      await expense.save();
      res.send("Expense created successfully");
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static getAllExpenses = async (req: Request, res: Response) => {
    try {
      const expenses = await Expense.find({
        $or: [{ user: { $in: req.user.id } }],
      });
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static getExpenseById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const expense = await Expense.findById(id);

      if (!expense) {
        const error = new Error("Not found expense");
        return res.status(404).json({ error: error.message });
      }
      res.json(expense);
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static updateExpense = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const expense = await Expense.findByIdAndUpdate(id, req.body);

      if (!expense) {
        const error = new Error("Not found expense");
        return res.status(404).json({ error: error.message });
      }

      await expense.save();
      res.json("Expense updated successfully");
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static deleteExpense = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const expense = await Expense.findById(id);

      if (!expense) {
        const error = new Error("Not found expense");
        return res.status(404).json({ error: error.message });
      }

      await expense.deleteOne();
      res.json("Expense deleted successfully");
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static getCurrentMonthExpenses = async (req: Request, res: Response) => {
    try {
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      const endOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      );

      const expenses = await Expense.find({
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
        $or: [{ user: { $in: req.user.id } }],
      });

      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static getExpensesByDateRange = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    try {
      const expenses = await Expense.find({
        createdAt: {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        },
        $or: [{ user: { $in: req.user.id } }],
      });
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static createBudget = async (req: Request, res: Response) => {
    const budget = new Budget(req.body);

    try {
      await budget.save();
      res.send("Budget created successfully");
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static getUsersBudget = async (req: Request, res: Response) => {
    try {
      const budget = await Budget.find({
        $or: [{ user: { $in: req.user.id } }],
      });
      res.json(budget);
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static getExpensesByCategory = async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      const expenses = await Expense.find({
        user: req.user.id, // Filter by user ID
        createdAt: {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        },
      });

      if (!expenses.length) {
        return res.json([]); // Return an empty array if no expenses are found
      }

      // Step 2: Group expenses by category and calculate the total for each category
      const categoryTotals = expenses.reduce((acc, expense) => {
        const category = expense.category;

        // Initialize the category total if it doesn't exist
        if (!acc[category]) {
          acc[category] = 0;
        }

        // Add the expense quantity to the total for the category
        acc[category] += expense.quantity;

        return acc;
      }, {} as Record<string, number>); // Using Record to define category and total amounts

      // Step 3: Format the result into an array of objects
      const result = Object.keys(categoryTotals).map((category) => ({
        category,
        totalAmount: categoryTotals[category],
      }));

      res.json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  };
}
