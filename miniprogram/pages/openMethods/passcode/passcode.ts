import debounce from "debounce";
import * as LockAPI from "../../../api/interfaces/lock";
import { HttpHandler } from "../../../api/handle/httpHandler";

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        passcodeList: [], // 密码列表
        currentPageIndex: 0,
        isFinished: false, // 数据是否已完成加载
    },
    // 设置初始化参数
    onShow() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({ keyInfo: keyInfo }, () => {
            this.modifyPasscodeList();
        });
        wx.setNavigationBarTitle({ title: keyInfo.lockAlias });
    },

    onPullDownRefresh() {
        this.modifyPasscodeList();
    },

    onReachBottom() {
        if (this.data.isFinished) return;
        this.modifyPasscodeList(this.data.currentPageIndex + 1);
    },

    // 更新密码列表
    modifyPasscodeList: debounce(function (pageNo: number = 1) {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        LockAPI.listKeyboardPwd({
            lockId: ekeyInfo.lockId,
            pageNo: pageNo,
            pageSize: 20,
        }).then(res => {
            console.log(res)
            if (HttpHandler.isResponseTrue(res)) {
                const resultList = res.list.filter(item => (
                    item.keyboardPwdVersion === 4 && (item.keyboardPwdType == 2 || item.keyboardPwdType == 3)
                ));
                if (pageNo == 1) this.data.passcodeList.splice(0, this.data.passcodeList.length, ...resultList);
                else resultList.forEach(item => this.data.keyList.push(item));
                this.setData({
                    passcodeList: this.data.passcodeList,
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

    // 进入密码管理页
    toDetail(event) {
        const passcodeItem = JSON.stringify(event.target.dataset.value);
        wx.setStorageSync("passcodeInfo", passcodeItem);
        wx.navigateTo({
            url: "./manage/manage"
        })
    }
})