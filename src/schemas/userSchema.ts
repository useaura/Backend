import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  auth: {
    googleId: string;
    googleRefreshToken: string;
    refreshToken: string;
  };
  name: string;
  email: string;
  pinHash: string;
  panicMode: boolean;
  reversePinEnabled: boolean;
}

const userSchema = new Schema<IUser>(
  {
    auth: {
      googleId: { type: String, required: true },
      googleRefreshToken: { type: String, required: true },
      refreshToken: { type: String },
    },

    name: { type: String, required: true },
    email: { type: String, required: true },
    pinHash: { type: String, required: true },
    panicMode: { type: Boolean, default: false },
    reversePinEnabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);
