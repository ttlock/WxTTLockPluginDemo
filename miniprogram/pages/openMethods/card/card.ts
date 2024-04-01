import debounce from "debounce";
import * as IdentityCardAPI from "../../../api/interfaces/identityCard";
import { HttpHandler } from "../../../api/handle/httpHandler";

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        cardList: [], // IC卡列表
        currentPageIndex: 0,
        isFinished: false, // 数据是否已完成加载
    },
    // 设置初始化参数
    onShow() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({ keyInfo: keyInfo }, () => {
            this.modifyCardList();
        });
        wx.setNavigationBarTitle({ title: keyInfo.lockAlias });
    },

    onPullDownRefresh() {
        this.modifyCardList();
    },

    onReachBottom() {
        if (this.data.isFinished) return;
        this.modifyCardList(this.data.currentPageIndex + 1);
    },

    // 更新IC卡列表
    modifyCardList: debounce(function (pageNo: number = 1) {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        IdentityCardAPI.list({
            lockId: ekeyInfo.lockId,
            pageNo: pageNo,
            pageSize: 20,
        }).then(res => {
            console.log(res);
            if (HttpHandler.isResponseTrue(res)) {
                const resultList = res.list.filter(item => (item.cardType === 1));
                if (pageNo == 1) this.data.cardList.splice(0, this.data.cardList.length, ...resultList);
                else resultList.forEach(item => this.data.cardList.push(item));
                this.setData({
                    cardList: this.data.cardList,
                    currentPageNo: pageNo,
                    isFinished: res.pageNo >= res.pages ? true : false
                });
            } else {
                HttpHandler.handleResponseError(res);
            }
            wx.hideLoading();
            wx.stopPullDownRefresh();
        }).catch(err => {
            HttpHandler.handleServerError(err);
            wx.hideLoading();
            wx.stopPullDownRefresh();
        })
    }, 100),

    handleGetAll() {
        wx.showLoading({ title: "" });
        this.setData({ state: "正在读取锁内所有IC卡" });
        requirePlugin("myPlugin", ({ getAllValidICCard }: TTLockPlugin) => {
            const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
            // 读取所有有效IC卡
            getAllValidICCard({ lockData: ekeyInfo.lockData }).then(res => {
                if (res.errorCode == 0) {
                    wx.hideLoading();
                    this.setData({ state: `共读取到 ${res.cardList.length} 条IC卡记录` });
                    HttpHandler.showErrorMsg("操作成功");
                } else {
                    wx.hideLoading();
                    this.setData({ state: `读取IC卡记录失败：${res.errorMsg}` });
                    HttpHandler.showErrorMsg("操作失败");
                }
            })
        })
    },

    // 进入IC卡管理页
    toDetail(event) {
        const cardItem = JSON.stringify(event.target.dataset.value);
        wx.setStorageSync("cardInfo", cardItem);
        wx.navigateTo({
            url: "./manage/manage"
        })
    }
})