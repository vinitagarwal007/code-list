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
    submissionData.code.replace("// Paste or Type your Code"," ")
    submissionData.code = btoa(submissionData.code)
    submissionData.stdin = btoa(submissionData.stdin)
    var result = await provider.insertTableData("submission", submissionData);
    res.send(result);
  } catch (error: any) {
    logger.error(error);
    res.status(400).send("invalid or duplicate data");
  }
};

export const getSubmission = async (req: Request, res: Response) => {
  var result = await provider.selectAll("submission");
  result = result.map((e:any)=>{
    var temp:any = {}
    temp.code = atob(e.code)
    temp.output = e.output ? atob(e.output) : ""
    temp.stdin = atob(e.stdin)
    return {...e,...temp}
  })
  res.send(JSON.stringify(result));
};
