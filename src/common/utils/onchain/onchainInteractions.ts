import { ethers } from "ethers";
import { ENVIRONMENT } from "../../config/environment";
import { Encryption } from "../encryption/encryption";
import { erc20Abi } from "viem";

// EIP-2612 Permit ABI - includes permit function
const erc20PermitAbi = [
  ...erc20Abi,
  "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external",
  "function nonces(address owner) external view returns (uint256)",
  "function DOMAIN_SEPARATOR() external view returns (bytes32)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
] as const;

// Type for the contract with permit functionality
type ERC20PermitContract = ethers.Contract & {
  permit: (owner: string, spender: string, value: bigint, deadline: bigint, v: number, r: string, s: string) => Promise<ethers.ContractTransactionResponse>;
  nonces: (owner: string) => Promise<bigint>;
  DOMAIN_SEPARATOR: () => Promise<string>;
  transferFrom: (from: string, to: string, amount: bigint) => Promise<ethers.ContractTransactionResponse>;
};

const provider = new ethers.JsonRpcProvider(ENVIRONMENT.APP.RPC_URL);

export class OnchainInteractions {
  static async getProvider() {
    return provider;
  }

  static getTokenAddress() {
    return ENVIRONMENT.APP.TOKEN_ADDRESS;
  }

  static async getERC20Contract(address: string): Promise<ERC20PermitContract> {
    if (!address || !ethers.isAddress(address) || address.toLowerCase() === "0x0000000000000000000000000000000000000000") {
      throw new Error("Invalid TOKEN_ADDRESS. Please set a valid ERC-20 token address in the environment.");
    }
    const contract = new ethers.Contract(address, erc20PermitAbi, provider) as ERC20PermitContract;
    return contract;
  }

  static decryptPrivateKey(iv: string, encryptedData: string) {
    const decryptedPrivateKey = Encryption.decrypt(
      { iv, encryptedData },
      ENVIRONMENT.ENCRYPTION.DEFAULT_ENCRYPTION_KEY || ""
    );
    return decryptedPrivateKey;
  }

  static async getBalance(address: string) {
    const balance = await provider.getBalance(address);
    return balance;
  }

  static async getTokenBalance(address: string) {
    const tokenAddress = this.getTokenAddress();
    if (!tokenAddress || !ethers.isAddress(tokenAddress) || tokenAddress.toLowerCase() === "0x0000000000000000000000000000000000000000") {
      throw new Error("TOKEN_ADDRESS is not configured or is invalid (zero address). Set ENV APP.TOKEN_ADDRESS to your ERC-20 contract.");
    }
    const contract = await this.getERC20Contract(tokenAddress);
    const balance = await contract.balanceOf(address);
    return balance;
  }

  static async transfer(from: string, to: string, amount: number) {
    const tokenAddress = this.getTokenAddress();
    const contract = await this.getERC20Contract(tokenAddress);
    const tx = await contract.transfer(to, amount);
    return tx;
  }

  /**
   * Generate EIP-2612 permit signature for gasless approval
   * @param userAddress - The user's wallet address
   * @param iv - Initialization vector for encrypted private key
   * @param encryptedData - Encrypted private key data
   * @param spender - Address to approve (operator)
   * @param value - Amount to approve
   * @param deadline - Deadline for the permit
   * @returns Permit signature components
   */
  static async generatePermitSignature(
    userAddress: string,
    iv: string,
    encryptedData: string,
    spender: string,
    value: bigint,
    deadline: bigint
  ) {
    try {
      // Decrypt user's private key
      const userPrivateKey = this.decryptPrivateKey(iv, encryptedData);
      const userWallet = new ethers.Wallet(userPrivateKey, provider);
      
      const tokenAddress = this.getTokenAddress();
      const contract: ERC20PermitContract = await this.getERC20Contract(tokenAddress);
      
      // Get current nonce for the user
      const nonce = await contract.nonces(userAddress);
      
      // Get domain separator
      const domainSeparator = await contract.DOMAIN_SEPARATOR();
      
      // EIP-2612 permit type hash
      const PERMIT_TYPEHASH = ethers.keccak256(
        ethers.toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)")
      );
      
      // Create permit hash
      const permitHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["bytes32", "bytes32", "bytes32", "uint256", "uint256", "uint256"],
          [
            domainSeparator,
            PERMIT_TYPEHASH,
            userAddress,
            spender,
            value,
            nonce,
            deadline
          ]
        )
      );
      
      // Sign the permit hash
      const signature = await userWallet.signMessage(ethers.getBytes(permitHash));
      
      // Split signature into components
      const sig = ethers.Signature.from(signature);
      
      return {
        v: sig.v,
        r: sig.r,
        s: sig.s,
        nonce: nonce
      };
    } catch (error) {
      throw new Error(`Failed to generate permit signature: ${error}`);
    }
  }

  /**
   * Execute gasless transfer using EIP-2612 permit
   * @param from - User's address
   * @param to - Recipient address
   * @param amount - Amount to transfer
   * @param iv - Initialization vector for encrypted private key
   * @param encryptedData - Encrypted private key data
   * @returns Transaction hash
   */
  static async executeGaslessTransfer(
    from: string,
    to: string,
    amount: bigint,
    iv: string,
    encryptedData: string
  ) {
    try {
      // Check if operator key is configured
      if (!ENVIRONMENT.APP.OPERATOR_KEY) {
        throw new Error("OPERATOR_KEY not configured");
      }

      const tokenAddress = this.getTokenAddress();
      const contract: ERC20PermitContract = await this.getERC20Contract(tokenAddress);
      
      // Create operator wallet
      const operatorWallet = new ethers.Wallet(ENVIRONMENT.APP.OPERATOR_KEY, provider);
      const operatorContract = contract.connect(operatorWallet) as ERC20PermitContract;
      
      // Set deadline (1 hour from now)
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
      
      // Generate permit signature
      const permitSig = await this.generatePermitSignature(
        from,
        iv,
        encryptedData,
        operatorWallet.address,
        amount,
        deadline
      );
      
      // Execute permit to approve operator
      const permitTx = await operatorContract.permit(
        from,
        operatorWallet.address,
        amount,
        deadline,
        permitSig.v,
        permitSig.r,
        permitSig.s
      );
      
      // Wait for permit transaction to be mined
      await permitTx.wait();
      
      // Execute transferFrom (operator transfers on behalf of user)
      const transferTx = await operatorContract.transferFrom(from, to, amount);
      
      return {
        permitTxHash: permitTx.hash,
        transferTxHash: transferTx.hash,
        permitReceipt: await permitTx.wait(),
        transferReceipt: await transferTx.wait()
      };
    } catch (error) {
      throw new Error(`Failed to execute gasless transfer: ${error}`);
    }
  }

  /**
   * Get permit nonce for a user address
   * @param userAddress - User's wallet address
   * @returns Current nonce
   */
  static async getPermitNonce(userAddress: string) {
    try {
      const tokenAddress = this.getTokenAddress();
      const contract: ERC20PermitContract = await this.getERC20Contract(tokenAddress);
      const nonce = await contract.nonces(userAddress);
      return nonce;
    } catch (error) {
      throw new Error(`Failed to get permit nonce: ${error}`);
    }
  }

  /**
   * Get domain separator for the token contract
   * @returns Domain separator bytes
   */
  static async getDomainSeparator() {
    try {
      const tokenAddress = this.getTokenAddress();
      const contract: ERC20PermitContract = await this.getERC20Contract(tokenAddress);
      const domainSeparator = await contract.DOMAIN_SEPARATOR();
      return domainSeparator;
    } catch (error) {
      throw new Error(`Failed to get domain separator: ${error}`);
    }
  }
}
