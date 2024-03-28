import debounce from "debounce";
import * as FingerprintAPI from "../../../api/interfaces/fingerprint";
import { HttpHandler } from "../../../api/handle/httpHandler";

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        fingerprintList: [], // 指纹列表
        currentPageIndex: 0,
        isFinished: false, // 数据是否已完成加载
    },
    // 设置初始化参数
    onShow() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({ keyInfo: keyInfo }, () => {
            this.modifyFingerprintList();
        });
        wx.setNavigationBarTitle({ title: keyInfo.lockAlias });
    },

    onPullDownRefresh() {
        this.modifyFingerprintList();
    },

    onReachBottom() {
        if (this.data.isFinished) return;
        this.modifyFingerprintList(this.data.currentPageIndex + 1);
    },

    // 更新指纹列表
    modifyFingerprintList: debounce(function (pageNo: number = 1) {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        FingerprintAPI.list({
            lockId: ekeyInfo.lockId,
            pageNo: pageNo,
            pageSize: 20,
        }).then(res => {
            console.log(res)
            if (HttpHandler.isResponseTrue(res)) {
                const resultList = res.list.filter(item => (item.fingerprintType === 1));
                if (pageNo == 1) this.data.fingerprintList.splice(0, this.data.fingerprintList.length, ...resultList);
                else resultList.forEach(item => this.data.fingerprintList.push(item));
                this.setData({
                    fingerprintList: this.data.fingerprintList,
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

    // 进入指纹管理页
    toDetail(event) {
        const fingerprintItem = JSON.stringify(event.target.dataset.value);
        wx.setStorageSync("fingerprintInfo", fingerprintItem);
        wx.navigateTo({
            url: "./manage/manage"
        })
    }
})