import mongoose, { Schema, Document } from "mongoose";

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
  },
  { timestamps: true }
);

const Income = mongoose.model<IIncome>("Income", IncomeSchema);
export default Income;
