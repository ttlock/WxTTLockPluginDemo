import * as HttpHandler from "../../../api/handle/httpHandler";

Page({
    data: {
        voiceArray: ["关闭", 1, 2, 3, 4, 5],
        voiceLevel: undefined,
        state: '',
        keyInfo: {}, // 钥匙数据
    },
    onLoad() {
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        this.setData({ keyInfo });
    },

    /* 查询智能锁音量等级设置 */
    async getVoiceStatus() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在查询智能锁音量等级` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /* 查询智能锁音量等级设置 */
            const result = await TTLockPlugin.getLockSoundWithSoundVolume({
                lockData: ekeyInfo?.lockData,
            });
            if (result?.errorCode != 0) throw(result);

            wx.hideLoading();
            this.setData({
                state: `查询智能锁音量等级设置成功`,
                voiceLevel: result?.soundVolume
            });
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("查询智能锁音量等级失败");
            this.setData({state: `查询智能锁音量等级失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    /* 设置智能锁音量等级 */
    async handleSubmit(event) {
        const voiceLevel = parseInt(event?.detail?.value?.voiceLevel) || 0;
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在设置智能锁音量等级` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /* 设置智能锁音量等级 */
            const result = await TTLockPlugin.setLockSoundWithSoundVolume({
                soundVolume: voiceLevel,
                lockData: ekeyInfo?.lockData,
            });
            if (result?.errorCode != 0) throw(result);

            wx.hideLoading();
            this.setData({
                state: `设置智能锁音量等级成功`,
                voiceLevel
            });
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("智能锁音量等级设置失败");
            this.setData({state: `智能锁音量等级设置失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },
})