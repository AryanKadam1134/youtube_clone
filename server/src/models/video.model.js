import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoFile: {
      // Couldinary
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
      resource_type: {
        type: String,
        default: "video",
      },
    },
    duration: {
      // Cloudinary URL
      type: Number,
      required: true,
    },
    thumbnail: {
      // Couldinary
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
      resource_type: {
        type: String,
        default: "image",
      },
    },
    views: {
      type: Number,
      default: 0,
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
    isPublished: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
