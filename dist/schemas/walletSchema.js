import { Schema, model } from "mongoose";
var walletSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: String, required: true },
    balance: { type: Number, default: 0 },
    hashedPrivateKey: { type: String, required: true },
    iv: { type: String, required: true },
    card: {
        dailyLimit: { type: Number, default: 1000 },
        monthlyLimit: { type: Number, default: 10000 },
        currentLimit: { type: Number, default: 0 },
        cardSerialNumber: { type: String, required: true },
    },
}, {
    timestamps: true,
});
export var Wallet = model("Wallet", walletSchema);
