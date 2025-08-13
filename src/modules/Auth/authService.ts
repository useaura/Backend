import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { GoogleOAuthService } from "../../common/utils/oauth/google";
import { ENVIRONMENT } from "../../common/config/environment";
import { User } from "../../schemas/userSchema";
import { Wallet } from "../../schemas/walletSchema";
import { ethers } from "ethers";
import { Encryption } from "../../common/utils/encryption/encryption";
import logger from "../../common/resources/logger";
import { generateAccessToken } from "../../common/utils/jwt/index";

type GoogleLoginResult = {
  user: {
    id: string;
    name: string;
    email: string;
    wallet: {
      address: string;
      balance: number;
      card: {
        dailyLimit: number;
        monthlyLimit: number;
        currentLimit: number;
      };
    };
  };
  accessToken: string;
  refreshToken: string;
};

export class AuthService {
  /**
   * Generate access token for user
   */
  static async generateAccessToken(
    userId: string,
    email: string,
    deviceId: string = "web-client"
  ): Promise<string> {
    const accessToken = generateAccessToken({
      userId,
      email,
      deviceId,
    });
    return accessToken;
  }

  /**
   * Google OAuth login aligned with DB schema
   */
  static async googleLogin(code: string): Promise<GoogleLoginResult> {
    logger.info(`Google login request: ${code}`);

    const tokens = await GoogleOAuthService.getTokens(code);

    logger.info(`Google tokens: ${JSON.stringify(tokens)}`);

    const profile = await GoogleOAuthService.getUserInfo(tokens.access_token);

    logger.info(`Google profile: ${JSON.stringify(profile)}`);

    let user = await User.findOne({ "auth.googleId": profile.id });
    let wallet = await Wallet.findOne({ user: user?.id });
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
      const newWallet = ethers.Wallet.createRandom();
      const encryptionKey = ENVIRONMENT.ENCRYPTION.DEFAULT_ENCRYPTION_KEY;

      logger.info(
        `Creating new user with encryption key length: ${
          encryptionKey ? encryptionKey.length : "undefined"
        }`
      );

      if (!encryptionKey) {
        throw new Error(
          "DEFAULT_ENCRYPTION_KEY environment variable is not set"
        );
      }

      const { iv, encryptedData } = Encryption.encrypt(
        newWallet.privateKey,
        encryptionKey
      );

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

      const cardSerialNumber = ethers.hexlify(ethers.randomBytes(8));
      wallet = await Wallet.create({
        user: user.id,
        address: newWallet.address,
        hashedPrivateKey: encryptedData,
        iv: iv,
        card: {
          dailyLimit: 0,
          monthlyLimit: 0,
          currentLimit: 0,
          cardSerialNumber,
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

      // Ensure wallet exists for existing user
      if (!wallet) {
        const backfillWallet = ethers.Wallet.createRandom();
        const encryptionKey = ENVIRONMENT.ENCRYPTION.DEFAULT_ENCRYPTION_KEY;

        if (!encryptionKey) {
          throw new Error(
            "DEFAULT_ENCRYPTION_KEY environment variable is not set"
          );
        }

        const { iv, encryptedData } = Encryption.encrypt(
          backfillWallet.privateKey,
          encryptionKey
        );

        const cardSerialNumber = ethers.hexlify(ethers.randomBytes(8));
        wallet = await Wallet.create({
          user: user.id,
          address: backfillWallet.address,
          hashedPrivateKey: encryptedData,
          iv: iv,
          card: {
            dailyLimit: 0,
            monthlyLimit: 0,
            currentLimit: 0,
            cardSerialNumber,
          },
        });
      }
    }

    const accessToken = await this.generateAccessToken(user.id, user.email);
    const jwtSecret: Secret = String(ENVIRONMENT.APP.JWT_SECRET);
    const refreshToken = jwt.sign(
      { userId: user.id, type: "refresh" },
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
        wallet: {
          address: wallet?.address || "",
          balance: wallet?.balance || 0,
          card: {
            dailyLimit: wallet?.card.dailyLimit || 0,
            monthlyLimit: wallet?.card.monthlyLimit || 0,
            currentLimit: wallet?.card.currentLimit || 0,
          },
        },
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    logger.info(`Refresh token request`);

    // Verify the refresh token
    const { verifyRefreshToken } = await import("../../common/utils/jwt/index");
    const payload = verifyRefreshToken(refreshToken);

    // Find the user
    const user = await User.findById(payload.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify the refresh token matches the one stored in the database
    if (user.auth.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    // Generate new tokens
    const newAccessToken = await this.generateAccessToken(user.id, user.email);
    const jwtSecret: Secret = String(ENVIRONMENT.APP.JWT_SECRET);
    const newRefreshToken = jwt.sign(
      { userId: user.id, type: "refresh" },
      jwtSecret,
      {
        expiresIn:
          (process.env
            .JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "7d",
      }
    );

    // Update the refresh token in the database
    user.auth.refreshToken = newRefreshToken;
    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

export const authService = AuthService;
