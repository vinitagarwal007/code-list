import { Router, Request, Response } from "express";

export const errorRouter = Router();
errorRouter.use("*", (req: Request, res: Response) => {
    res.sendStatus(404)
});
