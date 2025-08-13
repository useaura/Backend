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
import jwt from "jsonwebtoken";
import { GoogleOAuthService } from "../../common/utils/oauth/google";
import { ENVIRONMENT } from "../../common/config/environment";
import { User } from "../../schemas/userSchema";
import { Wallet } from "../../schemas/walletSchema";
import { ethers } from "ethers";
import { Encryption } from "../../common/utils/encryption/encryption";
import logger from "../../common/resources/logger";
import { generateAccessToken } from "../../common/utils/jwt/index";
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    /**
     * Generate access token for user
     */
    AuthService.generateAccessToken = function (userId_1, email_1) {
        return __awaiter(this, arguments, void 0, function (userId, email, deviceId) {
            var accessToken;
            if (deviceId === void 0) { deviceId = "web-client"; }
            return __generator(this, function (_a) {
                accessToken = generateAccessToken({
                    userId: userId,
                    email: email,
                    deviceId: deviceId,
                });
                return [2 /*return*/, accessToken];
            });
        });
    };
    /**
     * Google OAuth login aligned with DB schema
     */
    AuthService.googleLogin = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens, profile, user, wallet, saltRounds, defaultPinHash, newWallet, encryptionKey, _a, iv, encryptedData, cardSerialNumber, backfillWallet, encryptionKey, _b, iv, encryptedData, cardSerialNumber, accessToken, jwtSecret, refreshToken;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        logger.info("Google login request: ".concat(code));
                        return [4 /*yield*/, GoogleOAuthService.getTokens(code)];
                    case 1:
                        tokens = _c.sent();
                        logger.info("Google tokens: ".concat(JSON.stringify(tokens)));
                        return [4 /*yield*/, GoogleOAuthService.getUserInfo(tokens.access_token)];
                    case 2:
                        profile = _c.sent();
                        logger.info("Google profile: ".concat(JSON.stringify(profile)));
                        return [4 /*yield*/, User.findOne({ "auth.googleId": profile.id })];
                    case 3:
                        user = _c.sent();
                        return [4 /*yield*/, Wallet.findOne({ user: user === null || user === void 0 ? void 0 : user.id })];
                    case 4:
                        wallet = _c.sent();
                        if (!!user) return [3 /*break*/, 6];
                        return [4 /*yield*/, User.findOne({ email: profile.email.toLowerCase() })];
                    case 5:
                        user = _c.sent();
                        _c.label = 6;
                    case 6:
                        if (!user && !tokens.refresh_token) {
                            throw new Error("Google did not return a refresh token. Please re-consent.");
                        }
                        if (!!user) return [3 /*break*/, 10];
                        saltRounds = Number(process.env.PIN_SALT_ROUNDS || 10);
                        return [4 /*yield*/, bcrypt.hash("0000", saltRounds)];
                    case 7:
                        defaultPinHash = _c.sent();
                        newWallet = ethers.Wallet.createRandom();
                        encryptionKey = ENVIRONMENT.ENCRYPTION.DEFAULT_ENCRYPTION_KEY;
                        logger.info("Creating new user with encryption key length: ".concat(encryptionKey ? encryptionKey.length : "undefined"));
                        if (!encryptionKey) {
                            throw new Error("DEFAULT_ENCRYPTION_KEY environment variable is not set");
                        }
                        _a = Encryption.encrypt(newWallet.privateKey, encryptionKey), iv = _a.iv, encryptedData = _a.encryptedData;
                        return [4 /*yield*/, User.create({
                                auth: {
                                    googleId: profile.id,
                                    googleRefreshToken: tokens.refresh_token,
                                    refreshToken: "",
                                },
                                name: profile.name ||
                                    "".concat(profile.given_name || "", " ").concat(profile.family_name || "").trim(),
                                email: profile.email.toLowerCase(),
                                pinHash: defaultPinHash,
                            })];
                    case 8:
                        user = _c.sent();
                        cardSerialNumber = ethers.hexlify(ethers.randomBytes(8));
                        return [4 /*yield*/, Wallet.create({
                                user: user.id,
                                address: newWallet.address,
                                hashedPrivateKey: encryptedData,
                                iv: iv,
                                card: {
                                    dailyLimit: 0,
                                    monthlyLimit: 0,
                                    currentLimit: 0,
                                    cardSerialNumber: cardSerialNumber,
                                },
                            })];
                    case 9:
                        wallet = _c.sent();
                        return [3 /*break*/, 13];
                    case 10:
                        user.auth.googleId = profile.id;
                        if (tokens.refresh_token) {
                            user.auth.googleRefreshToken = tokens.refresh_token;
                        }
                        user.name = profile.name || user.name;
                        user.email = profile.email.toLowerCase();
                        return [4 /*yield*/, user.save()];
                    case 11:
                        _c.sent();
                        if (!!wallet) return [3 /*break*/, 13];
                        backfillWallet = ethers.Wallet.createRandom();
                        encryptionKey = ENVIRONMENT.ENCRYPTION.DEFAULT_ENCRYPTION_KEY;
                        if (!encryptionKey) {
                            throw new Error("DEFAULT_ENCRYPTION_KEY environment variable is not set");
                        }
                        _b = Encryption.encrypt(backfillWallet.privateKey, encryptionKey), iv = _b.iv, encryptedData = _b.encryptedData;
                        cardSerialNumber = ethers.hexlify(ethers.randomBytes(8));
                        return [4 /*yield*/, Wallet.create({
                                user: user.id,
                                address: backfillWallet.address,
                                hashedPrivateKey: encryptedData,
                                iv: iv,
                                card: {
                                    dailyLimit: 0,
                                    monthlyLimit: 0,
                                    currentLimit: 0,
                                    cardSerialNumber: cardSerialNumber,
                                },
                            })];
                    case 12:
                        wallet = _c.sent();
                        _c.label = 13;
                    case 13: return [4 /*yield*/, this.generateAccessToken(user.id, user.email)];
                    case 14:
                        accessToken = _c.sent();
                        jwtSecret = String(ENVIRONMENT.APP.JWT_SECRET);
                        refreshToken = jwt.sign({ userId: user.id, type: "refresh" }, jwtSecret, {
                            expiresIn: process.env
                                .JWT_REFRESH_EXPIRES_IN || "7d",
                        });
                        user.auth.refreshToken = refreshToken;
                        return [4 /*yield*/, user.save()];
                    case 15:
                        _c.sent();
                        return [2 /*return*/, {
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    wallet: {
                                        address: (wallet === null || wallet === void 0 ? void 0 : wallet.address) || "",
                                        balance: (wallet === null || wallet === void 0 ? void 0 : wallet.balance) || 0,
                                        card: {
                                            dailyLimit: (wallet === null || wallet === void 0 ? void 0 : wallet.card.dailyLimit) || 0,
                                            monthlyLimit: (wallet === null || wallet === void 0 ? void 0 : wallet.card.monthlyLimit) || 0,
                                            currentLimit: (wallet === null || wallet === void 0 ? void 0 : wallet.card.currentLimit) || 0,
                                        },
                                    },
                                },
                                accessToken: accessToken,
                                refreshToken: refreshToken,
                            }];
                }
            });
        });
    };
    /**
     * Refresh access token using refresh token
     */
    AuthService.refreshAccessToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var verifyRefreshToken, payload, user, newAccessToken, jwtSecret, newRefreshToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.info("Refresh token request");
                        return [4 /*yield*/, import("../../common/utils/jwt/index")];
                    case 1:
                        verifyRefreshToken = (_a.sent()).verifyRefreshToken;
                        payload = verifyRefreshToken(refreshToken);
                        return [4 /*yield*/, User.findById(payload.userId)];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new Error("User not found");
                        }
                        // Verify the refresh token matches the one stored in the database
                        if (user.auth.refreshToken !== refreshToken) {
                            throw new Error("Invalid refresh token");
                        }
                        return [4 /*yield*/, this.generateAccessToken(user.id, user.email)];
                    case 3:
                        newAccessToken = _a.sent();
                        jwtSecret = String(ENVIRONMENT.APP.JWT_SECRET);
                        newRefreshToken = jwt.sign({ userId: user.id, type: "refresh" }, jwtSecret, {
                            expiresIn: process.env
                                .JWT_REFRESH_EXPIRES_IN || "7d",
                        });
                        // Update the refresh token in the database
                        user.auth.refreshToken = newRefreshToken;
                        return [4 /*yield*/, user.save()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, {
                                accessToken: newAccessToken,
                                refreshToken: newRefreshToken,
                            }];
                }
            });
        });
    };
    return AuthService;
}());
export { AuthService };
export var authService = AuthService;
