import { Schema, model, Document, Types } from "mongoose";

export interface IWallet extends Document {
  user: Types.ObjectId;
  address: string; // on-chain address or internal payment ID
  balanceUSDC: number; // stored in smallest unit or with decimals — we'll store float for simplicity (NOT ideal for real money)
  createdAt: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    address: { type: String, required: true, unique: true },
    balanceUSDC: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const WalletModel = model<IWallet>("Wallet", WalletSchema);
