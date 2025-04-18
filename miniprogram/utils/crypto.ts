import CryptoJs from "crypto-js";

const AES_KEY = "TTLOCKDEMOAESKEY"; // 密钥
const AES_IV =  "ABCDEHELLOTTLOCK"; // 偏移量

export function AES_Encrypt (message?: string): string {
    const key = CryptoJs.enc.Utf8.parse(AES_KEY);
    const iv =  CryptoJs.enc.Utf8.parse(AES_IV);
    const mode = CryptoJs.mode.CBC;
    const padding = CryptoJs.pad.Pkcs7;
    return CryptoJs.AES.encrypt(String(message || ""), key, { iv, mode, padding}).toString();
};

export function AES_Decrypt (message?: string): string {
    const key = CryptoJs.enc.Utf8.parse(AES_KEY);
    const iv =  CryptoJs.enc.Utf8.parse(AES_IV);
    const mode = CryptoJs.mode.CBC;
    const padding = CryptoJs.pad.Pkcs7;
    return CryptoJs.enc.Utf8.stringify(CryptoJs.AES.decrypt(String(message || ""), key, { iv, mode, padding})).toString();
};

export function MD5_Encrypt (message?: string): string {
    return CryptoJs.MD5(String(message || "")).toString();
};
