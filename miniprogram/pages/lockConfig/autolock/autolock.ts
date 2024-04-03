// 智能锁自动闭锁时间设置
import debounce from "debounce";
import * as LockAPI from "../../../api/interfaces/lock";
import { HttpHandler } from "../../../api/handle/httpHandler";

interface FormStatus {
    enable?: boolean;
    autolockTime?: number; // 自动闭锁时间设置
}

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        enable: undefined,
        autolockTime: 0, // 自动闭锁时间设置
        max: 0,
        min: 0,
        placeholder: ""
    },
    onLoad() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({ keyInfo: keyInfo });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错

    // 输入校验
    handleCheckInput(value: FormStatus) {
        if (this.data.enable && (!value.autolockTime || value.autolockTime < this.data.min || value.autolockTime > this.data.max)) {
            HttpHandler.showErrorMsg(`请输入${this.data.min} - ${this.data.max}之间的数字`);
            return false;
        }
        else return true;
    },

    handleSubmit: debounce(function (event) {
        const value = event.detail.value;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleChange(value);
    }, 100),

    /* 查询自动闭锁时间 */
    getAutoLockTime: debounce(function () {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在查询自动闭锁时间` })
        requirePlugin("myPlugin", ({ getAutomaticLockingPeriod }: TTLockPlugin) => {
            getAutomaticLockingPeriod({ lockData: ekeyInfo.lockData }).then(res => {
                if (res.errorCode == 0) {
                    wx.hideLoading();
                    this.setData({
                        state: `查询自动闭锁时间成功`,
                        enable: res.autoLockInfo.enable,
                        autolockTime: res.autoLockInfo.autoLockTime,
                        max: res.autoLockInfo.maxAutoLockTime,
                        min: res.autoLockInfo.minAutoLockTime,
                        placeholder: `请输入${res.autoLockInfo.minAutoLockTime} - ${res.autoLockInfo.maxAutoLockTime}之间的数字`
                    });
                } else {
                    wx.hideLoading();
                    this.setData({ state: `查询自动闭锁时间失败：${res.errorMsg}` });
                }
            })
        });
    }, 100),


    handleChange: debounce(function(value: FormStatus) {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在修改自动闭锁时间` })
        requirePlugin("myPlugin", ({ setAutomaticLockingPeriod }: TTLockPlugin) => {
            setAutomaticLockingPeriod({
                seconds: value.enable ? value.autolockTime : 0,
                lockData: ekeyInfo.lockData
            }).then(res => {
                if (res.errorCode == 0) {
                    this.setData({ state: `自动闭锁时间设置成功` });
                    LockAPI.setAutoLockTime({
                        lockId: ekeyInfo.lockId, // 智能锁ID
                        seconds: value.enable ? value.autolockTime : 0,
                        type: 1,
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
                    this.setData({ state: `自动闭锁时间设置失败：${res.errorMsg}` });
                }
            })
        });
    }, 100)
})