import { Router } from "express";
import {
  getProfile,
  updateDisplayName,
  updateCardLimits,
  togglePanicMode,
  toggleReversePin,
  changeCardPin,
  verifyPin,
} from "../Profile/profileController";
import { verifyToken } from "../../middlewares/verifyAccessToken";

const router = Router();

// All settings routes require authentication
router.use(verifyToken);

// Alias routes mapping to profile handlers
router.get("/", getProfile);
router.put("/display-name", updateDisplayName);
router.put("/card-limits", updateCardLimits);
router.put("/panic-mode", togglePanicMode);
router.put("/reverse-pin", toggleReversePin);
router.put("/change-pin", changeCardPin);
router.post("/verify-pin", verifyPin);

export default router;
