// miniprogram/pages/list/list.js
import API from "../../api/API";
const { setShowLog } = requirePlugin("myPlugin");

Page({
    /**
     * 页面的初始数据
     */
    data: {
        isReady: false, // 页面数据是否已准备好
        keyList: [], // 电子钥匙列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow() {
        setShowLog(true); // 开启错误日志
        this.setData({ isReady: false }, () => {
            this.modifyKeyList();
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.setData({ isReady: false }, () => {
            this.modifyKeyList();
        });
    },

    // 更新智能锁列表
    modifyKeyList() {
        if (this.data.isReady) return;
        this.setData({ isReady: true });
        API.keyList().then(res => {
            if (res) {
                this.setData({ keyList: res.list });
                wx.stopPullDownRefresh();
            } else {
                wx.removeStorageSync("access_token");
                wx.reLaunch({ url: "/pages/login/login" });
            }
        })
    },

    // 进入锁详情页
    toDetail(event) {
        const keyItem = JSON.stringify(event.target.dataset.value);
        wx.setStorageSync("keyInfo", keyItem);
        wx.navigateTo({
            url: "../index/index"
        })
    }
})