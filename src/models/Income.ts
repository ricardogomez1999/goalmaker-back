import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { IUser } from "./User";

const incomeType = {
  SALARY: "salary",
  BONUSES: "bonuses",
  INTERESTS: "interests",
  SAVINGS: "savings",
  OTHERS: "others",
} as const;

export type incomeType = (typeof incomeType)[keyof typeof incomeType];

export interface IIncome extends Document {
  name: string;
  quantity: number;
  category: incomeType;
  createdAt: Date;
  user: PopulatedDoc<IUser & Document>;
}

const IncomeSchema: Schema = new Schema(
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
      enum: Object.values(incomeType),
      default: incomeType.OTHERS,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Income = mongoose.model<IIncome>("Income", IncomeSchema);
export default Income;
