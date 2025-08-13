import { Router } from "express";
import {
  getProfile,
  updateDisplayName,
  updateCardLimits,
  togglePanicMode,
  toggleReversePin,
  changeCardPin,
  verifyPin,
} from "./profileController";
import { verifyToken } from "../../middlewares/verifyAccessToken";

const router = Router();

// All profile routes require authentication
router.use(verifyToken);

// Get user profile
router.get("/", getProfile);

// Update display name
router.put("/display-name", updateDisplayName);

// Update card limits
router.put("/card-limits", updateCardLimits);

// Toggle panic mode
router.put("/panic-mode", togglePanicMode);

// Toggle reverse PIN
router.put("/reverse-pin", toggleReversePin);

// Change card PIN
router.put("/change-pin", changeCardPin);

// Verify PIN (for authentication and panic mode detection)
router.post("/verify-pin", verifyPin);

export default router;
