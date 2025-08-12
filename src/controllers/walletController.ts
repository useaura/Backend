import { Request, Response } from "express";
import { WalletModel } from "../models/Wallet";
import { TransactionModel } from "../models/Transaction";
import { UserModel } from "../models/User";
import bcrypt from "bcrypt";

const PIN_SALT_ROUNDS = Number(process.env.PIN_SALT_ROUNDS || 10);

/**
 * Note: This backend simulates balance changes. In production you'd integrate with:
 *  - on-chain relayer / custodial engine OR
 *  - USDC custodial provider API / payment rails
 */

export const walletController = {
  async getWallet(req: Request, res: Response) {
    const user = req.user;
    const wallet = await WalletModel.findOne({ user: user._id });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });
    res.json({ wallet });
  },

  async getRecentTx(req: Request, res: Response) {
    const user = req.user;
    const wallet = await WalletModel.findOne({ user: user._id });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    const txs = await TransactionModel.find({ wallet: wallet._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ transactions: txs });
  },

  async previewWithdraw(req: Request, res: Response) {
    const { toAddress, amount } = req.body;
    if (!toAddress || !amount)
      return res.status(400).json({ error: "toAddress and amount required" });

    // compute fee (dummy)
    const fee = Math.max(0.5, Math.round(Number(amount) * 0.005 * 100) / 100); // 0.5 or 0.5%
    res.json({
      amount: Number(amount),
      fee,
      total: Number(amount) + fee,
      chain: "ethereum",
      toAddress,
    });
  },

  async confirmWithdraw(req: Request, res: Response) {
    const user = req.user;
    const { toAddress, amount, pin } = req.body;
    if (!toAddress || !amount || typeof pin === "undefined")
      return res
        .status(400)
        .json({ error: "toAddress, amount and pin required" });

    const userDoc = await UserModel.findById(user._id);
    if (!userDoc) return res.status(404).json({ error: "User not found" });

    if (!userDoc.pinHash) return res.status(400).json({ error: "PIN not set" });

    const ok = await bcrypt.compare(String(pin), userDoc.pinHash);
    if (!ok) return res.status(401).json({ error: "Invalid PIN" });

    // Panic mode check
    if (userDoc.panicMode) {
      return res
        .status(403)
        .json({ error: "Panic Mode active. Withdrawals disabled." });
    }

    const wallet = await WalletModel.findOne({ user: user._id });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    const amt = Number(amount);
    const fee = Math.max(0.5, Math.round(amt * 0.005 * 100) / 100);
    const total = amt + fee;

    if (wallet.balanceUSDC < total)
      return res.status(400).json({ error: "Insufficient funds" });

    // simulate creating pending transaction
    const tx = await TransactionModel.create({
      wallet: wallet._id,
      type: "send",
      amountUSDC: amt,
      feeUSDC: fee,
      counterparty: toAddress,
      status: "pending",
      chain: "ethereum",
    });

    // simulate immediate success (in real life, call the blockchain or custody API)
    wallet.balanceUSDC -= total;
    await wallet.save();
    tx.status = "success";
    await tx.save();

    return res.json({ tx, wallet });
  },

  async setPin(req: Request, res: Response) {
    const user = req.user;
    const { pin } = req.body;
    if (!pin || String(pin).length < 4)
      return res.status(400).json({ error: "PIN must be at least 4 digits" });

    const hash = await bcrypt.hash(String(pin), PIN_SALT_ROUNDS);
    await UserModel.findByIdAndUpdate(user._id, { pinHash: hash });
    res.json({ ok: true });
  },

  // Receive flow: get wallet address & QR token
  async getReceiveAddress(req: Request, res: Response) {
    const user = req.user;
    const wallet = await WalletModel.findOne({ user: user._id });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    // For demo return address and a simple receive token
    const receiveToken = Buffer.from(
      wallet.address + ":" + Date.now()
    ).toString("base64");
    res.json({
      address: wallet.address,
      chain: "ethereum",
      token: receiveToken, // front-end can embed token in QR
      warning: "Ensure you send on Ethereum to avoid loss of funds.",
    });
  },

  async simulateReceive(req: Request, res: Response) {
    // Endpoint to simulate an incoming payment (for testing)
    const { toAddress, amount, from } = req.body;
    if (!toAddress || !amount)
      return res.status(400).json({ error: "toAddress and amount required" });

    const wallet = await WalletModel.findOne({ address: toAddress });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    const amt = Number(amount);
    wallet.balanceUSDC += amt;
    await wallet.save();

    const tx = await TransactionModel.create({
      wallet: wallet._id,
      type: "receive",
      amountUSDC: amt,
      feeUSDC: 0,
      counterparty: from || "external",
      status: "success",
      chain: "ethereum",
    });

    res.json({ ok: true, tx, wallet });
  },
};
