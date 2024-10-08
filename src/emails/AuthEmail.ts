import { transporter } from "../config/nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "GoalMaker APP <info@goalmaker.com>",
      to: user.email,
      subject: "GoalMaker - Confirm your account",
      text: "GoalMaker - Confirm your email",
      html: `<p>Hello ${user.name}, you have created your account in GoalMaker App, almost done, you only need to confirm your account</p>
        <p>Please click here to confirm your account</p>
        <a href="${process.env.FRONTEND_URL}auth/confirm-account"> Confirm account </a>
        <p> use this code to confirm: <b> ${user.token}</b>
        <p> This token expires in 10 min</p>
      `,
    });
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "GoalMaker APP <info@goalmaker.com>",
      to: user.email,
      subject: "GoalMaker - Reset your password",
      text: "GoalMaker - Reset your password",
      html: `<p>Hello ${user.name}, you have requested to reset your password</p>
        <p>Please click here to change your password</p>
        <a href="${process.env.FRONTEND_URL}auth/new-password"> Reset password </a>
        <p> use this code to confirm: <b> ${user.token}</b>
        <p> This token expires in 10 min</p>
      `,
    });
  };
}
