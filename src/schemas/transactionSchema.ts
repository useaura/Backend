import { Schema, model, Document } from "mongoose";

export interface ITransaction extends Document {
  user: Schema.Types.ObjectId;
  wallet: Schema.Types.ObjectId;
  amount: number;
  type: "receive" | "withdraw";
  status: "pending" | "completed" | "failed";
  transactionHash: string;
  receiver: {
    isInternal: boolean;
    address: string;
    name?: string;
  };
}

const transactionSchema = new Schema<ITransaction>(
  {
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
  },
  {
    timestamps: true,
  }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
