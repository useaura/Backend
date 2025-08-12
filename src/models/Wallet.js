"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModel = void 0;
var mongoose_1 = require("mongoose");
var WalletSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    address: { type: String, required: true, unique: true },
    balanceUSDC: { type: Number, default: 0 },
}, { timestamps: true });
exports.WalletModel = (0, mongoose_1.model)("Wallet", WalletSchema);
