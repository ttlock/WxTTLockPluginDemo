// TTLock Demo Login
import * as OauthAPI from "../../api/interfaces/oauth";
import * as HttpHandler from "../../api/handle/httpHandler";
import * as Crypto from "../../utils/crypto";

Page({
    data: {
        username: "", // 用户名
        password: "", // 密码
    },
    onLoad() {
        const accessToken = Crypto.AES_Decrypt((wx.getStorageSync("access_token"))); // 当前用户登录状态
        if (accessToken) { // 已登录过的用户直接进入
            wx.reLaunch({ url: "../list/list" });
            return;
        }
        wx.removeStorageSync("access_token"); // 清空当前用户保存的登录状态
        
        const username = Crypto.AES_Decrypt(wx.getStorageSync("user_id")) || ""; // 本地保存的用户名
        const password = Crypto.AES_Decrypt(wx.getStorageSync("user_psd")) || ""; // 本地保存的密码
        this.setData({ username, password });
    },
    handleInputEmpty() { }, // 解决绑定数据输入报错

    // 输入校验
    handleCheckInput(event) {
        if (!event?.username || !event?.password) {
            HttpHandler.showErrorMsg("请输入账号和密码");
            return false;
        } else {
            return true;
        }
    },

    // 提交登录
    async handleSubmit(event) {
        const value = event.detail.value;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        try {
            wx.showLoading({ title: "" });
            const res = await OauthAPI.token({
                "username": value?.username || "",
                "password": Crypto.MD5_Encrypt(value?.password || "")
            });
            wx.hideLoading();
            if (HttpHandler.isResponseTrue(res)) {
                wx.setStorageSync("user_id", Crypto.AES_Encrypt(value?.username || ""));
                wx.setStorageSync("user_psd", Crypto.AES_Encrypt(value?.password || ""));
                wx.setStorageSync("access_token", Crypto.AES_Encrypt(res?.access_token));
                wx.setStorageSync("uid", Crypto.AES_Encrypt(String(res?.uid)));
                wx.redirectTo({
                    url: '../list/list'
                })
            } else {
                HttpHandler.handleResponseError(res);
            }
        } catch(err) {
            wx.hideLoading();
            HttpHandler.handleServerError(err);
        }
    }
})