import { Router } from "express";
import { WalletController } from "./walletController";
import { verifyToken } from "../../middlewares/verifyAccessToken";

const router = Router();

/**
 * @route GET /api/wallet
 * @desc Get user's wallet information
 * @access Private
 */
router.get("/", verifyToken, WalletController.getWallet);

/**
 * @route GET /api/wallet/card/:cardSerialNumber
 * @desc Get wallet by card serial number
 * @access Public
 */
router.get(
  "/card/:cardSerialNumber",
  verifyToken,
  WalletController.getWalletByCard
);

/**
 * @route POST /api/wallet/transfer/gasless
 * @desc Execute gasless transfer using EIP-2612 permit
 * @access Private
 * @body { to: string, amount: string, iv: string, encryptedData: string }
 */
router.post(
  "/transfer/gasless",
  verifyToken,
  WalletController.executeGaslessTransfer
);

export default router;
