import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

// Middlewares
app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

// import routes
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import reactionRouter from "./routes/reaction.route.js";
import viewVideoRouter from "./routes/viewvideo.routes.js";

// use routes
app.use("/api/v1/users", userRouter);

app.use("/api/v1/videos", videoRouter);

app.use("/api/v1/subscriptions", subscriptionRouter);

app.use("/api/v1/reactions", reactionRouter);

app.use("/api/v1/view_videos", viewVideoRouter);

// on to the view_video

// http://localhost:8000/api/v1/users/register

export default app;
