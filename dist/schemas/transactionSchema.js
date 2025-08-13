import { Schema, model } from "mongoose";
var transactionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["receive", "withdraw"], required: true },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        required: true,
    },
    transactionHash: { type: String, required: true },
    receiver: {
        isInternal: { type: Boolean, required: true },
        address: { type: String, required: true },
        name: { type: String, required: false },
    },
}, {
    timestamps: true,
});
export var Transaction = model("Transaction", transactionSchema);
