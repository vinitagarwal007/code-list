import { Router } from "express";
import { getSubmission, newSubmission } from "../controller/submission";
export const submissionRouter = Router();

submissionRouter.post("/new",newSubmission);
submissionRouter.get("/get",getSubmission);
