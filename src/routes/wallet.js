"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRouter = void 0;
var express_1 = require("express");
var walletController_1 = require("../controllers/walletController");
exports.walletRouter = (0, express_1.Router)();
exports.walletRouter.get("/", walletController_1.walletController.getWallet);
exports.walletRouter.get("/transactions", walletController_1.walletController.getRecentTx);
exports.walletRouter.post("/preview-withdraw", walletController_1.walletController.previewWithdraw);
exports.walletRouter.post("/confirm-withdraw", walletController_1.walletController.confirmWithdraw);
exports.walletRouter.post("/set-pin", walletController_1.walletController.setPin);
exports.walletRouter.get("/receive/address", walletController_1.walletController.getReceiveAddress);
// simulation endpoint for dev/tests:
exports.walletRouter.post("/simulate/receive", walletController_1.walletController.simulateReceive);
