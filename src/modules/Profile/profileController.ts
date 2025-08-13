import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/verifyAccessToken";
import bcrypt from "bcrypt";
import { User } from "../../schemas/userSchema";
import { Wallet } from "../../schemas/walletSchema";
import logger from "../../common/resources/logger";

// Get user profile
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-pinHash -auth.googleRefreshToken -auth.refreshToken");
    const wallet = await Wallet.findOne({ user: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = {
      displayName: user.name,
      email: user.email,
      cardLimits: wallet?.card ? {
        dailyLimit: wallet.card.dailyLimit,
        monthlyLimit: wallet.card.monthlyLimit,
        currentLimit: wallet.card.currentLimit
      } : null,
      controls: {
        panicMode: user.panicMode,
        reversePinEnabled: user.reversePinEnabled
      }
    };

    res.json(profile);
  } catch (error) {
    logger.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update display name
export const updateDisplayName = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { displayName } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!displayName || displayName.trim().length === 0) {
      return res.status(400).json({ error: "Display name is required" });
    }

    if (displayName.length > 50) {
      return res.status(400).json({ error: "Display name must be 50 characters or less" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name: displayName.trim() },
      { new: true }
    ).select("-pinHash -auth.googleRefreshToken -auth.refreshToken");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ 
      message: "Display name updated successfully",
      displayName: user.name
    });
  } catch (error) {
    logger.error("Error updating display name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update card limits
export const updateCardLimits = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { dailyLimit, monthlyLimit } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Ensure at least one field is provided
    if (dailyLimit === undefined && monthlyLimit === undefined) {
      return res.status(400).json({ error: "Provide at least one of dailyLimit or monthlyLimit" });
    }

    // Validate limits
    if (dailyLimit !== undefined && (dailyLimit < 0 || dailyLimit > 100000)) {
      return res.status(400).json({ error: "Daily limit must be between 0 and 100,000 USDC" });
    }

    if (monthlyLimit !== undefined && (monthlyLimit < 0 || monthlyLimit > 1000000)) {
      return res.status(400).json({ error: "Monthly limit must be between 0 and 1,000,000 USDC" });
    }

    if (dailyLimit !== undefined && monthlyLimit !== undefined && dailyLimit > monthlyLimit) {
      return res.status(400).json({ error: "Daily limit cannot exceed monthly limit" });
    }

    const updateFields: any = {};
    if (dailyLimit !== undefined) updateFields["card.dailyLimit"] = dailyLimit;
    if (monthlyLimit !== undefined) updateFields["card.monthlyLimit"] = monthlyLimit;

    // Pre-check wallet existence for clearer error and better logs
    const existingWallet = await Wallet.findOne({ user: userId });
    if (!existingWallet) {
      logger.warn(`updateCardLimits: No wallet found for user ${userId}`);
      return res.status(404).json({
        error: "Wallet not found",
        details: "No wallet exists for this user. Initialize wallet before updating card limits."
      });
    }

    logger.info(
      `updateCardLimits: Updating card limits for wallet ${existingWallet._id.toString()}`,
      { userId, updateFields }
    );

    const wallet = await Wallet.findOneAndUpdate(
      { user: userId },
      updateFields,
      { new: true }
    );

    if (!wallet) {
      // This should be rare given the pre-check, but keep for safety
      logger.error(`updateCardLimits: Wallet vanished during update for user ${userId}`);
      return res.status(404).json({ error: "Wallet not found" });
    }

    res.json({
      message: "Card limits updated successfully",
      cardLimits: {
        dailyLimit: wallet.card.dailyLimit,
        monthlyLimit: wallet.card.monthlyLimit,
        currentLimit: wallet.card.currentLimit
      }
    });
  } catch (error) {
    logger.error("Error updating card limits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Toggle panic mode
export const togglePanicMode = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { enabled } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (typeof enabled !== "boolean") {
      return res.status(400).json({ error: "Enabled must be a boolean value" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { panicMode: enabled },
      { new: true }
    ).select("-pinHash -auth.googleRefreshToken -auth.refreshToken");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: `Panic mode ${enabled ? "enabled" : "disabled"} successfully`,
      panicMode: user.panicMode
    });
  } catch (error) {
    logger.error("Error toggling panic mode:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Toggle reverse PIN
export const toggleReversePin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { enabled } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (typeof enabled !== "boolean") {
      return res.status(400).json({ error: "Enabled must be a boolean value" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { reversePinEnabled: enabled },
      { new: true }
    ).select("-pinHash -auth.googleRefreshToken -auth.refreshToken");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: `Reverse PIN ${enabled ? "enabled" : "disabled"} successfully`,
      reversePinEnabled: user.reversePinEnabled
    });
  } catch (error) {
    logger.error("Error toggling reverse PIN:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Change card PIN
export const changeCardPin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { currentPin, newPin } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!currentPin || !newPin) {
      return res.status(400).json({ error: "Current PIN and new PIN are required" });
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      return res.status(400).json({ error: "PIN must be exactly 4 digits" });
    }

    if (currentPin === newPin) {
      return res.status(400).json({ error: "New PIN must be different from current PIN" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current PIN
    const isCurrentPinValid = await bcrypt.compare(currentPin, user.pinHash);
    if (!isCurrentPinValid) {
      return res.status(400).json({ error: "Current PIN is incorrect" });
    }

    // Hash new PIN
    const saltRounds = 12;
    const newPinHash = await bcrypt.hash(newPin, saltRounds);

    // Update PIN
    await User.findByIdAndUpdate(userId, { pinHash: newPinHash });

    res.json({ message: "PIN changed successfully" });
  } catch (error) {
    logger.error("Error changing PIN:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Verify PIN (for authentication and reverse PIN detection)
export const verifyPin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { pin } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: "PIN must be exactly 4 digits" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check normal PIN
    const isNormalPinValid = await bcrypt.compare(pin, user.pinHash);
    
    // Check reverse PIN if enabled
    const reversedPin = pin.split("").reverse().join("");
    const isReversePinValid = user.reversePinEnabled && await bcrypt.compare(reversedPin, user.pinHash);

    if (isNormalPinValid) {
      res.json({ 
        valid: true, 
        panicMode: false,
        message: "PIN verified successfully"
      });
    } else if (isReversePinValid) {
      // Trigger panic mode if reverse PIN is used
      await User.findByIdAndUpdate(userId, { panicMode: true });
      
      res.json({ 
        valid: true, 
        panicMode: true,
        message: "Panic mode activated via reverse PIN"
      });
    } else {
      res.status(400).json({ 
        valid: false,
        error: "Invalid PIN" 
      });
    }
  } catch (error) {
    logger.error("Error verifying PIN:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
