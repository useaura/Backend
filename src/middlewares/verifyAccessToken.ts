import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../common/utils/jwt/index";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

/**
 * Middleware to verify access token and attach user info to request
 */
export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    const token = authHeader.substring(7);

    // Verify the token
    const payload = verifyAccessToken(token);

    // Attach user info to request
    req.user = {
      id: payload.userId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid access token",
    });
  }
};
