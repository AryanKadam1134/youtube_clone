import mongoose, { model, Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    discription: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Playlist = model("Playlist", playlistSchema);
