import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import { IUser } from "./User";

export interface IBudget extends Document {
  quantity: number;
  user: PopulatedDoc<IUser & Document>;
}

const BudgetSchema: Schema = new Schema(
  {
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

const Budget = mongoose.model<IBudget>("Budget", BudgetSchema);
export default Budget;
