import mongoose, { Schema, model } from "mongoose";

const viewVideoSchema = new Schema(
  {
    viewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    lastViewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const ViewVideo = model("ViewVideo", viewVideoSchema);
