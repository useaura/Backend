import { Router } from "express";
import { WalletController } from "./walletController";

const router = Router();

/**
 * @route GET /api/wallet
 * @desc Get user's wallet information
 * @access Private
 */
router.get("/", WalletController.getWallet);

/**
 * @route GET /api/wallet/balance
 * @desc Get current token balance
 * @access Private
 */
router.get("/balance", WalletController.getTokenBalance);

/**
 * @route GET /api/wallet/nonce
 * @desc Get permit nonce for wallet
 * @access Private
 */
router.get("/nonce", WalletController.getPermitNonce);

/**
 * @route GET /api/wallet/address/:address
 * @desc Get wallet by address
 * @access Public
 */
router.get("/address/:address", WalletController.getWalletByAddress);

/**
 * @route GET /api/wallet/card/:cardSerialNumber
 * @desc Get wallet by card serial number
 * @access Public
 */
router.get("/card/:cardSerialNumber", WalletController.getWalletByCard);

/**
 * @route GET /api/wallet/validate/:address
 * @desc Validate wallet address format
 * @access Public
 */
router.get("/validate/:address", WalletController.validateAddress);

/**
 * @route POST /api/wallet/transfer/gasless
 * @desc Execute gasless transfer using EIP-2612 permit
 * @access Private
 * @body { to: string, amount: string, iv: string, encryptedData: string }
 */
router.post("/transfer/gasless", WalletController.executeGaslessTransfer);

export default router;
