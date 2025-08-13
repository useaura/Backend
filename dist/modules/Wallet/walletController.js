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
import { WalletService } from "./walletService";
import { HttpException } from "../../common/resources/exception/httpException";
import { BAD_REQUEST, OK, NOT_FOUND, UNAUTHORIZED, INTERNAL_SERVER_ERROR, } from "../../common/resources/constants/statusCodes";
var WalletController = /** @class */ (function () {
    function WalletController() {
    }
    /**
     * Get user's wallet information
     */
    WalletController.getWallet = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, wallet, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        if (!userId) {
                            throw new HttpException(BAD_REQUEST, "User ID is required");
                        }
                        return [4 /*yield*/, WalletService.getWalletWithBalance(userId)];
                    case 1:
                        wallet = _b.sent();
                        res.status(OK).json({
                            success: true,
                            data: wallet,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        if (error_1 instanceof HttpException) {
                            res.status(error_1.status).json({
                                success: false,
                                message: error_1.message,
                            });
                        }
                        else {
                            res.status(INTERNAL_SERVER_ERROR).json({
                                success: false,
                                message: "Failed to get wallet",
                            });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get wallet by address
     */
    WalletController.getWalletByAddress = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var address, wallet, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        address = req.params.address;
                        if (!address) {
                            throw new HttpException(BAD_REQUEST, "Wallet address is required");
                        }
                        return [4 /*yield*/, WalletService.getWalletByAddress(address)];
                    case 1:
                        wallet = _a.sent();
                        if (!wallet) {
                            throw new HttpException(NOT_FOUND, "Wallet not found");
                        }
                        res.status(OK).json({
                            success: true,
                            data: wallet,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        if (error_2 instanceof HttpException) {
                            res.status(error_2.status).json({
                                success: false,
                                message: error_2.message,
                            });
                        }
                        else {
                            res.status(INTERNAL_SERVER_ERROR).json({
                                success: false,
                                message: "Failed to get wallet by address",
                            });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get wallet by card serial number
     */
    WalletController.getWalletByCard = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var cardSerialNumber, wallet, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        cardSerialNumber = req.params.cardSerialNumber;
                        if (!cardSerialNumber) {
                            throw new HttpException(BAD_REQUEST, "Card serial number is required");
                        }
                        return [4 /*yield*/, WalletService.getWalletByCardSerialNumber(cardSerialNumber)];
                    case 1:
                        wallet = _a.sent();
                        if (!wallet) {
                            throw new HttpException(NOT_FOUND, "Wallet not found");
                        }
                        res.status(OK).json({
                            success: true,
                            data: wallet,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        if (error_3 instanceof HttpException) {
                            res.status(error_3.status).json({
                                success: false,
                                message: error_3.message,
                            });
                        }
                        else {
                            res.status(INTERNAL_SERVER_ERROR).json({
                                success: false,
                                message: "Failed to get wallet by card",
                            });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Execute gasless transfer
     */
    WalletController.executeGaslessTransfer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, to, amount, result, error_4;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                        if (!userId) {
                            throw new HttpException(UNAUTHORIZED, "User authentication required");
                        }
                        _a = req.body, to = _a.to, amount = _a.amount;
                        // Validate required fields
                        if (!to || !amount) {
                            throw new HttpException(BAD_REQUEST, "Missing required fields: to, amount");
                        }
                        // Validate amount is positive
                        if (BigInt(amount) <= 0) {
                            throw new HttpException(BAD_REQUEST, "Amount must be greater than 0");
                        }
                        return [4 /*yield*/, WalletService.executeGaslessTransfer(userId, to, amount)];
                    case 1:
                        result = _c.sent();
                        res.status(OK).json({
                            success: true,
                            data: result,
                            message: "Gasless transfer executed successfully",
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _c.sent();
                        if (error_4 instanceof HttpException) {
                            res.status(error_4.status).json({
                                success: false,
                                message: error_4.message,
                            });
                        }
                        else {
                            res.status(INTERNAL_SERVER_ERROR).json({
                                success: false,
                                message: "Failed to execute gasless transfer",
                            });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get current token balance
     */
    WalletController.getTokenBalance = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, balance, error_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        if (!userId) {
                            throw new HttpException(BAD_REQUEST, "User ID is required");
                        }
                        return [4 /*yield*/, WalletService.getTokenBalance(userId)];
                    case 1:
                        balance = _b.sent();
                        res.status(OK).json({
                            success: true,
                            data: balance,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _b.sent();
                        if (error_5 instanceof HttpException) {
                            res.status(error_5.status).json({
                                success: false,
                                message: error_5.message,
                            });
                        }
                        else {
                            res.status(INTERNAL_SERVER_ERROR).json({
                                success: false,
                                message: "Failed to get token balance",
                            });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get permit nonce for wallet
     */
    WalletController.getPermitNonce = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, nonce, error_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        if (!userId) {
                            throw new HttpException(BAD_REQUEST, "User ID is required");
                        }
                        return [4 /*yield*/, WalletService.getPermitNonce(userId)];
                    case 1:
                        nonce = _b.sent();
                        res.status(OK).json({
                            success: true,
                            data: nonce,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _b.sent();
                        if (error_6 instanceof HttpException) {
                            res.status(error_6.status).json({
                                success: false,
                                message: error_6.message,
                            });
                        }
                        else {
                            res.status(INTERNAL_SERVER_ERROR).json({
                                success: false,
                                message: "Failed to get permit nonce",
                            });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate wallet address
     */
    WalletController.validateAddress = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var address, validation;
            return __generator(this, function (_a) {
                try {
                    address = req.params.address;
                    if (!address) {
                        throw new HttpException(BAD_REQUEST, "Address is required");
                    }
                    validation = WalletService.validateAddress(address);
                    res.status(OK).json({
                        success: true,
                        data: validation,
                    });
                }
                catch (error) {
                    if (error instanceof HttpException) {
                        res.status(error.status).json({
                            success: false,
                            message: error.message,
                        });
                    }
                    else {
                        res.status(INTERNAL_SERVER_ERROR).json({
                            success: false,
                            message: "Failed to validate address",
                        });
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    return WalletController;
}());
export { WalletController };
