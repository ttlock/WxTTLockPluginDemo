// TTLock Demo Login
import API from "../../api/API";
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
        const defaultUserID = AES_Decrypt(wx.getStorageSync<string>("user_id")); // 本地保存的用户名
        const defaultUserPSD = AES_Decrypt(wx.getStorageSync<string>("user_psd")); // 本地保存的密码
        console.log(defaultUserID, defaultUserPSD)
        this.setData({
            username: defaultUserID,
            password: defaultUserPSD,
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错

    // 输入校验
    handleCheckInput(event: FormStatus) {
        if (!event.username || !event.password) {
            wx.showToast({
                icon: "none",
                title: "请输入账号密码"
            });
            return false;
        } else {
            return true;
        }
    },

    // 提交用户登录
    handleSubmit(event) {
        const value = event.detail.value as FormStatus;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        const option = {
            "username": value.username,
            "password": MD5_Encrypt(value.password)
        };
        API.login(option).then(res => {
            if (!!res) {
                wx.setStorageSync("user_id", AES_Encrypt(option.username));
                wx.setStorageSync("user_psd", AES_Encrypt(value.password));
                wx.setStorageSync("access_token", AES_Encrypt(res.access_token));
                wx.setStorageSync("uid", AES_Encrypt(res.uid));
                wx.showLoading({ title: "" })
                wx.redirectTo({
                    url: '../list/list'
                })
            }
        })
    }
})