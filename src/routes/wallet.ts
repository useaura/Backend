import { Router } from "express";
import { walletController } from "../controllers/walletController";

export const walletRouter = Router();

walletRouter.get("/", walletController.getWallet);
walletRouter.get("/transactions", walletController.getRecentTx);
walletRouter.post("/preview-withdraw", walletController.previewWithdraw);
walletRouter.post("/confirm-withdraw", walletController.confirmWithdraw);
walletRouter.post("/set-pin", walletController.setPin);
walletRouter.get("/receive/address", walletController.getReceiveAddress);

// simulation endpoint for dev/tests:
walletRouter.post("/simulate/receive", walletController.simulateReceive);
