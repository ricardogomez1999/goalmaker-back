import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IFood extends Document {
  foodName: string;
  calories: number;
  user: PopulatedDoc<IUser & Document>;
}

const FoodSchema: Schema = new Schema(
  {
    foodName: {
      type: String,
      required: true,
      trim: true,
    },
    calories: {
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

const Food = mongoose.model<IFood>("Food", FoodSchema);
export default Food;
