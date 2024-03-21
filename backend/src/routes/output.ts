import { Router } from "express";
import { OutputHandler } from "../controller/output";
export const outputRouter = Router();

outputRouter.post("/calculate",OutputHandler)
