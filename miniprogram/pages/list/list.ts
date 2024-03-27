// 智能锁列表
import * as EKeyAPI from "../../api/interfaces/key";
import { HttpHandler } from "../../api/handle/httpHandler";
import debounce from "debounce";

Page({
    data: {
        isReady: false, // 页面数据是否已准备好
        keyList: new Array<IEKeyAPI.List.EKeyInfo>(), // 电子钥匙列表
    },
    onLoad() {
        console.log("load page");
        requirePlugin("myPlugin", ({ setShowLog }: TTLockPlugin) => {
            // 开启用户错误日志输出
            setShowLog(true, this.handleShowLog);
        });
        wx.showLoading({ title: "" });
        this.modifyKeyList();
    },

    /* TODO 处理用户错误日志, 用户可自行操作日志上传 */
    handleShowLog(...args: any) {
        console.log("操作日志:", ...args);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.modifyKeyList();
    },

    /* 更新电子钥匙列表 */
    modifyKeyList: debounce(function (pageNo: number = 1) {
        EKeyAPI.list({
            pageNo: pageNo,
            pageSize: 20
        }).then(res => {
            if (HttpHandler.isResponseTrue(res)) {
                if (pageNo == 1) this.data.keyList.splice(0, this.data.keyList.length, ...res.list);
                else res.list.forEach(item => this.data.keyList.push(item));
                this.setData({ keyList: this.data.keyList });
                wx.stopPullDownRefresh();
            } else {
                wx.removeStorageSync("access_token");
                HttpHandler.handleResponseError(res);
                wx.reLaunch({ url: "/pages/login/login" });
            }
            wx.hideLoading();
        }).catch(err => {
            wx.removeStorageSync("access_token");
            HttpHandler.handleServerError(err);
            wx.reLaunch({ url: "/pages/login/login" });
            wx.hideLoading();
        })
    }, 100),

    /* 退出登录 */
    handleLogOut: debounce(function () {
        wx.showLoading({ title: "退出登录" });
        wx.removeStorageSync("access_token");
        wx.removeStorageSync("user_psd");
        wx.reLaunch({ url: "/pages/login/login", complete: () => { wx.hideLoading(); }});
    }, 100),

    // 进入锁详情页
    toDetail(event) {
        const keyItem = JSON.stringify(event.target.dataset.value);
        wx.setStorageSync("keyInfo", keyItem);
        wx.navigateTo({
            url: "../lockBase/lockBase"
        })
    }
})