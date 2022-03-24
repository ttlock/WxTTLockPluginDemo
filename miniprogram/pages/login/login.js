// miniprogram/pages/login/login.js
import { hexMD5 } from './pwdmgr.js';
import API from "../../api/API";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        username: "",
        password: ""
    },
    onLoad () {
        wx.clearStorageSync();
    },

    submit (e) {
        if (!!!this.data.username || !!!this.data.password) {
            wx.showToast({
                icon: "none",
                title: "请输入账号密码"
            })
            return;
        }
        API.login({
            "username": this.data.username,
            "password": hexMD5(this.data.password)
        }).then(res => {
            if (!!res) {
                wx.setStorageSync('access_token', res.access_token);
                wx.setStorageSync('psd', hexMD5(this.data.password));
                wx.setStorageSync('uid', res.uid);
                wx.showLoading()
                wx.redirectTo({
                    url: '../list/list'
                })
            }
        })
    }
})