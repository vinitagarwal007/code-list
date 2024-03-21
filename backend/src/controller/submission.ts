import { Request, Response } from "express";
import { provider } from "..";
import { z } from "zod";
import { logService } from "../../Utils/logger";
import { getOutput } from "./output";
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
    submissionData.code = btoa(submissionData.code)
    submissionData.stdin = btoa(submissionData.stdin)
    logger.log(submissionData)
    var result = await provider.insertTableData("submission", submissionData);
    var output:any = await getOutput(submissionData)
    logger.log(output)
    await provider.updateId("submission", result.insertId, {
      output: btoa(output.outputString),
      stdin: btoa(submissionData.stdin),
      code: btoa(submissionData.code),
    });
    res.json({'db':result,'output':output});
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
