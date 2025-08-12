"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error(err);
    var status = err.status || 500;
    res.status(status).json({
        error: err.message || "Internal Server Error",
    });
}
