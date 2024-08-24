import mongoose, { Document, Schema } from "mongoose";

export interface IFood extends Document {
  foodName: string;
  calories: number;
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
  },
  { timestamps: true }
);

const Food = mongoose.model<IFood>("Food", FoodSchema);
export default Food;
