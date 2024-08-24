import { Request, Response } from "express";
import Activity from "../models/Activity";

export class ActivityControllers {
  static createActivity = async (req: Request, res: Response) => {
    const activity = new Activity(req.body);

    try {
      await activity.save();
      res.send("Activity created successfully");
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static getAllActivities = async (req: Request, res: Response) => {
    try {
      const activity = await Activity.find({});
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static getActivityById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const activity = await Activity.findById(id);

      if (!activity) {
        const error = new Error("Not found activity");
        return res.status(404).json({ error: error.message });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static updateActivity = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const activity = await Activity.findByIdAndUpdate(id, req.body);

      if (!activity) {
        const error = new Error("Not found activity");
        return res.status(404).json({ error: error.message });
      }

      await activity.save();
      res.send("Activity has been updated successfully");
    } catch (error) {
      res.status(500).json({ error });
    }
  };

  static deleteActivity = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const activity = await Activity.findById(id);

      if (!activity) {
        const error = new Error("Not found activity");
        return res.status(404).json({ error: error.message });
      }

      await activity.deleteOne();
      res.send("Acitvity record has been deleted successfully");
    } catch (error) {
      res.status(500).json({ error });
    }
  };
}
