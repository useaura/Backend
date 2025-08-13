import { Router } from "express";
import { AuthController } from "./authController";

const router = Router();

router.get("/google/url", AuthController.getAuthUrl);

router.post("/google", AuthController.googleLogin);

export default router;
