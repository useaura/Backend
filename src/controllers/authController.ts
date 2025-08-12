import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import * as jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import { WalletModel } from "../models/Wallet";
import * as crypto from "crypto";

const generateAddress = (email: string) => {
  // For demo: generate deterministic pseudo-address — replace with real on-chain address creation in production
  return (
    "0x" +
    crypto
      .createHash("sha1")
      .update(email + Date.now().toString())
      .digest("hex")
      .slice(0, 40)
  );
};

export function authRoutesFactory(opts: {
  googleClientId: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}) {
  const client = new OAuth2Client(opts.googleClientId);

  return {
    async googleSignIn(req: Request, res: Response) {
      const { idToken } = req.body;
      if (!idToken) return res.status(400).json({ error: "idToken required" });

      try {
        // verify google token
        const ticket = await client.verifyIdToken({
          idToken,
          audience: opts.googleClientId,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.sub) throw new Error("Invalid token payload");

        const googleId = payload.sub;
        const name = payload.name || "Unnamed";
        const email = payload.email || "";
        const avatar = payload.picture;

        let user = await UserModel.findOne({ googleId });
        if (!user) {
          user = await UserModel.create({ googleId, name, email, avatar });
          // create wallet
          const address = generateAddress(email + googleId);
          await WalletModel.create({ user: user._id, address, balanceUSDC: 0 });
        }

        // create jwt
        const token = jwt.sign(
          { userId: user._id.toString() },
          opts.jwtSecret,
          { expiresIn: opts.jwtExpiresIn }
        );

        return res.json({
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          },
        });
      } catch (err: any) {
        console.error("Google sign in error:", err);
        return res.status(400).json({ error: "Invalid Google token" });
      }
    },
  };
}
