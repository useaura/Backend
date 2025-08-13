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
import bcrypt from "bcrypt";
import { User } from "../../schemas/userSchema";
import { Wallet } from "../../schemas/walletSchema";
import logger from "../../common/resources/logger";
// Get user profile
export var getProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, wallet, profile, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                }
                return [4 /*yield*/, User.findById(userId).select("-pinHash -auth.googleRefreshToken -auth.refreshToken")];
            case 1:
                user = _b.sent();
                return [4 /*yield*/, Wallet.findOne({ user: userId })];
            case 2:
                wallet = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                profile = {
                    displayName: user.name,
                    email: user.email,
                    cardLimits: (wallet === null || wallet === void 0 ? void 0 : wallet.card) ? {
                        dailyLimit: wallet.card.dailyLimit,
                        monthlyLimit: wallet.card.monthlyLimit,
                        currentLimit: wallet.card.currentLimit
                    } : null,
                    controls: {
                        panicMode: user.panicMode,
                        reversePinEnabled: user.reversePinEnabled
                    }
                };
                res.json(profile);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                logger.error("Error fetching profile:", error_1);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Update display name
export var updateDisplayName = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, displayName, user, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                displayName = req.body.displayName;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                }
                if (!displayName || displayName.trim().length === 0) {
                    return [2 /*return*/, res.status(400).json({ error: "Display name is required" })];
                }
                if (displayName.length > 50) {
                    return [2 /*return*/, res.status(400).json({ error: "Display name must be 50 characters or less" })];
                }
                return [4 /*yield*/, User.findByIdAndUpdate(userId, { name: displayName.trim() }, { new: true }).select("-pinHash -auth.googleRefreshToken -auth.refreshToken")];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                res.json({
                    message: "Display name updated successfully",
                    displayName: user.name
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                logger.error("Error updating display name:", error_2);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Update card limits
export var updateCardLimits = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, dailyLimit, monthlyLimit, updateFields, existingWallet, wallet, error_3;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                _a = req.body, dailyLimit = _a.dailyLimit, monthlyLimit = _a.monthlyLimit;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                }
                // Ensure at least one field is provided
                if (dailyLimit === undefined && monthlyLimit === undefined) {
                    return [2 /*return*/, res.status(400).json({ error: "Provide at least one of dailyLimit or monthlyLimit" })];
                }
                // Validate limits
                if (dailyLimit !== undefined && (dailyLimit < 0 || dailyLimit > 100000)) {
                    return [2 /*return*/, res.status(400).json({ error: "Daily limit must be between 0 and 100,000 USDC" })];
                }
                if (monthlyLimit !== undefined && (monthlyLimit < 0 || monthlyLimit > 1000000)) {
                    return [2 /*return*/, res.status(400).json({ error: "Monthly limit must be between 0 and 1,000,000 USDC" })];
                }
                if (dailyLimit !== undefined && monthlyLimit !== undefined && dailyLimit > monthlyLimit) {
                    return [2 /*return*/, res.status(400).json({ error: "Daily limit cannot exceed monthly limit" })];
                }
                updateFields = {};
                if (dailyLimit !== undefined)
                    updateFields["card.dailyLimit"] = dailyLimit;
                if (monthlyLimit !== undefined)
                    updateFields["card.monthlyLimit"] = monthlyLimit;
                return [4 /*yield*/, Wallet.findOne({ user: userId })];
            case 1:
                existingWallet = _c.sent();
                if (!existingWallet) {
                    logger.warn("updateCardLimits: No wallet found for user ".concat(userId));
                    return [2 /*return*/, res.status(404).json({
                            error: "Wallet not found",
                            details: "No wallet exists for this user. Initialize wallet before updating card limits."
                        })];
                }
                logger.info("updateCardLimits: Updating card limits for wallet ".concat(existingWallet._id.toString()), { userId: userId, updateFields: updateFields });
                return [4 /*yield*/, Wallet.findOneAndUpdate({ user: userId }, updateFields, { new: true })];
            case 2:
                wallet = _c.sent();
                if (!wallet) {
                    // This should be rare given the pre-check, but keep for safety
                    logger.error("updateCardLimits: Wallet vanished during update for user ".concat(userId));
                    return [2 /*return*/, res.status(404).json({ error: "Wallet not found" })];
                }
                res.json({
                    message: "Card limits updated successfully",
                    cardLimits: {
                        dailyLimit: wallet.card.dailyLimit,
                        monthlyLimit: wallet.card.monthlyLimit,
                        currentLimit: wallet.card.currentLimit
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _c.sent();
                logger.error("Error updating card limits:", error_3);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Toggle panic mode
export var togglePanicMode = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, enabled, user, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                enabled = req.body.enabled;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                }
                if (typeof enabled !== "boolean") {
                    return [2 /*return*/, res.status(400).json({ error: "Enabled must be a boolean value" })];
                }
                return [4 /*yield*/, User.findByIdAndUpdate(userId, { panicMode: enabled }, { new: true }).select("-pinHash -auth.googleRefreshToken -auth.refreshToken")];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                res.json({
                    message: "Panic mode ".concat(enabled ? "enabled" : "disabled", " successfully"),
                    panicMode: user.panicMode
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                logger.error("Error toggling panic mode:", error_4);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Toggle reverse PIN
export var toggleReversePin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, enabled, user, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                enabled = req.body.enabled;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                }
                if (typeof enabled !== "boolean") {
                    return [2 /*return*/, res.status(400).json({ error: "Enabled must be a boolean value" })];
                }
                return [4 /*yield*/, User.findByIdAndUpdate(userId, { reversePinEnabled: enabled }, { new: true }).select("-pinHash -auth.googleRefreshToken -auth.refreshToken")];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                res.json({
                    message: "Reverse PIN ".concat(enabled ? "enabled" : "disabled", " successfully"),
                    reversePinEnabled: user.reversePinEnabled
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                logger.error("Error toggling reverse PIN:", error_5);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Change card PIN
export var changeCardPin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, currentPin, newPin, user, isCurrentPinValid, saltRounds, newPinHash, error_6;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                _a = req.body, currentPin = _a.currentPin, newPin = _a.newPin;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                }
                if (!currentPin || !newPin) {
                    return [2 /*return*/, res.status(400).json({ error: "Current PIN and new PIN are required" })];
                }
                if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
                    return [2 /*return*/, res.status(400).json({ error: "PIN must be exactly 4 digits" })];
                }
                if (currentPin === newPin) {
                    return [2 /*return*/, res.status(400).json({ error: "New PIN must be different from current PIN" })];
                }
                return [4 /*yield*/, User.findById(userId)];
            case 1:
                user = _c.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                return [4 /*yield*/, bcrypt.compare(currentPin, user.pinHash)];
            case 2:
                isCurrentPinValid = _c.sent();
                if (!isCurrentPinValid) {
                    return [2 /*return*/, res.status(400).json({ error: "Current PIN is incorrect" })];
                }
                saltRounds = 12;
                return [4 /*yield*/, bcrypt.hash(newPin, saltRounds)];
            case 3:
                newPinHash = _c.sent();
                // Update PIN
                return [4 /*yield*/, User.findByIdAndUpdate(userId, { pinHash: newPinHash })];
            case 4:
                // Update PIN
                _c.sent();
                res.json({ message: "PIN changed successfully" });
                return [3 /*break*/, 6];
            case 5:
                error_6 = _c.sent();
                logger.error("Error changing PIN:", error_6);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
// Verify PIN (for authentication and reverse PIN detection)
export var verifyPin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, pin, user, isNormalPinValid, reversedPin, isReversePinValid, _a, error_7;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 9, , 10]);
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                pin = req.body.pin;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                }
                if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
                    return [2 /*return*/, res.status(400).json({ error: "PIN must be exactly 4 digits" })];
                }
                return [4 /*yield*/, User.findById(userId)];
            case 1:
                user = _c.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                return [4 /*yield*/, bcrypt.compare(pin, user.pinHash)];
            case 2:
                isNormalPinValid = _c.sent();
                reversedPin = pin.split("").reverse().join("");
                _a = user.reversePinEnabled;
                if (!_a) return [3 /*break*/, 4];
                return [4 /*yield*/, bcrypt.compare(reversedPin, user.pinHash)];
            case 3:
                _a = (_c.sent());
                _c.label = 4;
            case 4:
                isReversePinValid = _a;
                if (!isNormalPinValid) return [3 /*break*/, 5];
                res.json({
                    valid: true,
                    panicMode: false,
                    message: "PIN verified successfully"
                });
                return [3 /*break*/, 8];
            case 5:
                if (!isReversePinValid) return [3 /*break*/, 7];
                // Trigger panic mode if reverse PIN is used
                return [4 /*yield*/, User.findByIdAndUpdate(userId, { panicMode: true })];
            case 6:
                // Trigger panic mode if reverse PIN is used
                _c.sent();
                res.json({
                    valid: true,
                    panicMode: true,
                    message: "Panic mode activated via reverse PIN"
                });
                return [3 /*break*/, 8];
            case 7:
                res.status(400).json({
                    valid: false,
                    error: "Invalid PIN"
                });
                _c.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_7 = _c.sent();
                logger.error("Error verifying PIN:", error_7);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
