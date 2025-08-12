import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  avatar?: string;
  pinHash?: string | null;
  panicMode: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    avatar: { type: String },
    pinHash: { type: String, default: null },
    panicMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", UserSchema);
