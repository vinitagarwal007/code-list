require("dotenv").config(); //configuring the environment variables
import { dbProvider } from "../db/provider";
import { logService } from "../Utils/logger";
import express, { NextFunction } from "express";
const app = express();
const fs = require("fs");
import cors from "cors";
import { submissionRouter } from "./routes/submission";
import { errorRouter } from "./routes/error";
import { outputRouter } from "./routes/output";
const PORT = process.env.SERVER_PORT || 3000;

const dbOptions = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  port: parseInt(`${process.env.MYSQL_PORT}`),
  database: process.env.MYSQL_DATABASE,
  ssl: {
    ca: fs.readFileSync(process.env.MYSQL_SSL),
  },
};

const logger = new logService("index.ts"); //create a logger
export const provider = new dbProvider(dbOptions); //create db object

//server config
app.use(cors());
app.use(express.json());
app.use("/submission", submissionRouter);
app.use("/output", outputRouter);
app.use("/health", (req, res) => {
  res.sendStatus(200);
});
app.use("*", errorRouter); //handle endpoint not found

const init = async () => {
  try {
    await provider.init();
    await provider.initTables();
    app.listen(PORT, async () => {
      logger.log("Server started on port", PORT);
    });
  } catch (err) {
    logger.log(err);
  }
};
init();
