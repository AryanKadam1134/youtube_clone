// require("dotenv").config({ path: "./env" });

import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import app from "./app.js";

dotenv.config({ path: "./env" });

const port = process.env.PORT;

connectDB()
  .then((res) => {
    console.log("MongoDB connected: ", res.connection.host);

    app.listen(port, () => {
      console.log(`Server listening on port: ${port}`);
    });

    app.on("error", (error) => {
      console.log("Error listening to server: ", error);
    });
  })
  .catch((error) => {
    console.log(`MongoDB connection failed!!`, error);
  });

/*
import express from "express";
const app = express();

const port = process.env.PORT;

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

    app.on("error", (error) => {
      console.error("Error: ", error);
      throw error;
    });

    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error Connecting Database: ", error);
    throw error;
  }
})();
*/
