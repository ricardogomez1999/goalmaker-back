import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  quantity: number;
}

const BudgetSchema: Schema = new Schema(
  {
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Budget = mongoose.model<IBudget>("Budget", BudgetSchema);
export default Budget;
