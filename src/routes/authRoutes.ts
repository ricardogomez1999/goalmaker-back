import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputError } from "../middleware/validation";

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("The name cannot be empty"),
  body("password").notEmpty().withMessage("The password is mandatory"),
  body("password")
    .isLength({ min: 8 })
    .withMessage(
      "The password is too short, and needs to be at least 8 characters"
    ),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("The passwords do not match");
    }
    return true;
  }),
  body("email").isEmail().withMessage("Not valid email"),
  handleInputError,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("Token cannot be empty"),
  handleInputError,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Not valid email"),
  body("password").notEmpty().withMessage("The password is mandatory"),
  handleInputError,
  AuthController.login
);

export default router;
