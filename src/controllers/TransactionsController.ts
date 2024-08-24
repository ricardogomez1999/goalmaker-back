import { Request, Response } from "express";
import Expense from "../models/Expense";
import Income from "../models/Income";

export class TransactionController {
  static getLatestTransactions = async (req: Request, res: Response) => {
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
      const [expenses, incomes] = await Promise.all([
        Expense.find({
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        }),
        Income.find({
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        }),
      ]);

      const expenseTransactions = expenses.map((expense) => ({
        ...expense.toObject(),
        quantity: -Math.abs(expense.quantity),
      }));

      const incomeTransactions = incomes.map((income) => ({
        ...income.toObject(),
        quantity: income.quantity,
      }));

      const transactions = [...expenseTransactions, ...incomeTransactions].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
