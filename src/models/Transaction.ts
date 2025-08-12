import { Schema, model, Document, Types } from "mongoose";

export type TxStatus = "pending" | "success" | "failed";

export interface ITransaction extends Document {
  wallet: Types.ObjectId;
  type: "send" | "receive";
  amountUSDC: number;
  feeUSDC: number;
  counterparty: string; // address or name
  status: TxStatus;
  chain: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const TxSchema = new Schema<ITransaction>(
  {
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
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
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const TransactionModel = model<ITransaction>("Transaction", TxSchema);
