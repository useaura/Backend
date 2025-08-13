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
import { isHttpError } from "../exception/httpException";
import { INTERNAL_SERVER_ERROR } from "../constants/statusCodes";
import logger from "../logger";
import { isAxiosError } from "axios";
var isDefaultError = function (error) {
    return error instanceof Error;
};
var handleRequestError = function (error, response, logOnly) {
    var parsedError = parseUnknownError(error);
    var requestUrl = response.req.originalUrl;
    void logger.error(parsedError.message, __assign(__assign({}, parsedError), { requestUrl: requestUrl }));
    if (logOnly) {
        return;
    }
    return response
        .status(parsedError.statusCode)
        .send({ message: parsedError.message });
};
var parseUnknownError = function (error) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var parsedError = {
        message: "",
        name: "",
        statusCode: INTERNAL_SERVER_ERROR,
    };
    if (isAxiosError(error)) {
        parsedError["data"] = {
            errorResponse: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data,
            requestConfig: {
                data: (_b = error.config) === null || _b === void 0 ? void 0 : _b.data,
                url: (_c = error.config) === null || _c === void 0 ? void 0 : _c.url,
                baseURL: (_d = error.config) === null || _d === void 0 ? void 0 : _d.baseURL,
                method: (_e = error.config) === null || _e === void 0 ? void 0 : _e.method,
                params: (_f = error.config) === null || _f === void 0 ? void 0 : _f.params,
                headers: (_g = error.config) === null || _g === void 0 ? void 0 : _g.headers,
            },
        };
        parsedError["cause"] = error.cause;
        parsedError["statusCode"] =
            (_k = (_j = (_h = error.response) === null || _h === void 0 ? void 0 : _h.status) !== null && _j !== void 0 ? _j : error.status) !== null && _k !== void 0 ? _k : INTERNAL_SERVER_ERROR;
        parsedError["message"] = error.message;
        parsedError["code"] = error.code;
        parsedError["stack"] = error.stack;
        parsedError["name"] = error.name;
        return parsedError;
    }
    else if (isHttpError(error)) {
        parsedError["message"] = error.message;
        parsedError["statusCode"] = error.status;
        parsedError["stack"] = error.stack;
        parsedError["data"] = error.data;
        parsedError["cause"] = error.cause;
        parsedError["code"] = "ERR_HTTP_REQUEST_ERROR";
        parsedError["name"] = error.name;
        return parsedError;
    }
    else if (isDefaultError(error)) {
        parsedError["message"] = error.message;
        parsedError["statusCode"] = INTERNAL_SERVER_ERROR;
        parsedError["stack"] = error.stack;
        parsedError["data"] = "";
        parsedError["cause"] = error.cause;
        parsedError["code"] = "ERR_HTTP_REQUEST_ERROR";
        parsedError["name"] = error.name;
        return parsedError;
    }
    else {
        parsedError["message"] =
            (_l = error.message) !== null && _l !== void 0 ? _l : "An unknown error occurred";
        parsedError["statusCode"] = INTERNAL_SERVER_ERROR;
        parsedError["code"] = "ERR_UNKNOWN_ERROR";
        parsedError["stack"] = error.stack;
        parsedError["cause"] = error.cause;
        parsedError["name"] = error.name;
        return parsedError;
    }
};
export { handleRequestError, parseUnknownError };
