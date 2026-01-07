import mongoose, { model, Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscribers: {
      type: Schema.Types.ObjectId, // One who is subscribing
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, // Channel owner
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
