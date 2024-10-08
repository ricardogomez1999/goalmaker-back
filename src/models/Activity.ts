import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IActivity extends Document {
  activityName: string;
  calories: number;
  user: PopulatedDoc<IUser & Document>;
}

const ActivitySchema: Schema = new Schema(
  {
    activityName: {
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

const Activity = mongoose.model<IActivity>("Activity", ActivitySchema);
export default Activity;
