import type { Request, Response } from "express";
import Expense from "../models/Expense";
import Budget from "../models/Budget";

export class ExpenseControllers {
  static createExpense = async (req: Request, res: Response) => {
    const expense = new Expense(req.body);

    try {
      await expense.save();
      res.send("Expense created successfully");
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static getAllExpenses = async (req: Request, res: Response) => {
    try {
      const expenses = await Expense.find({});
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
      const budget = await Budget.find({});
      res.json(budget);
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static getExpensesByCategory = async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      const expenses = await Expense.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate as string),
              $lte: new Date(endDate as string),
            },
          },
        },
        {
          $group: {
            _id: "$category",
            quantity: { $sum: "$quantity" },
          },
        },
        {
          $project: {
            category: "$_id",
            quantity: 1,
            _id: 0,
          },
        },
      ]);

      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error });
    }
  };
}
