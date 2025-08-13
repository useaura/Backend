var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { Wallet } from "../../schemas/walletSchema";
import { OnchainInteractions } from "../../common/utils/onchain/onchainInteractions";
import { ethers } from "ethers";
var WalletService = /** @class */ (function () {
    function WalletService() {
    }
    WalletService.getWallet = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Wallet.findOne({ user: userId }, { hashedPrivateKey: 0, iv: 0 })];
                    case 1:
                        wallet = _a.sent();
                        return [2 /*return*/, wallet];
                }
            });
        });
    };
    WalletService.getWalletByAddress = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Wallet.findOne({ address: address }, { hashedPrivateKey: 0, iv: 0 })];
                    case 1:
                        wallet = _a.sent();
                        return [2 /*return*/, wallet];
                }
            });
        });
    };
    WalletService.getWalletByCardSerialNumber = function (cardSerialNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Wallet.findOne({ "card.cardSerialNumber": cardSerialNumber }, { hashedPrivateKey: 0, iv: 0 })];
                    case 1:
                        wallet = _a.sent();
                        return [2 /*return*/, wallet];
                }
            });
        });
    };
    /**
     * Execute gasless transfer using EIP-2612 permit
     * @param userId - User ID initiating the transfer
     * @param to - Recipient address
     * @param amount - Amount to transfer (in wei)
     * @returns Transfer result with transaction hashes
     */
    WalletService.executeGaslessTransfer = function (userId, to, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet, amountBigInt, currentBalance, result, newBalance, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, Wallet.findOne({ user: userId })];
                    case 1:
                        wallet = _a.sent();
                        if (!wallet) {
                            throw new Error("Wallet not found");
                        }
                        // Validate recipient address
                        if (!ethers.isAddress(to)) {
                            throw new Error("Invalid recipient address");
                        }
                        amountBigInt = BigInt(amount);
                        return [4 /*yield*/, OnchainInteractions.getTokenBalance(wallet.address)];
                    case 2:
                        currentBalance = _a.sent();
                        if (currentBalance < amountBigInt) {
                            throw new Error("Insufficient balance");
                        }
                        return [4 /*yield*/, OnchainInteractions.executeGaslessTransfer(wallet.address, to, amountBigInt, wallet.iv, wallet.hashedPrivateKey)];
                    case 3:
                        result = _a.sent();
                        newBalance = currentBalance - amountBigInt;
                        return [4 /*yield*/, Wallet.updateOne({ user: userId }, { balance: newBalance.toString() })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                from: wallet.address,
                                to: to,
                                amount: amount,
                                permitTxHash: result.permitTxHash,
                                transferTxHash: result.transferTxHash,
                                message: "Gasless transfer completed successfully",
                            }];
                    case 5:
                        error_1 = _a.sent();
                        throw new Error("Gasless transfer failed: ".concat(error_1));
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get current token balance for a wallet
     * @param userId - User ID
     * @returns Current token balance
     */
    WalletService.getTokenBalance = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet, balance, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Wallet.findOne({ user: userId })];
                    case 1:
                        wallet = _a.sent();
                        if (!wallet) {
                            throw new Error("Wallet not found");
                        }
                        return [4 /*yield*/, OnchainInteractions.getTokenBalance(wallet.address)];
                    case 2:
                        balance = _a.sent();
                        return [2 /*return*/, {
                                address: wallet.address,
                                balance: balance.toString(),
                                balanceWei: balance
                            }];
                    case 3:
                        error_2 = _a.sent();
                        throw new Error("Failed to get token balance: ".concat(error_2));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get permit nonce for a wallet
     * @param userId - User ID
     * @returns Current permit nonce
     */
    WalletService.getPermitNonce = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet, nonce, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Wallet.findOne({ user: userId })];
                    case 1:
                        wallet = _a.sent();
                        if (!wallet) {
                            throw new Error("Wallet not found");
                        }
                        return [4 /*yield*/, OnchainInteractions.getPermitNonce(wallet.address)];
                    case 2:
                        nonce = _a.sent();
                        return [2 /*return*/, {
                                address: wallet.address,
                                nonce: nonce.toString()
                            }];
                    case 3:
                        error_3 = _a.sent();
                        throw new Error("Failed to get permit nonce: ".concat(error_3));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate wallet address format
     * @param address - Address to validate
     * @returns Validation result
     */
    WalletService.validateAddress = function (address) {
        return {
            isValid: ethers.isAddress(address),
            address: address
        };
    };
    /**
     * Get wallet details with balance
     * @param userId - User ID
     * @returns Wallet details with current balance
     */
    WalletService.getWalletWithBalance = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet, onchainBalance, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Wallet.findOne({ user: userId }, { hashedPrivateKey: 0, iv: 0 })];
                    case 1:
                        wallet = _a.sent();
                        if (!wallet) {
                            throw new Error("Wallet not found");
                        }
                        return [4 /*yield*/, OnchainInteractions.getTokenBalance(wallet.address)];
                    case 2:
                        onchainBalance = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, wallet.toObject()), { onchainBalance: onchainBalance.toString(), onchainBalanceWei: onchainBalance })];
                    case 3:
                        error_4 = _a.sent();
                        throw new Error("Failed to get wallet with balance: ".concat(error_4));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return WalletService;
}());
export { WalletService };
