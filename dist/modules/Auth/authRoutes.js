import { Router } from "express";
import { AuthController } from "./authController";
var router = Router();
router.get("/google/url", AuthController.getAuthUrl);
router.get("/google/redirect", AuthController.googleRedirect);
router.post("/google", AuthController.googleLogin);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refreshToken);
export default router;
