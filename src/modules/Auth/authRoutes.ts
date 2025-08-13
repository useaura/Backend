import { Router } from "express";
import { AuthController } from "./authController";

const router = Router();

router.post("/google", AuthController.googleLogin);

export default router;
