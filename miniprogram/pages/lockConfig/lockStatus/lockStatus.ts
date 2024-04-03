// 智能锁开关设置
import debounce from "debounce";
import * as LockAPI from "../../../api/interfaces/lock";
import { HttpHandler } from "../../../api/handle/httpHandler";

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        tamperAlert: undefined,
        resetButton: undefined,
        privacyLock: undefined,
        unlockDirection: undefined,
        pasageModeAutoUnlockSetting: undefined,
    },
    onLoad() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({ keyInfo: keyInfo, });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /* 查询智能锁开关设置状态 */
    getLockStatus: debounce(function () {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在查询智能锁设置项` })
        requirePlugin("myPlugin", ({ getLockConfig }: TTLockPlugin) => {
            getLockConfig({
                configType: 1 | 2 | 4 | 16,
                lockData: ekeyInfo.lockData
            }).then(res => {
                if (res.errorCode == 0) {
                    wx.hideLoading();
                    this.setData({
                        state: `查询智能锁设置项成功`,
                        tamperAlert: res.lockConfigs.tamperAlert,
                        resetButton: res.lockConfigs.resetButton,
                        privacyLock: res.lockConfigs.privacyLock,
                        unlockDirection: res.lockConfigs.unlockDirection,
                        pasageModeAutoUnlockSetting: res.lockConfigs.pasageModeAutoUnlockSetting,
                    });
                } else {
                    wx.hideLoading();
                    this.setData({ state: `查询智能锁设置项失败：${res.errorMsg}` });
                }
            })
        });
    }, 100),


    handleChange: debounce(function(event) {
        const switchOn = event.detail.value as boolean;
        const configType = event.target.dataset.type;
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在修改智能锁设置项` })
        requirePlugin("myPlugin", ({ setLockConfig }: TTLockPlugin) => {
            setLockConfig({
                configType,
                switchOn,
                lockData: ekeyInfo.lockData
            }).then(res => {
                if (res.errorCode == 0) {
                    this.setData({ state: `修改智能锁设置项成功` });
                    let type = 0;
                    switch(configType) {
                    case 1: type = 3; break;
                    case 2: type = 4; break;
                    case 4: type = 2; break;
                    case 16: type = 7; break;
                    default: wx.hideLoading(); return;
                    };
                    LockAPI.updateSetting({
                        lockId: ekeyInfo.lockId, // 智能锁ID
                        type: type, // 要修改的项
                        value: switchOn ? 1 : 2, // 设置值: 1-开启、2-关闭;
                        changeType: 1,
                         // 修改方式
                    }).then(res => {
                        wx.hideLoading();
                        if (HttpHandler.isResponseTrue(res)) {
                            HttpHandler.showErrorMsg("已同步服务器")
                        } else {
                            HttpHandler.handleResponseError(res);
                        }
                    }).catch(err => {
                        wx.hideLoading();
                        HttpHandler.handleServerError(err);
                    })
                } else {
                    wx.hideLoading();
                    this.setData({ state: `修改智能锁设置项失败：${res.errorMsg}` });
                    switch(configType) {
                    case 1: this.setData({ tamperAlert: !switchOn }); break;
                    case 2: this.setData({ resetButton: !switchOn }); break;
                    case 4: this.setData({ privacyLock: !switchOn }); break;
                    case 16: this.setData({ unlockDirection: !switchOn }); break;
                    case 32: this.setData({ pasageModeAutoUnlockSetting: !switchOn }); break;
                    };
                }
            })
        });
    }, 100)
})