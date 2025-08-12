import { Router } from "express";
import { settingsController } from "../controllers/settingsController";

export const settingsRouter = Router();

settingsRouter.get("/", settingsController.getSettings);
settingsRouter.put("/", settingsController.updateSettings);
