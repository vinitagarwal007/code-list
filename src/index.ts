require("dotenv").config(); //configuring the environment variables
import { dbProvider } from "../db/provider";
import { logService } from "../Utils/logger";
import express, { Request, Response } from 'express';
const app = express();
const fs = require("fs");

const dbOptions = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  port: parseInt(`${ process.env.MYSQL_PORT }`),
  database: process.env.MYSQL_DATABASE,
  ssl: {
    ca: fs.readFileSync(process.env.MYSQL_SSL),
  }
};

const logger = new logService("index.ts"); //create a logger
const provider = new dbProvider(dbOptions); //create db object

const init = async () => {
  await provider.init();
  await provider.initTables();
}
init();





