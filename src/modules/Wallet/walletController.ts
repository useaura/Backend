import { Request, Response } from "express";
import { WalletService } from "./walletService";
import { HttpException } from "../../common/resources/exception/httpException";
import {
  BAD_REQUEST,
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} from "../../common/resources/constants/statusCodes";

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export class WalletController {
  /**
   * Get user's wallet information
   */
  static async getWallet(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(BAD_REQUEST, "User ID is required");
      }

      const wallet = await WalletService.getWalletWithBalance(userId);
      res.status(OK).json({
        success: true,
        data: wallet,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to get wallet",
        });
      }
    }
  }

  /**
   * Get wallet by address
   */
  static async getWalletByAddress(req: Request, res: Response) {
    try {
      const { address } = req.params;
      if (!address) {
        throw new HttpException(BAD_REQUEST, "Wallet address is required");
      }

      const wallet = await WalletService.getWalletByAddress(address);
      if (!wallet) {
        throw new HttpException(NOT_FOUND, "Wallet not found");
      }

      res.status(OK).json({
        success: true,
        data: wallet,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to get wallet by address",
        });
      }
    }
  }

  /**
   * Get wallet by card serial number
   */
  static async getWalletByCard(req: Request, res: Response) {
    try {
      const { cardSerialNumber } = req.params;
      if (!cardSerialNumber) {
        throw new HttpException(BAD_REQUEST, "Card serial number is required");
      }

      const wallet = await WalletService.getWalletByCardSerialNumber(
        cardSerialNumber
      );
      if (!wallet) {
        throw new HttpException(NOT_FOUND, "Wallet not found");
      }

      res.status(OK).json({
        success: true,
        data: wallet,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to get wallet by card",
        });
      }
    }
  }

  /**
   * Execute gasless transfer
   */
  static async executeGaslessTransfer(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(UNAUTHORIZED, "User authentication required");
      }

      const { to, amount } = req.body;

      // Validate required fields
      if (!to || !amount) {
        throw new HttpException(
          BAD_REQUEST,
          "Missing required fields: to, amount"
        );
      }

      // Validate amount is positive
      if (BigInt(amount) <= 0) {
        throw new HttpException(BAD_REQUEST, "Amount must be greater than 0");
      }

      const result = await WalletService.executeGaslessTransfer(
        userId,
        to,
        amount
      );

      res.status(OK).json({
        success: true,
        data: result,
        message: "Gasless transfer executed successfully",
      });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to execute gasless transfer",
        });
      }
    }
  }

  /**
   * Get current token balance
   */
  static async getTokenBalance(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(BAD_REQUEST, "User ID is required");
      }

      const balance = await WalletService.getTokenBalance(userId);
      res.status(OK).json({
        success: true,
        data: balance,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        const message = error instanceof Error ? error.message : "Failed to get token balance";
        res.status(INTERNAL_SERVER_ERROR).json({
          success: false,
          message,
        });
      }
    }
  }

  /**
   * Get permit nonce for wallet
   */
  static async getPermitNonce(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException(BAD_REQUEST, "User ID is required");
      }

      const nonce = await WalletService.getPermitNonce(userId);
      res.status(OK).json({
        success: true,
        data: nonce,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to get permit nonce",
        });
      }
    }
  }

  /**
   * Validate wallet address
   */
  static async validateAddress(req: Request, res: Response) {
    try {
      const { address } = req.params;
      if (!address) {
        throw new HttpException(BAD_REQUEST, "Address is required");
      }

      const validation = WalletService.validateAddress(address);
      res.status(OK).json({
        success: true,
        data: validation,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to validate address",
        });
      }
    }
  }
}
