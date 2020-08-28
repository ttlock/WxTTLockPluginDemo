// miniprogram/pages/login/login.js
import { hexMD5 } from './pwdmgr.js';
const CLIENT_ID = "7946f0d923934a61baefb3303de4d132";
const CLIENT_SECRET = "56d9721abbc3d22a58452c24131a5554";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    password: ""
  },
  onLoad () {
    wx.clearStorageSync("userInfo");
  },

  submit (e) {
    console.log(this.data.username, this.data.password)
    wx.request({
      url: 'https://api.sciener.com/oauth2/token',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "password",
        "username": this.data.username,
        "password": hexMD5(this.data.password),
        "redirect_uri": "http://www.sciener.cn"
      },
      success (res) {
        console.log(JSON.stringify(res.data))
        if (!!!res.data.access_token) {
          wx.showToast({
            icon: "none",
            title: res.data.errmsg
          })
        } else {
          wx.setStorageSync('userInfo', JSON.stringify(res.data));
          wx.redirectTo({
            url: "../list/list",
          })
        }
      }
    })
  }
})