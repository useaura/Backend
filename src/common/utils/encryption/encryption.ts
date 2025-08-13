import crypto from "crypto";

export class Encryption {
  private static normalizeKey(key: string): Buffer {
    // AES-256-CBC requires exactly 32 bytes
    const keyBuffer = Buffer.from(key, 'utf8');
    
    if (keyBuffer.length === 32) {
      return keyBuffer;
    } else if (keyBuffer.length < 32) {
      // Pad with zeros if key is too short
      const paddedKey = Buffer.alloc(32, 0);
      keyBuffer.copy(paddedKey);
      return paddedKey;
    } else {
      // Truncate if key is too long
      return keyBuffer.slice(0, 32);
    }
  }

  static encrypt(text: string, key: string) {
    if (!key) {
      throw new Error("Encryption key is required");
    }
    
    const normalizedKey = this.normalizeKey(key);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", normalizedKey, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
  }

  static decrypt(text: { iv: string; encryptedData: string }, key: string) {
    if (!key) {
      throw new Error("Encryption key is required");
    }
    
    const normalizedKey = this.normalizeKey(key);
    const iv = Buffer.from(text.iv, "hex");
    const encryptedData = Buffer.from(text.encryptedData, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", normalizedKey, iv);
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
