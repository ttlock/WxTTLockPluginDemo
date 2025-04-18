// 智能锁开关设置
import * as LockAPI from "../../../api/interfaces/lock";
import * as HttpHandler from "../../../api/handle/httpHandler";

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        tamperAlert: undefined,
        resetButton: undefined,
        privacyLock: undefined,
        unlockDirection: undefined,
        pasageModeAutoUnlockSetting: undefined,
        wifiPowerSavingMode: undefined,
    },
    onLoad() {
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        this.setData({ keyInfo });
    },

    /* 查询智能锁开关设置状态 */
    async getLockStatus() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在查询智能锁设置项` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /* 查询智能锁开关设置状态 */
            const result = await TTLockPlugin.getLockConfig({
                configType: 1 | 2 | 4 | 16 | 32 | 128, // 3.1.0版本支持wifi省电开关设置，旧版本不支持，若设置失败请优先检查插件版本是否正确
                lockData: ekeyInfo?.lockData,
            });
            if (result?.errorCode != 0) throw(result);

            wx.hideLoading();
            this.setData({
                state: `查询智能锁设置项成功`,
                tamperAlert: result?.lockConfigs?.tamperAlert,
                resetButton: result?.lockConfigs?.resetButton,
                privacyLock: result?.lockConfigs?.privacyLock,
                unlockDirection: result?.lockConfigs?.unlockDirection,
                pasageModeAutoUnlockSetting: result?.lockConfigs?.pasageModeAutoUnlockSetting,
                wifiPowerSavingMode: result?.lockConfigs?.wifiPowerSavingMode
            });
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("查询智能锁设置项失败");
            this.setData({state: `查询智能锁设置项失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },


    /* 修改智能锁设置项 */
    async handleChange(event) {
        const switchOn = Boolean(event?.detail?.value);
        const configType = Number(event?.target?.dataset?.type);
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在修改智能锁设置项` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /* 修改智能锁开关设置状态 */
            const result = await TTLockPlugin.setLockConfig({
                configType, // 3.1.0版本支持wifi省电开关设置，旧版本不支持，若设置失败请优先检查插件版本是否正确
                switchOn,
                lockData: ekeyInfo?.lockData,
            });
            if (result?.errorCode != 0) throw(result);

            this.setData({ state: `修改智能锁设置项成功` });
            let type = 0;
            switch(configType) {
            case 1: type = 3; break;
            case 2: type = 4; break;
            case 4: type = 2; break;
            case 16: type = 7; break;
            case 128: type = 10; break;
            default: wx.hideLoading(); return;
            };
            LockAPI.updateSetting({
                lockId: ekeyInfo?.lockId, // 智能锁ID
                type, // 要修改的项
                value: switchOn ? 1 : 2, // 设置值: 1-开启、2-关闭;
                changeType: 1, // 修改方式
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
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("修改智能锁开关设置状态失败");
            this.setData({state: `修改智能锁开关设置状态失败: ${err?.errorMsg}` });
            switch(configType) {
            case 1: this.setData({ tamperAlert: !switchOn }); break;
            case 2: this.setData({ resetButton: !switchOn }); break;
            case 4: this.setData({ privacyLock: !switchOn }); break;
            case 16: this.setData({ unlockDirection: !switchOn }); break;
            case 32: this.setData({ pasageModeAutoUnlockSetting: !switchOn }); break;
            case 128: this.setData({ wifiPowerSavingMode: !switchOn }); break;
            };
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },
})