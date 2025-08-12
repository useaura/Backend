"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRouter = createAuthRouter;
var express_1 = require("express");
var authController_1 = require("../controllers/authController");
function createAuthRouter(opts) {
    var router = (0, express_1.Router)();
    var ctrl = (0, authController_1.authRoutesFactory)(opts);
    router.post("/google", ctrl.googleSignIn);
    return router;
}
