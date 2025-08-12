"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    avatar: { type: String },
    pinHash: { type: String, default: null },
    panicMode: { type: Boolean, default: false },
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
