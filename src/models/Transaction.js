"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
var mongoose_1 = require("mongoose");
var TxSchema = new mongoose_1.Schema({
    wallet: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet", required: true },
    type: { type: String, enum: ["send", "receive"], required: true },
    amountUSDC: { type: Number, required: true },
    feeUSDC: { type: Number, default: 0 },
    counterparty: { type: String },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending",
    },
    chain: { type: String, default: "ethereum" },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true });
exports.TransactionModel = (0, mongoose_1.model)("Transaction", TxSchema);
