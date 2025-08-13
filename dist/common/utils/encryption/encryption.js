import crypto from "crypto";
var Encryption = /** @class */ (function () {
    function Encryption() {
    }
    Encryption.normalizeKey = function (key) {
        // AES-256-CBC requires exactly 32 bytes
        var keyBuffer = Buffer.from(key, 'utf8');
        if (keyBuffer.length === 32) {
            return keyBuffer;
        }
        else if (keyBuffer.length < 32) {
            // Pad with zeros if key is too short
            var paddedKey = Buffer.alloc(32, 0);
            keyBuffer.copy(paddedKey);
            return paddedKey;
        }
        else {
            // Truncate if key is too long
            return keyBuffer.slice(0, 32);
        }
    };
    Encryption.encrypt = function (text, key) {
        if (!key) {
            throw new Error("Encryption key is required");
        }
        var normalizedKey = this.normalizeKey(key);
        var iv = crypto.randomBytes(16);
        var cipher = crypto.createCipheriv("aes-256-cbc", normalizedKey, iv);
        var encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
    };
    Encryption.decrypt = function (text, key) {
        if (!key) {
            throw new Error("Encryption key is required");
        }
        var normalizedKey = this.normalizeKey(key);
        var iv = Buffer.from(text.iv, "hex");
        var encryptedData = Buffer.from(text.encryptedData, "hex");
        var decipher = crypto.createDecipheriv("aes-256-cbc", normalizedKey, iv);
        var decrypted = decipher.update(encryptedData);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    };
    return Encryption;
}());
export { Encryption };
