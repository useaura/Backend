"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletController = void 0;
var Wallet_1 = require("../models/Wallet");
var Transaction_1 = require("../models/Transaction");
var User_1 = require("../models/User");
var bcrypt_1 = require("bcrypt");
var PIN_SALT_ROUNDS = Number(process.env.PIN_SALT_ROUNDS || 10);
/**
 * Note: This backend simulates balance changes. In production you'd integrate with:
 *  - on-chain relayer / custodial engine OR
 *  - USDC custodial provider API / payment rails
 */
exports.walletController = {
    getWallet: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, wallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = req.user;
                        return [4 /*yield*/, Wallet_1.WalletModel.findOne({ user: user._id })];
                    case 1:
                        wallet = _a.sent();
                        if (!wallet)
                            return [2 /*return*/, res.status(404).json({ error: "Wallet not found" })];
                        res.json({ wallet: wallet });
                        return [2 /*return*/];
                }
            });
        });
    },
    getRecentTx: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, wallet, txs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = req.user;
                        return [4 /*yield*/, Wallet_1.WalletModel.findOne({ user: user._id })];
                    case 1:
                        wallet = _a.sent();
                        if (!wallet)
                            return [2 /*return*/, res.status(404).json({ error: "Wallet not found" })];
                        return [4 /*yield*/, Transaction_1.TransactionModel.find({ wallet: wallet._id })
                                .sort({ createdAt: -1 })
                                .limit(20)];
                    case 2:
                        txs = _a.sent();
                        res.json({ transactions: txs });
                        return [2 /*return*/];
                }
            });
        });
    },
    previewWithdraw: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, toAddress, amount, fee;
            return __generator(this, function (_b) {
                _a = req.body, toAddress = _a.toAddress, amount = _a.amount;
                if (!toAddress || !amount)
                    return [2 /*return*/, res.status(400).json({ error: "toAddress and amount required" })];
                fee = Math.max(0.5, Math.round(Number(amount) * 0.005 * 100) / 100);
                res.json({
                    amount: Number(amount),
                    fee: fee,
                    total: Number(amount) + fee,
                    chain: "ethereum",
                    toAddress: toAddress,
                });
                return [2 /*return*/];
            });
        });
    },
    confirmWithdraw: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, toAddress, amount, pin, userDoc, ok, wallet, amt, fee, total, tx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = req.user;
                        _a = req.body, toAddress = _a.toAddress, amount = _a.amount, pin = _a.pin;
                        if (!toAddress || !amount || typeof pin === "undefined")
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ error: "toAddress, amount and pin required" })];
                        return [4 /*yield*/, User_1.UserModel.findById(user._id)];
                    case 1:
                        userDoc = _b.sent();
                        if (!userDoc)
                            return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                        if (!userDoc.pinHash)
                            return [2 /*return*/, res.status(400).json({ error: "PIN not set" })];
                        return [4 /*yield*/, bcrypt_1.default.compare(String(pin), userDoc.pinHash)];
                    case 2:
                        ok = _b.sent();
                        if (!ok)
                            return [2 /*return*/, res.status(401).json({ error: "Invalid PIN" })];
                        // Panic mode check
                        if (userDoc.panicMode) {
                            return [2 /*return*/, res
                                    .status(403)
                                    .json({ error: "Panic Mode active. Withdrawals disabled." })];
                        }
                        return [4 /*yield*/, Wallet_1.WalletModel.findOne({ user: user._id })];
                    case 3:
                        wallet = _b.sent();
                        if (!wallet)
                            return [2 /*return*/, res.status(404).json({ error: "Wallet not found" })];
                        amt = Number(amount);
                        fee = Math.max(0.5, Math.round(amt * 0.005 * 100) / 100);
                        total = amt + fee;
                        if (wallet.balanceUSDC < total)
                            return [2 /*return*/, res.status(400).json({ error: "Insufficient funds" })];
                        return [4 /*yield*/, Transaction_1.TransactionModel.create({
                                wallet: wallet._id,
                                type: "send",
                                amountUSDC: amt,
                                feeUSDC: fee,
                                counterparty: toAddress,
                                status: "pending",
                                chain: "ethereum",
                            })];
                    case 4:
                        tx = _b.sent();
                        // simulate immediate success (in real life, call the blockchain or custody API)
                        wallet.balanceUSDC -= total;
                        return [4 /*yield*/, wallet.save()];
                    case 5:
                        _b.sent();
                        tx.status = "success";
                        return [4 /*yield*/, tx.save()];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, res.json({ tx: tx, wallet: wallet })];
                }
            });
        });
    },
    setPin: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, pin, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = req.user;
                        pin = req.body.pin;
                        if (!pin || String(pin).length < 4)
                            return [2 /*return*/, res.status(400).json({ error: "PIN must be at least 4 digits" })];
                        return [4 /*yield*/, bcrypt_1.default.hash(String(pin), PIN_SALT_ROUNDS)];
                    case 1:
                        hash = _a.sent();
                        return [4 /*yield*/, User_1.UserModel.findByIdAndUpdate(user._id, { pinHash: hash })];
                    case 2:
                        _a.sent();
                        res.json({ ok: true });
                        return [2 /*return*/];
                }
            });
        });
    },
    // Receive flow: get wallet address & QR token
    getReceiveAddress: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, wallet, receiveToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = req.user;
                        return [4 /*yield*/, Wallet_1.WalletModel.findOne({ user: user._id })];
                    case 1:
                        wallet = _a.sent();
                        if (!wallet)
                            return [2 /*return*/, res.status(404).json({ error: "Wallet not found" })];
                        receiveToken = Buffer.from(wallet.address + ":" + Date.now()).toString("base64");
                        res.json({
                            address: wallet.address,
                            chain: "ethereum",
                            token: receiveToken, // front-end can embed token in QR
                            warning: "Ensure you send on Ethereum to avoid loss of funds.",
                        });
                        return [2 /*return*/];
                }
            });
        });
    },
    simulateReceive: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, toAddress, amount, from, wallet, amt, tx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, toAddress = _a.toAddress, amount = _a.amount, from = _a.from;
                        if (!toAddress || !amount)
                            return [2 /*return*/, res.status(400).json({ error: "toAddress and amount required" })];
                        return [4 /*yield*/, Wallet_1.WalletModel.findOne({ address: toAddress })];
                    case 1:
                        wallet = _b.sent();
                        if (!wallet)
                            return [2 /*return*/, res.status(404).json({ error: "Wallet not found" })];
                        amt = Number(amount);
                        wallet.balanceUSDC += amt;
                        return [4 /*yield*/, wallet.save()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, Transaction_1.TransactionModel.create({
                                wallet: wallet._id,
                                type: "receive",
                                amountUSDC: amt,
                                feeUSDC: 0,
                                counterparty: from || "external",
                                status: "success",
                                chain: "ethereum",
                            })];
                    case 3:
                        tx = _b.sent();
                        res.json({ ok: true, tx: tx, wallet: wallet });
                        return [2 /*return*/];
                }
            });
        });
    },
};
