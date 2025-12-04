// require("dotenv").config({ path: "./env" });

import dotenv from "dotenv";
import connectDB from "./db/connect.js";

dotenv.config({ path: "./env" });

connectDB();

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
