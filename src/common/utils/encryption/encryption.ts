import crypto from "crypto";

export class Encryption {
  static encrypt(text: string, key: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
  }

  static decrypt(text: { iv: string; encryptedData: string }, key: string) {
    const iv = Buffer.from(text.iv, "hex");
    const encryptedData = Buffer.from(text.encryptedData, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
