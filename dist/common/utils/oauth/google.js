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
import { google } from 'googleapis';
import { ENVIRONMENT } from '../../config/environment';
var GoogleOAuthService = /** @class */ (function () {
    function GoogleOAuthService() {
    }
    /**
     * Generate OAuth URL for Google login
     */
    GoogleOAuthService.getAuthUrl = function () {
        var scopes = [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ];
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent' // Force consent to get refresh token
        });
    };
    /**
     * Exchange authorization code for tokens
     */
    GoogleOAuthService.getTokens = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.oauth2Client.getToken(code)];
                    case 1:
                        tokens = (_a.sent()).tokens;
                        if (!tokens.access_token) {
                            throw new Error('Failed to get access token from Google');
                        }
                        return [2 /*return*/, {
                                access_token: tokens.access_token,
                                refresh_token: tokens.refresh_token || undefined,
                                scope: tokens.scope || '',
                                token_type: tokens.token_type || 'Bearer',
                                expiry_date: tokens.expiry_date || undefined
                            }];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error("Failed to exchange code for tokens: ".concat(error_1 instanceof Error ? error_1.message : 'Unknown error'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get user information from Google
     */
    GoogleOAuthService.getUserInfo = function (accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var oauth2, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.oauth2Client.setCredentials({ access_token: accessToken });
                        oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
                        return [4 /*yield*/, oauth2.userinfo.get()];
                    case 1:
                        data = (_a.sent()).data;
                        if (!data.id || !data.email) {
                            throw new Error('Invalid user data received from Google');
                        }
                        return [2 /*return*/, {
                                id: data.id,
                                email: data.email,
                                verified_email: data.verified_email || false,
                                name: data.name || '',
                                given_name: data.given_name || '',
                                family_name: data.family_name || '',
                                picture: data.picture || '',
                                locale: data.locale || ''
                            }];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error("Failed to get user info from Google: ".concat(error_2 instanceof Error ? error_2.message : 'Unknown error'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Refresh access token using refresh token
     */
    GoogleOAuthService.refreshAccessToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var credentials, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.oauth2Client.setCredentials({ refresh_token: refreshToken });
                        return [4 /*yield*/, this.oauth2Client.refreshAccessToken()];
                    case 1:
                        credentials = (_a.sent()).credentials;
                        if (!credentials.access_token) {
                            throw new Error('Failed to refresh access token');
                        }
                        return [2 /*return*/, {
                                access_token: credentials.access_token,
                                expiry_date: credentials.expiry_date || undefined
                            }];
                    case 2:
                        error_3 = _a.sent();
                        throw new Error("Failed to refresh access token: ".concat(error_3 instanceof Error ? error_3.message : 'Unknown error'));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Revoke access token
     */
    GoogleOAuthService.revokeToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.oauth2Client.revokeToken(token)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        // Don't throw error for revocation failures
                        console.warn('Failed to revoke Google token:', error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GoogleOAuthService.oauth2Client = new google.auth.OAuth2(ENVIRONMENT.GOOGLE.CLIENT_ID, ENVIRONMENT.GOOGLE.CLIENT_SECRET, ENVIRONMENT.GOOGLE.REDIRECT_URI);
    return GoogleOAuthService;
}());
export { GoogleOAuthService };
