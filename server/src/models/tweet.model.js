import mongoose, { model, Schema } from "mongoose";

const tweetSchema = new Schema(
  {
    tweet: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dislikesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export const Tweet = model("Tweet", tweetSchema);
