import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputError } from "../middleware/validation";
import { FoodControllers } from "../controllers/FoodControllers";
import { ActivityControllers } from "../controllers/ActivityControllers";

const router = Router();

//Food routes
router.post(
  "/food",
  body("foodName").notEmpty().withMessage("Food name is required"),
  body("calories").notEmpty().withMessage("The calories are required"),
  body("calories")
    .isNumeric()
    .withMessage("Invalid input, calories needs to be a number"),
  handleInputError,
  FoodControllers.createFood
);

router.get("/food", FoodControllers.getAllFoods);

router.get(
  "/food/:id",
  param("id").isMongoId().withMessage("Invalid ID"),
  handleInputError,
  FoodControllers.getFoodById
);

router.put(
  "/food/:id",
  param("id").isMongoId().withMessage("Invalid ID"),
  body("foodName").notEmpty().withMessage("Food name is required"),
  body("calories").notEmpty().withMessage("The calories are required"),
  body("calories")
    .isNumeric()
    .withMessage("Invalid input, calories needs to be a number"),
  handleInputError,
  FoodControllers.updateFood
);

router.delete(
  "/food/:id",
  param("id").isMongoId().withMessage("Invalid ID"),
  handleInputError,
  FoodControllers.deleteFood
);

//Activity routes

router.post(
  "/activity",
  body("activityName").notEmpty().withMessage("Activity name is required"),
  body("calories").notEmpty().withMessage("The calories are required"),
  body("calories")
    .isNumeric()
    .withMessage("Invalid input, calories needs to be a number"),
  handleInputError,
  ActivityControllers.createActivity
);

router.get("/activity", ActivityControllers.getAllActivities);

router.get(
  "/activity/:id",
  param("id").isMongoId().withMessage("Invalid ID"),
  handleInputError,
  ActivityControllers.getActivityById
);

router.put(
  "/activity/:id",
  param("id").isMongoId().withMessage("Invalid ID"),
  body("activityName").notEmpty().withMessage("Activity name is required"),
  body("calories").notEmpty().withMessage("The calories are required"),
  body("calories")
    .isNumeric()
    .withMessage("Invalid input, calories needs to be a number"),
  handleInputError,
  ActivityControllers.updateActivity
);

router.delete(
  "/activity/:id",
  param("id").isMongoId().withMessage("Invalid ID"),
  handleInputError,
  ActivityControllers.deleteActivity
);

export default router;
