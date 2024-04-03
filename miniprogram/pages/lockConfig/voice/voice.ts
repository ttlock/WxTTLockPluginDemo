import debounce from "debounce";
import * as LockAPI from "../../../api/interfaces/lock";
import { HttpHandler } from "../../../api/handle/httpHandler";

Page({
    data: {
        voiceArray: ["关闭", 1, 2, 3, 4, 5],
        voiceLevel: undefined,
        state: '',
        keyInfo: {}, // 钥匙数据
    },
    onLoad() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({ keyInfo: keyInfo, });
    },

    /* 查询智能锁开关设置状态 */
    getVoiceStatus: debounce(function () {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在查询智能锁音量等级` })
        requirePlugin("myPlugin", ({ getLockSoundWithSoundVolume }: TTLockPlugin) => {
            getLockSoundWithSoundVolume({ lockData: ekeyInfo.lockData }).then(res => {
                if (res.errorCode == 0) {
                    wx.hideLoading();
                    this.setData({
                        state: `查询智能锁音量等级成功`,
                        voiceLevel: res.soundVolume
                    });
                } else {
                    wx.hideLoading();
                    this.setData({ state: `查询智能锁音量等级失败：${res.errorMsg}` });
                }
            })
        });
    }, 100),

    /* 设置智能锁音量等级 */
    handleSubmit: debounce(function(event) {
        const voiceLevel = parseInt(event.detail.value.voiceLevel);
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        console.log(voiceLevel)
        wx.showLoading({ title: "" });
        this.setData({ state: `正在修改智能锁音量` })
        requirePlugin("myPlugin", ({ setLockSoundWithSoundVolume }: TTLockPlugin) => {
            setLockSoundWithSoundVolume({
                soundVolume: voiceLevel,
                lockData: ekeyInfo.lockData
            }).then(res => {
                if (res.errorCode == 0) {
                    wx.hideLoading();
                    this.setData({ state: `修改智能锁音量成功`, voiceLevel: voiceLevel });
                } else {
                    wx.hideLoading();
                    this.setData({ state: `修改智能锁音量失败：${res.errorMsg}` });
                }
            })
        });
    }, 100)
})