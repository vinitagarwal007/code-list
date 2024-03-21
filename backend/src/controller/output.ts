import { Request, Response } from "express";
import { provider } from "..";
import axios from "axios";
import { logService } from "../../Utils/logger";
const logger = new logService("controller->output.ts");
const { base64encode, base64decode } = require("nodejs-base64");

export async function getOutput(submission: any) {
  const payload = {
    language_id: submission.language,
    source_code: btoa(submission.code),
    stdin: btoa(submission.stdin),
  };

  const axios = require("axios");
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions",
    params: {
      wait: true,
      base64_encoded: "true",
      fields: "*",
      redirect_stderr_to_stdout:true,
    },
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": "70363dcd2bmsh236e4dc1dcdb94ep19426ajsna7028778ccc9",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    },
    data: payload,
  };

  try {
    const response = await axios.request(options);
    logger.log(response.data);
    const { stdout, stderr, compile_output, status } = response.data;

    const outputString = `${status.description}
    \n-----Output-----\n
    ${atob(stdout)}
    \n-----Compile Output-----\n
    ${atob(compile_output)}`;

    return { outputString, response: response.data };

  } catch (error) {
    logger.error(error);
  }
}
export async function OutputHandler(req: Request, res: Response) {
  logger.log(req.body);
  const submission = req.body;
  var output:any = await getOutput(submission)
  res.send(output.outputString)
  await provider.updateId("submission", submission.id, {
    output: btoa(output.outputString),
    stdin: btoa(submission.stdin),
    code: btoa(submission.code),
  });
}
