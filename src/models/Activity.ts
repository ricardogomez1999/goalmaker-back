import mongoose, { Document, Schema } from "mongoose";

export interface IActivity extends Document {
  activityName: string;
  calories: number;
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
  },
  { timestamps: true }
);

const Activity = mongoose.model<IActivity>("Activity", ActivitySchema);
export default Activity;
