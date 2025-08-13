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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { ethers } from "ethers";
import { ENVIRONMENT } from "../../config/environment";
import { Encryption } from "../encryption/encryption";
import { erc20Abi } from "viem";
// EIP-2612 Permit ABI - includes permit function
var erc20PermitAbi = __spreadArray(__spreadArray([], erc20Abi, true), [
    "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external",
    "function nonces(address owner) external view returns (uint256)",
    "function DOMAIN_SEPARATOR() external view returns (bytes32)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
], false);
var provider = new ethers.JsonRpcProvider(ENVIRONMENT.APP.RPC_URL);
var OnchainInteractions = /** @class */ (function () {
    function OnchainInteractions() {
    }
    OnchainInteractions.getProvider = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, provider];
            });
        });
    };
    OnchainInteractions.getTokenAddress = function () {
        return ENVIRONMENT.APP.TOKEN_ADDRESS;
    };
    OnchainInteractions.getERC20Contract = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var contract;
            return __generator(this, function (_a) {
                contract = new ethers.Contract(address, erc20PermitAbi, provider);
                return [2 /*return*/, contract];
            });
        });
    };
    OnchainInteractions.decryptPrivateKey = function (iv, encryptedData) {
        var decryptedPrivateKey = Encryption.decrypt({ iv: iv, encryptedData: encryptedData }, ENVIRONMENT.ENCRYPTION.DEFAULT_ENCRYPTION_KEY || "");
        return decryptedPrivateKey;
    };
    OnchainInteractions.getBalance = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.getBalance(address)];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, balance];
                }
            });
        });
    };
    OnchainInteractions.getTokenBalance = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenAddress, contract, balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddress = this.getTokenAddress();
                        return [4 /*yield*/, this.getERC20Contract(tokenAddress)];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.balanceOf(address)];
                    case 2:
                        balance = _a.sent();
                        return [2 /*return*/, balance];
                }
            });
        });
    };
    OnchainInteractions.transfer = function (from, to, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenAddress, contract, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddress = this.getTokenAddress();
                        return [4 /*yield*/, this.getERC20Contract(tokenAddress)];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.transfer(to, amount)];
                    case 2:
                        tx = _a.sent();
                        return [2 /*return*/, tx];
                }
            });
        });
    };
    /**
     * Generate EIP-2612 permit signature for gasless approval
     * @param userAddress - The user's wallet address
     * @param iv - Initialization vector for encrypted private key
     * @param encryptedData - Encrypted private key data
     * @param spender - Address to approve (operator)
     * @param value - Amount to approve
     * @param deadline - Deadline for the permit
     * @returns Permit signature components
     */
    OnchainInteractions.generatePermitSignature = function (userAddress, iv, encryptedData, spender, value, deadline) {
        return __awaiter(this, void 0, void 0, function () {
            var userPrivateKey, userWallet, tokenAddress, contract, nonce, domainSeparator, PERMIT_TYPEHASH, permitHash, signature, sig, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        userPrivateKey = this.decryptPrivateKey(iv, encryptedData);
                        userWallet = new ethers.Wallet(userPrivateKey, provider);
                        tokenAddress = this.getTokenAddress();
                        return [4 /*yield*/, this.getERC20Contract(tokenAddress)];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.nonces(userAddress)];
                    case 2:
                        nonce = _a.sent();
                        return [4 /*yield*/, contract.DOMAIN_SEPARATOR()];
                    case 3:
                        domainSeparator = _a.sent();
                        PERMIT_TYPEHASH = ethers.keccak256(ethers.toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"));
                        permitHash = ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["bytes32", "bytes32", "bytes32", "uint256", "uint256", "uint256"], [
                            domainSeparator,
                            PERMIT_TYPEHASH,
                            userAddress,
                            spender,
                            value,
                            nonce,
                            deadline
                        ]));
                        return [4 /*yield*/, userWallet.signMessage(ethers.getBytes(permitHash))];
                    case 4:
                        signature = _a.sent();
                        sig = ethers.Signature.from(signature);
                        return [2 /*return*/, {
                                v: sig.v,
                                r: sig.r,
                                s: sig.s,
                                nonce: nonce
                            }];
                    case 5:
                        error_1 = _a.sent();
                        throw new Error("Failed to generate permit signature: ".concat(error_1));
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Execute gasless transfer using EIP-2612 permit
     * @param from - User's address
     * @param to - Recipient address
     * @param amount - Amount to transfer
     * @param iv - Initialization vector for encrypted private key
     * @param encryptedData - Encrypted private key data
     * @returns Transaction hash
     */
    OnchainInteractions.executeGaslessTransfer = function (from, to, amount, iv, encryptedData) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenAddress, contract, operatorWallet, operatorContract, deadline, permitSig, permitTx, transferTx, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        // Check if operator key is configured
                        if (!ENVIRONMENT.APP.OPERATOR_KEY) {
                            throw new Error("OPERATOR_KEY not configured");
                        }
                        tokenAddress = this.getTokenAddress();
                        return [4 /*yield*/, this.getERC20Contract(tokenAddress)];
                    case 1:
                        contract = _b.sent();
                        operatorWallet = new ethers.Wallet(ENVIRONMENT.APP.OPERATOR_KEY, provider);
                        operatorContract = contract.connect(operatorWallet);
                        deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
                        return [4 /*yield*/, this.generatePermitSignature(from, iv, encryptedData, operatorWallet.address, amount, deadline)];
                    case 2:
                        permitSig = _b.sent();
                        return [4 /*yield*/, operatorContract.permit(from, operatorWallet.address, amount, deadline, permitSig.v, permitSig.r, permitSig.s)];
                    case 3:
                        permitTx = _b.sent();
                        // Wait for permit transaction to be mined
                        return [4 /*yield*/, permitTx.wait()];
                    case 4:
                        // Wait for permit transaction to be mined
                        _b.sent();
                        return [4 /*yield*/, operatorContract.transferFrom(from, to, amount)];
                    case 5:
                        transferTx = _b.sent();
                        _a = {
                            permitTxHash: permitTx.hash,
                            transferTxHash: transferTx.hash
                        };
                        return [4 /*yield*/, permitTx.wait()];
                    case 6:
                        _a.permitReceipt = _b.sent();
                        return [4 /*yield*/, transferTx.wait()];
                    case 7: return [2 /*return*/, (_a.transferReceipt = _b.sent(),
                            _a)];
                    case 8:
                        error_2 = _b.sent();
                        throw new Error("Failed to execute gasless transfer: ".concat(error_2));
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get permit nonce for a user address
     * @param userAddress - User's wallet address
     * @returns Current nonce
     */
    OnchainInteractions.getPermitNonce = function (userAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenAddress, contract, nonce, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        tokenAddress = this.getTokenAddress();
                        return [4 /*yield*/, this.getERC20Contract(tokenAddress)];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.nonces(userAddress)];
                    case 2:
                        nonce = _a.sent();
                        return [2 /*return*/, nonce];
                    case 3:
                        error_3 = _a.sent();
                        throw new Error("Failed to get permit nonce: ".concat(error_3));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get domain separator for the token contract
     * @returns Domain separator bytes
     */
    OnchainInteractions.getDomainSeparator = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokenAddress, contract, domainSeparator, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        tokenAddress = this.getTokenAddress();
                        return [4 /*yield*/, this.getERC20Contract(tokenAddress)];
                    case 1:
                        contract = _a.sent();
                        return [4 /*yield*/, contract.DOMAIN_SEPARATOR()];
                    case 2:
                        domainSeparator = _a.sent();
                        return [2 /*return*/, domainSeparator];
                    case 3:
                        error_4 = _a.sent();
                        throw new Error("Failed to get domain separator: ".concat(error_4));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return OnchainInteractions;
}());
export { OnchainInteractions };
