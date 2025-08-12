"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsRouter = void 0;
var express_1 = require("express");
var settingsController_1 = require("../controllers/settingsController");
exports.settingsRouter = (0, express_1.Router)();
exports.settingsRouter.get("/", settingsController_1.settingsController.getSettings);
exports.settingsRouter.put("/", settingsController_1.settingsController.updateSettings);
