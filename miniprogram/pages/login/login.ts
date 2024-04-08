// TTLock Demo Login
import debounce from "debounce";
import * as OauthAPI from "../../api/interfaces/oauth";
import { HttpHandler } from "../../api/handle/httpHandler";
import { AES_Encrypt, AES_Decrypt, MD5_Encrypt } from "../../utils/crypto";

interface FormStatus {
    username?: string; // 账号
    password?: string; // 密码
}

Page({
    data: {
        username: "", // 用户名
        password: "", // 密码
    },
    onLoad () {
        const accessToken = AES_Decrypt((wx.getStorageSync<string>("access_token"))); // 当前用户登录状态
        if (accessToken) { // 已登录过的用户直接进入
            wx.reLaunch({ url: "../list/list" });
            return;
        }
        wx.removeStorageSync("access_token"); // 清空当前用户保存的登录状态
        const defaultUserID = AES_Decrypt(wx.getStorageSync<string>("user_id")); // 本地保存的用户名
        const defaultUserPSD = AES_Decrypt(wx.getStorageSync<string>("user_psd")); // 本地保存的密码

        this.setData({
            username: defaultUserID,
            password: defaultUserPSD,
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错

    // 输入校验
    handleCheckInput(event: FormStatus) {
        if (!event.username || !event.password) {
            HttpHandler.showErrorMsg("请输入账号和密码");
            return false;
        } else {
            return true;
        }
    },

    /** 提交用户登录 */
    handleSubmit: debounce(function (event) {
        const value = event.detail.value as FormStatus;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        const option = {
            "username": value.username,
            "password": MD5_Encrypt(value.password)
        };
        wx.showLoading({ title: "" });
        OauthAPI.token(option).then(res => {
            if (HttpHandler.isResponseTrue(res)) {
                wx.setStorageSync("user_id", AES_Encrypt(option.username));
                wx.setStorageSync("user_psd", AES_Encrypt(value.password));
                wx.setStorageSync("access_token", AES_Encrypt(res.access_token));
                wx.setStorageSync("uid", AES_Encrypt(String(res.uid)));
                wx.showLoading({ title: "" })
                wx.redirectTo({
                    url: '../list/list'
                })
            } else {
                HttpHandler.handleResponseError(res);
                wx.hideLoading();
            }
        }).catch(err => {
            HttpHandler.handleServerError(err);
            wx.hideLoading();
        })
    }, 100),
})