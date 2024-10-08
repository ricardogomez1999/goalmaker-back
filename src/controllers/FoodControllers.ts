import { Request, Response } from "express";
import Food from "../models/Food";

export class FoodControllers {
  static createFood = async (req: Request, res: Response) => {
    const food = new Food(req.body);

    food.user = req.user.id;
    try {
      await food.save();
      res.send("Food created successfully");
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static getAllFoods = async (req: Request, res: Response) => {
    try {
      const food = await Food.find({
        $or: [{ user: { $in: req.user.id } }],
      });
      res.json(food);
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static getFoodById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const food = await Food.findById(id);

      if (!food) {
        const error = new Error("Food record does not exists");
        return res.status(404).json({ error: error.message });
      }

      if (food.user.toString() !== req.user.id.toString()) {
        const error = new Error("Not valid action");
        return res.status(409).json({ error: error.message });
      }

      res.json(food);
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static updateFood = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const food = await Food.findByIdAndUpdate(id, req.body);

      if (!food) {
        const error = new Error("Food record does not exists");
        return res.status(404).json({ error: error.message });
      }
      if (food.user.toString() !== req.user.id.toString()) {
        const error = new Error("Not valid action");
        return res.status(409).json({ error: error.message });
      }

      await food.save();
      res.send("Food record has been updated successfully");
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static deleteFood = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const food = await Food.findById(id);

      if (!food) {
        const error = new Error("Food record does not exists");
        return res.status(404).json({ error: error.message });
      }

      if (food.user.toString() !== req.user.id.toString()) {
        const error = new Error("Not valid action");
        return res.status(409).json({ error: error.message });
      }

      await food.deleteOne();
      res.send("Food record has been deleted successfully");
    } catch (error) {
      res.status(500).json({ error });
    }
  };
}
