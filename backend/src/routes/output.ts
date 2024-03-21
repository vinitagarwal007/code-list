import { Router } from "express";
import { getOutput } from "../controller/output";
export const outputRouter = Router();

outputRouter.post("/calculate",getOutput)
