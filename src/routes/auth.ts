import { Router } from "express";
import { authRoutesFactory } from "../controllers/authController";

export function createAuthRouter(opts: {
  googleClientId: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}) {
  const router = Router();
  const ctrl = authRoutesFactory(opts);

  router.post("/google", ctrl.googleSignIn);
  return router;
}
