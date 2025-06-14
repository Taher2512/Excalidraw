import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req: Request, res: Response, next: NextFunction) {
  let token = req.headers["authorization"] as string;
  let decoded = jwt.verify(token, JWT_SECRET);

  if (decoded) {
    // @ts-ignore
    req.userId = decoded.userId;
    next();
  } else {
    res.status(403).json({
      error: "Unauthorized",
    });
  }
}
