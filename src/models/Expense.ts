import mongoose, { Schema, Document, Types } from "mongoose";

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
  },
  { timestamps: true }
);

const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);
export default Expense;
