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
import { authService } from "./authService";
import { GoogleOAuthService } from "../../common/utils/oauth/google";
import logger from "../../common/resources/logger";
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.getAuthUrl = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var authUrl;
            return __generator(this, function (_a) {
                authUrl = GoogleOAuthService.getAuthUrl();
                res.json({ authUrl: authUrl });
                return [2 /*return*/];
            });
        });
    };
    AuthController.googleRedirect = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var code, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        code = req.query.code;
                        logger.info("Google redirect request: ".concat(code));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (!code || typeof code !== "string") {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ error: "Authorization code is required" })];
                        }
                        return [4 /*yield*/, authService.googleLogin(code)];
                    case 2:
                        result = _a.sent();
                        res.json(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        logger.error("Google redirect error:", error_1);
                        res.status(500).json({ error: "Failed to authenticate with Google" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, user, token, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, email = _a.email, password = _a.password;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        if (!email || !password) {
                            return [2 /*return*/, res.status(400).json({ error: "Email and password are required" })];
                        }
                        return [4 /*yield*/, authService.login(email, password)];
                    case 2:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(401).json({ error: "Invalid credentials" })];
                        }
                        return [4 /*yield*/, authService.generateAccessToken(user.id, user.email)];
                    case 3:
                        token = _b.sent();
                        res.json({
                            token: token,
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                wallet: user.wallet
                            }
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        res.status(500).json({ error: "Failed to login" });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.googleLogin = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var code, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        code = req.body.code;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (!code) {
                            return [2 /*return*/, res.status(400).json({ error: "Code is required" })];
                        }
                        return [4 /*yield*/, authService.googleLogin(code)];
                    case 2:
                        result = _a.sent();
                        res.json(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        res.status(500).json({ error: "Failed to login" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.refreshToken = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var refreshToken, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        refreshToken = req.body.refreshToken;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (!refreshToken) {
                            return [2 /*return*/, res.status(400).json({ error: "Refresh token is required" })];
                        }
                        return [4 /*yield*/, authService.refreshAccessToken(refreshToken)];
                    case 2:
                        result = _a.sent();
                        res.json(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        logger.error("Token refresh error:", error_4);
                        res.status(401).json({ error: "Invalid or expired refresh token" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
export { AuthController };
