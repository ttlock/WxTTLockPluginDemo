// miniprogram/pages/login/login.js
import { hexMD5 } from './pwdmgr.js';
import { login } from '../../api/api.js';

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
    login({
      "username": this.data.username,
      "password": hexMD5(this.data.password)
    }).then(res => {
      wx.setStorageSync('access_token', res.access_token);
      wx.setStorageSync('psd', hexMD5(this.data.password));
      wx.setStorageSync('uid', res.uid);
      wx.showLoading()
      wx.redirectTo({
        url: '../list/list'
      })
    }).catch(err => {
    })
  }
})