import { Request, Response } from "express";
import { UserModel } from "../models/User";

export const settingsController = {
  async getSettings(req: Request, res: Response) {
    const user = req.user;
    const userDoc = await UserModel.findById(user._id).select("-pinHash");
    res.json({
      settings: {
        name: userDoc?.name,
        email: userDoc?.email,
        panicMode: userDoc?.panicMode,
      },
    });
  },

  async updateSettings(req: Request, res: Response) {
    const user = req.user;
    const { name, panicMode } = req.body;
    const update: any = {};
    if (typeof name === "string") update.name = name;
    if (typeof panicMode === "boolean") update.panicMode = panicMode;

    const updated = await UserModel.findByIdAndUpdate(user._id, update, {
      new: true,
    }).select("-pinHash");
    res.json({ settings: updated });
  },
};
