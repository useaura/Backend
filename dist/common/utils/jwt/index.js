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
import jwt from 'jsonwebtoken';
import { ENVIRONMENT } from '../../config/environment';
/**
 * Generate an access token
 * @param payload - The token payload
 * @returns string - The generated JWT token
 */
export var generateAccessToken = function (payload) {
    var tokenPayload = __assign(__assign({}, payload), { type: 'access' });
    return jwt.sign(tokenPayload, ENVIRONMENT.APP.JWT_SECRET, {
        expiresIn: '2h', // 2 hours - balanced security vs usability
        issuer: 'sylis-auth',
        audience: 'sylis-users'
    });
};
/**
 * Generate a refresh token
 * @param payload - The token payload
 * @returns string - The generated JWT token
 */
export var generateRefreshToken = function (payload) {
    var tokenPayload = __assign(__assign({}, payload), { type: 'refresh' });
    return jwt.sign(tokenPayload, ENVIRONMENT.APP.JWT_SECRET, {
        expiresIn: '7d', // 7 days
        issuer: 'sylis-auth',
        audience: 'sylis-users'
    });
};
/**
 * Verify and decode a JWT token
 * @param token - The JWT token to verify
 * @returns TokenPayload - The decoded token payload
 */
export var verifyToken = function (token) {
    try {
        var decoded = jwt.verify(token, ENVIRONMENT.APP.JWT_SECRET, {
            issuer: 'sylis-auth',
            audience: 'sylis-users'
        });
        return decoded;
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token has expired');
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        else {
            throw new Error('Token verification failed');
        }
    }
};
/**
 * Verify an access token specifically
 * @param token - The access token to verify
 * @returns AccessTokenPayload - The decoded access token payload
 */
export var verifyAccessToken = function (token) {
    var payload = verifyToken(token);
    if (payload.type !== 'access') {
        throw new Error('Invalid token type: expected access token');
    }
    return payload;
};
/**
 * Verify a refresh token specifically
 * @param token - The refresh token to verify
 * @returns RefreshTokenPayload - The decoded refresh token payload
 */
export var verifyRefreshToken = function (token) {
    var payload = verifyToken(token);
    if (payload.type !== 'refresh') {
        throw new Error('Invalid token type: expected refresh token');
    }
    return payload;
};
/**
 * Decode a JWT token without verification (for debugging)
 * @param token - The JWT token to decode
 * @returns any - The decoded token payload
 */
export var decodeToken = function (token) {
    return jwt.decode(token);
};
/**
 * Check if a token is expired
 * @param token - The JWT token to check
 * @returns boolean - True if token is expired
 */
export var isTokenExpired = function (token) {
    try {
        var decoded = jwt.decode(token);
        if (!decoded || typeof decoded.exp !== 'number') {
            return true;
        }
        var currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    }
    catch (_a) {
        return true;
    }
};
