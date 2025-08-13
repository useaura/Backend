import { Request, Response } from "express";
import { authService } from "./authService";

export class AuthController {
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
