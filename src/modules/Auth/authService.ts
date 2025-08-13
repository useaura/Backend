import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { GoogleOAuthService } from "../../common/utils/oauth/google";
import { ENVIRONMENT } from "../../common/config/environment";
import { User } from "../../schemas/userSchema";
import { Wallet } from "../../schemas/walletSchema";
import { ethers } from "ethers";

type GoogleLoginResult = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
};

export class AuthService {
  /**
   * Google OAuth login aligned with DB schema
   */
  static async googleLogin(code: string): Promise<GoogleLoginResult> {
    const tokens = await GoogleOAuthService.getTokens(code);

    const profile = await GoogleOAuthService.getUserInfo(tokens.access_token);

    let user = await User.findOne({ "auth.googleId": profile.id });
    if (!user) {
      user = await User.findOne({ email: profile.email.toLowerCase() });
    }

    if (!user && !tokens.refresh_token) {
      throw new Error(
        "Google did not return a refresh token. Please re-consent."
      );
    }

    if (!user) {
      const saltRounds = Number(process.env.PIN_SALT_ROUNDS || 10);
      const defaultPinHash = await bcrypt.hash("0000", saltRounds);
      const wallet = ethers

      user = await User.create({
        auth: {
          googleId: profile.id,
          googleRefreshToken: tokens.refresh_token as string,
          refreshToken: "",
        },
        name:
          profile.name ||
          `${profile.given_name || ""} ${profile.family_name || ""}`.trim(),
        email: profile.email.toLowerCase(),
        pinHash: defaultPinHash,
      });

      await Wallet.create({
        user: user.id,
        address: profile.email.toLowerCase(),
        hashedPrivateKey: "",
        card: {
          dailyLimit: 0,
          monthlyLimit: 0,
          currentLimit: 0,
        },
      });
    } else {
      user.auth.googleId = profile.id;
      if (tokens.refresh_token) {
        user.auth.googleRefreshToken = tokens.refresh_token;
      }
      user.name = profile.name || user.name;
      user.email = profile.email.toLowerCase();
      await user.save();
    }

    const jwtSecret: Secret = String(ENVIRONMENT.APP.JWT_SECRET);
    const accessToken = jwt.sign({ sub: user.id }, jwtSecret, {
      expiresIn:
        (process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "15m",
    });
    const refreshToken = jwt.sign(
      { sub: user.id, type: "refresh" },
      jwtSecret,
      {
        expiresIn:
          (process.env
            .JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "7d",
      }
    );

    user.auth.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }
}

export const authService = AuthService;
