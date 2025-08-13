import { Schema, model } from "mongoose";
var userSchema = new Schema({
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
}, {
    timestamps: true,
});
export var User = model("User", userSchema);
