import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error("The user already exists");
        return res.status(409).json({ error: error.message });
      }
      const user = new User(req.body);

      user.password = await hashPassword(password);

      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("Check your email for the confirmation code");
    } catch (error) {
      res.status(500).json({ error: "An error has occurred" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error("Not valid token");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      res.send("Account confirmed successfully");
    } catch (error) {
      res.status(500).json({ error: "An error has occurred" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("User does not exists");
        return res.status(404).json({ error: error.message });
      }

      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "We sent an email with the confirmation token. Please confirm you account first"
        );
        return res.status(401).json({ error: error.message });
      }

      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("Incorrect password");
        return res.status(401).json({ error: error.message });
      }
      const token = generateJWT({ id: user.id });
      res.send(token);
    } catch (error) {
      res.status(500).json({ error: "An error has occurred" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("The user is not registered");
        return res.status(404).json({ error: error.message });
      }

      if (user.confirmed) {
        const error = new Error("The user is confirmed already");
        return res.status(403).json({ error: error.message });
      }

      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("We sent you a new token to your email");
    } catch (error) {
      res.status(500).json({ error: "An error has occurred" });
    }
  };

  static validToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error("Not valid token");
        return res.status(404).json({ error: error.message });
      }

      res.send("Valid token");
    } catch (error) {
      res.status(500).json({ error: "An error has occurred" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("The user is not registered");
        return res.status(404).json({ error: error.message });
      }

      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save();

      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send("Check your email for instructions");
    } catch (error) {
      res.status(500).json({ error: "An error has occurred" });
    }
  };

  static resetPasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Not valid token");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);

      user.password = await hashPassword(password);

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      res.send("Your new password has been changed successfully");
    } catch (error) {
      res.status(500).json({ error: "An error has occurred" });
    }
  };
}
