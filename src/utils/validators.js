"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewWithdrawSchema = void 0;
var zod_1 = require("zod");
exports.previewWithdrawSchema = zod_1.z.object({
    toAddress: zod_1.z.string().min(1),
    amount: zod_1.z.number().positive(),
});
