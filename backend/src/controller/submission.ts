import { Request, Response } from "express";
import { provider } from "..";
import { z } from "zod";
import { logService } from "../../Utils/logger";
const logger = new logService("controller->submission.ts");
const submissionSchema = z.object({
  username: z.string(),
  language: z.string(),
  code: z.string(),
  stdin: z.string(),
});
export const newSubmission = async (req: Request, res: Response) => {
  try {
    logger.log(req.body)
    const submissionData = submissionSchema.parse(req.body);
    var result = await provider.makeQuery(
      "insert into submission (username,language,code,stdin) values (?,?,?,?)",
      Object.values(submissionData)
    );
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
