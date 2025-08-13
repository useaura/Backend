import { Request, Response } from "express";
import { authService } from "./authService";
import { GoogleOAuthService } from "../../common/utils/oauth/google";
import logger from "../../common/resources/logger";

export class AuthController {
  static async getAuthUrl(req: Request, res: Response) {
    const authUrl = GoogleOAuthService.getAuthUrl();
    res.json({ authUrl });
  }

  static async googleRedirect(req: Request, res: Response) {
    const { code } = req.query;

    logger.info(`Google redirect request: ${code}`);

    try {
      if (!code || typeof code !== "string") {
        return res
          .status(400)
          .json({ error: "Authorization code is required" });
      }

      const result = await authService.googleLogin(code);
      res.json(result);
    } catch (error) {
      logger.error("Google redirect error:", error);
      res.status(500).json({ error: "Failed to authenticate with Google" });
    }
  }

  static async googleLogin(req: Request, res: Response) {
    const { code } = req.body;

    try {
      if (!code) {
        return res.status(400).json({ error: "Code is required" });
      }

      const result = await authService.googleLogin(code);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to login" });
    }
  }
}
