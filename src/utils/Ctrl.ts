import { NextFunction, Request, Response } from "express";

export default function (
  handler: (req: Request, res: Response, next: NextFunction) => void
) {
  return handler;
}
