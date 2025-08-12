import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { UserModel } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export function authMiddleware(jwtSecret: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer "))
      return res.status(401).json({ error: "Unauthorized" });

    const token = auth.split(" ")[1];
    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      const user = await UserModel.findById(decoded.userId);
      if (!user) return res.status(401).json({ error: "Invalid token" });
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}
