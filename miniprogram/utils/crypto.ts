import CryptoJs from "crypto-js";

const AES_KEY = "TTLOCKDEMOAESKEY"; // 密钥
const AES_IV =  "ABCDEHELLOTTLOCK"; // 偏移量

// AES 加密
export function AES_Encrypt (message?: string): string {
    if (!message) return "";
    return CryptoJs.AES.encrypt(String(message), CryptoJs.enc.Utf8.parse(AES_KEY), {
        iv: CryptoJs.enc.Utf8.parse(AES_IV),
        mode: CryptoJs.mode.CBC,
        padding: CryptoJs.pad.Pkcs7
    }).toString();
};

// AES 解密
export function AES_Decrypt (message?: string): string {
    if (!message) return "";
    return CryptoJs.enc.Utf8.stringify(CryptoJs.AES.decrypt(String(message), CryptoJs.enc.Utf8.parse(AES_KEY), {
        iv: CryptoJs.enc.Utf8.parse(AES_IV),
        mode: CryptoJs.mode.CBC,
        padding: CryptoJs.pad.Pkcs7
    })).toString();
};

// MD5 加密
export function MD5_Encrypt (message?: string): string {
    if (!message) return "";
    return CryptoJs.MD5(String(message)).toString();
};
