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
exports.authRoutesFactory = authRoutesFactory;
var google_auth_library_1 = require("google-auth-library");
var jwt = require("jsonwebtoken");
var User_1 = require("../models/User");
var Wallet_1 = require("../models/Wallet");
var crypto = require("crypto");
var generateAddress = function (email) {
    // For demo: generate deterministic pseudo-address — replace with real on-chain address creation in production
    return ("0x" +
        crypto
            .createHash("sha1")
            .update(email + Date.now().toString())
            .digest("hex")
            .slice(0, 40));
};
function authRoutesFactory(opts) {
    var client = new google_auth_library_1.OAuth2Client(opts.googleClientId);
    return {
        googleSignIn: function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var idToken, ticket, payload, googleId, name_1, email, avatar, user, address, token, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            idToken = req.body.idToken;
                            if (!idToken)
                                return [2 /*return*/, res.status(400).json({ error: "idToken required" })];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 7, , 8]);
                            return [4 /*yield*/, client.verifyIdToken({
                                    idToken: idToken,
                                    audience: opts.googleClientId,
                                })];
                        case 2:
                            ticket = _a.sent();
                            payload = ticket.getPayload();
                            if (!payload || !payload.sub)
                                throw new Error("Invalid token payload");
                            googleId = payload.sub;
                            name_1 = payload.name || "Unnamed";
                            email = payload.email || "";
                            avatar = payload.picture;
                            return [4 /*yield*/, User_1.UserModel.findOne({ googleId: googleId })];
                        case 3:
                            user = _a.sent();
                            if (!!user) return [3 /*break*/, 6];
                            return [4 /*yield*/, User_1.UserModel.create({ googleId: googleId, name: name_1, email: email, avatar: avatar })];
                        case 4:
                            user = _a.sent();
                            address = generateAddress(email + googleId);
                            return [4 /*yield*/, Wallet_1.WalletModel.create({ user: user._id, address: address, balanceUSDC: 0 })];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            token = jwt.sign({ userId: user._id.toString() }, opts.jwtSecret, { expiresIn: opts.jwtExpiresIn });
                            return [2 /*return*/, res.json({
                                    token: token,
                                    user: {
                                        id: user._id,
                                        name: user.name,
                                        email: user.email,
                                        avatar: user.avatar,
                                    },
                                })];
                        case 7:
                            err_1 = _a.sent();
                            console.error("Google sign in error:", err_1);
                            return [2 /*return*/, res.status(400).json({ error: "Invalid Google token" })];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        },
    };
}
