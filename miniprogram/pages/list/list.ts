// 智能锁列表
import * as EKeyAPI from "../../api/interfaces/key";
import * as HttpHandler from "../../api/handle/httpHandler";

Page({
    data: {
        keyList: [], // 电子钥匙列表
    },
    onLoad() {
        // 设置日志回调方法
        const plugin = requirePlugin("myPlugin");
        plugin.setShowLog(true, this.handleShowLog);
    },
    onShow() {
        wx.showLoading({ title: "" });
        this.modifyKeyList();
    },
    onPullDownRefresh() {
        this.modifyKeyList();
    },
    /* TODO 处理用户错误日志, 用户可自行操作日志上传 */
    handleShowLog(...args: any) {
        console.log("操作日志:", ...args);
    },
    /* 更新电子钥匙列表 */
    async modifyKeyList() {
        try {
            const res = await EKeyAPI.list({ pageNo: 1, pageSize: 20 });
            wx.hideLoading();
            wx.stopPullDownRefresh();
            if (HttpHandler.isResponseTrue(res)) {
                const list = this.data?.keyList || [];
                list.splice(0, list?.length, ...(res?.list || []));
                this.setData({ keyList:list });
            } else {
                wx.removeStorageSync("access_token");
                HttpHandler.handleResponseError(res);
                wx.reLaunch({ url: "/pages/login/login" });
            }
        } catch(err) {
            wx.hideLoading();
            wx.stopPullDownRefresh();
            wx.removeStorageSync("access_token");
            HttpHandler.handleServerError(err);
            wx.reLaunch({ url: "/pages/login/login" });
        }
    },

    /* 退出登录 */
    handleLogOut() {
        wx.removeStorageSync("access_token");
        wx.removeStorageSync("user_psd");
        wx.reLaunch({ url: "/pages/login/login" });
    },

    // 进入锁详情页
    toDetail(event) {
        const keyItem = JSON.stringify(event.target.dataset.value);
        wx.setStorageSync("keyInfo", keyItem);
        wx.navigateTo({ url: "../lockBase/lockBase" })
    }
})