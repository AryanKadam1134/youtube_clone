import mongoose, { model, Schema } from "mongoose";

const reactionSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reaction: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  {
    timestamps: true,
  }
);

export const Reaction = model("Reaction", reactionSchema);
