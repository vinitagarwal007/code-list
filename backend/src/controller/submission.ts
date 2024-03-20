import { Request, Response } from "express";
import { provider } from "..";
import { z } from "zod";
import { logService } from "../../Utils/logger";
const logger = new logService("controller->submission.ts");
const submissionSchema = z.object({
  username: z.string().trim().min(1),
  language: z.string().trim().min(1),
  code: z.string().trim().min(1),
  stdin: z.string().trim().min(1),
  submissionDate: z.string().trim().min(1)
});
export const newSubmission = async (req: Request, res: Response) => {
  try {
    req.body.submissionDate = logger.getDate().toString()
    const submissionData = submissionSchema.parse(req.body);
    var result = await provider.insertTableData("submission", submissionData);
    res.send(result);
  } catch (error: any) {
    logger.error(error);
    res.status(400).send("invalid or duplicate data");
  }
};

export const getSubmission = async (req: Request, res: Response) => {
  var result = await provider.makeQuery("select * from submission");
  res.send(JSON.stringify(result));
};
