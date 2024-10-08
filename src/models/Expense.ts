import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import { IUser } from "./User";

const expenseType = {
  FOOD: "food",
  INTERNET: "internet",
  HEALTH: "health",
  TRANSPORTATION: "transportation",
  PETS: "pets",
  HOUSE: "house",
  SAVINGS: "savings",
  OTHERS: "others",
} as const;

export type expenseType = (typeof expenseType)[keyof typeof expenseType];

export interface IExpense extends Document {
  name: string;
  quantity: number;
  category: expenseType;
  createdAt: Date;
  user: PopulatedDoc<IUser & Document>;
}

const ExpenseSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(expenseType),
      default: expenseType.OTHERS,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);
export default Expense;
