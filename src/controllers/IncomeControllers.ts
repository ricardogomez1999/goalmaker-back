import type { Request, Response } from "express";
import Income from "../models/Income";

export class IncomeControllers {
  static createIncome = async (req: Request, res: Response) => {
    const income = new Income(req.body);

    try {
      await income.save();
      res.send("Income created successfully");
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static getAllIncomes = async (req: Request, res: Response) => {
    try {
      const incomes = await Income.find({});
      res.json(incomes);
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static getIncomeById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const income = await Income.findById(id);

      if (!income) {
        const error = new Error("Not found Income");
        return res.status(404).json({ error: error.message });
      }
      res.json(income);
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static updateIncome = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const income = await Income.findByIdAndUpdate(id, req.body);

      if (!income) {
        const error = new Error("Not found Income");
        return res.status(404).json({ error: error.message });
      }

      await income.save();
      res.json("Income updated successfully");
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static deleteIncome = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const income = await Income.findById(id);

      if (!income) {
        const error = new Error("Not found Income");
        return res.status(404).json({ error: error.message });
      }

      await income.deleteOne();
      res.json("Income deleted successfully");
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static getCurrentMonthIncomes = async (req: Request, res: Response) => {
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

      const incomes = await Income.find({
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      });

      res.json(incomes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static getIncomesByDateRange = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    try {
      const incomes = await Income.find({
        createdAt: {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        },
      });
      res.json(incomes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static getIncomesByCategory = async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      const incomes = await Income.aggregate([
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

      res.json(incomes);
    } catch (error) {
      res.status(500).json({ error });
    }
  };
}
