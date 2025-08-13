import { Wallet } from "../../schemas/walletSchema";
import { OnchainInteractions } from "../../common/utils/onchain/onchainInteractions";
import { ethers } from "ethers";

export class WalletService {
  //   static async getWallet(userId: string) {
  //     const wallet = await Wallet.findOne({ user: userId }, { hashedPrivateKey: 0, iv: 0 });
  //     return wallet;
  //   }

  static async getWalletByCardSerialNumber(cardSerialNumber: string) {
    const wallet = await Wallet.findOne(
      { "card.cardSerialNumber": cardSerialNumber },
      { hashedPrivateKey: 0, iv: 0 }
    );
    return wallet;
  }

  /**
   * Execute gasless transfer using EIP-2612 permit
   * @param userId - User ID initiating the transfer
   * @param to - Recipient address
   * @param amount - Amount to transfer (in wei)
   * @param iv - Initialization vector for encrypted private key
   * @param encryptedData - Encrypted private key data
   * @returns Transfer result with transaction hashes
   */
  static async executeGaslessTransfer(
    userId: string,
    to: string,
    amount: string
  ) {
    try {
      // Get user's wallet
      const wallet = await Wallet.findOne({ user: userId });
      if (!wallet) {
        throw new Error("Wallet not found");
      }

      // Validate recipient address
      if (!ethers.isAddress(to)) {
        throw new Error("Invalid recipient address");
      }

      // Convert amount to bigint
      const amountBigInt = BigInt(amount);

      // Check if user has sufficient balance
      const currentBalance = await OnchainInteractions.getTokenBalance(
        wallet.address
      );
      if (currentBalance < amountBigInt) {
        throw new Error("Insufficient balance");
      }

      // Execute gasless transfer
      const result = await OnchainInteractions.executeGaslessTransfer(
        wallet.address,
        to,
        amountBigInt,
        wallet.iv,
        wallet.hashedPrivateKey
      );

      // Update wallet balance in database
      const newBalance = currentBalance - amountBigInt;
      await Wallet.updateOne(
        { user: userId },
        { balance: newBalance.toString() }
      );

      return {
        success: true,
        from: wallet.address,
        to,
        amount: amount,
        permitTxHash: result.permitTxHash,
        transferTxHash: result.transferTxHash,
        message: "Gasless transfer completed successfully",
      };
    } catch (error) {
      throw new Error(`Gasless transfer failed: ${error}`);
    }
  }

  /**
   * Get wallet details with balance
   * @param userId - User ID
   * @returns Wallet details with current balance
   */
  static async getWalletWithBalance(userId: string) {
    try {
      const wallet = await Wallet.findOne(
        { user: userId },
        { hashedPrivateKey: 0, iv: 0 }
      );
      if (!wallet) {
        throw new Error("Wallet not found");
      }

      // Get current on-chain balance
      const onchainBalance = await OnchainInteractions.getTokenBalance(
        wallet.address
      );

      return {
        ...wallet.toObject(),
        onchainBalance: onchainBalance.toString(),
        onchainBalanceWei: onchainBalance,
      };
    } catch (error) {
      throw new Error(`Failed to get wallet with balance: ${error}`);
    }
  }
}
