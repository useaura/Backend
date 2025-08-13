import { Schema, model, Document } from "mongoose";

export interface IWallet extends Document {
  user: Schema.Types.ObjectId;
  address: string;
  balance: number;
  hashedPrivateKey: string;
  iv: string;
  card: {
    dailyLimit: number;
    monthlyLimit: number;
    currentLimit: number;
    cardSerialNumber: string;
  };
}

const walletSchema = new Schema<IWallet>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: String, required: true },
    balance: { type: Number, default: 0 },
    hashedPrivateKey: { type: String, required: true },
    iv: { type: String, required: true },
    card: {
      dailyLimit: { type: Number, default: 0 },
      monthlyLimit: { type: Number, default: 0 },
      currentLimit: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
