import * as LockAPI from "../../api/interfaces/lock";
import * as HttpHandler from "../../api/handle/httpHandler";

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        specialValueObj: {}, // 智能锁特征值
    },
    onLoad() {
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        const specialValueObj = TTLockPlugin.parseSpecialValues(keyInfo?.featureValue);
        this.setData({ keyInfo, specialValueObj });
        wx.setNavigationBarTitle({ title: keyInfo.lockAlias });
    },

    // 设置远程开关
    async toSetRemoteUnlock() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        const specialValueObj = this.data.specialValueObj as TTLockFeatureValue;
        wx.showLoading({ title: "" });
        this.setData({ state: specialValueObj?.gatewayUnlock ? `正在关闭远程开关` : '正在开启远程开关' });
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;
        const start = Date.now();

        try {
            /* 设置远程开关状态 */
            const result = await TTLockPlugin.setRemoteUnlockSwitchState({
                enable: specialValueObj?.gatewayUnlock ? false : true,
                lockData: ekeyInfo?.lockData,
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);

            ekeyInfo.featureValue = result?.featureValue;
            wx.setStorageSync("keyInfo", JSON.stringify(ekeyInfo));
            const featureValue = TTLockPlugin.parseSpecialValues(result?.featureValue);
            this.setData({
                state: `远程开关设置成功, 操作时间：${end - start}ms.`,
                'keyInfo.featureValue': result?.featureValue,
                specialValueObj: featureValue
            });
            LockAPI.updateLockData({
                lockId: ekeyInfo?.lockId,
                lockData: result?.lockData
            }).then(res => {
                if (HttpHandler.isResponseTrue(res)) {
                    wx.showToast({ icon: "success", title: "操作成功" });
                    this.setData({
                        state: `特征值已上传, 远程开关状态: ${featureValue?.gatewayUnlock ? '已开启': '已关闭'}`
                    });
                } else {
                    wx.hideLoading();
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                wx.hideLoading();
                HttpHandler.showErrorMsg(err);
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("远程开关状态设置失败");
            this.setData({state: `远程开关状态设置失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    // 获取远程开关状态
    async toGetRemoteUnlock() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: '正在查询远程开关状态' });
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;
        const start = Date.now();

        try {
            /* 获取远程开关状态 */
            const result = await TTLockPlugin.getRemoteUnlockSwitchState({
                lockData: ekeyInfo?.lockData,
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);

            ekeyInfo.featureValue = result?.featureValue;
            wx.setStorageSync("keyInfo", JSON.stringify(ekeyInfo));
            const featureValue = TTLockPlugin.parseSpecialValues(result?.featureValue);
            this.setData({
                state: `远程开关获取成功，开启状态：${featureValue?.gatewayUnlock ? '已开启' : '已关闭'}, 操作时间：${end - start}ms.`,
                'keyInfo.featureValue': result?.featureValue,
                specialValueObj: TTLockPlugin.parseSpecialValues(result.featureValue)
            })
            wx.hideLoading();
            console.log(TTLockPlugin.parseSpecialValues(result?.featureValue)?.gatewayUnlock, result?.featureValue)
            LockAPI.updateLockData({
                lockId: ekeyInfo?.lockId,
                lockData: result?.lockData
            }).then(res => {
                if (HttpHandler.isResponseTrue(res)) {
                    wx.showToast({ icon: "success", title: "操作成功" });
                    this.setData({
                        state: `特征值已上传, 远程开关状态: ${featureValue?.gatewayUnlock ? '已开启': '已关闭'}`
                    });
                } else {
                    wx.hideLoading();
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                wx.hideLoading();
                HttpHandler.handleServerError(err)
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("远程开关状态查询失败");
            this.setData({state: `远程开关状态查询失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    // 获取管理员密码
    async toGetAdminPasscode() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: '正在查询管理员密码' });
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;
        const start = Date.now();

        try {
            /* 查询管理员密码 */
            const result = await TTLockPlugin.getAdminPasscode({
                lockData: ekeyInfo?.lockData,
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);
            this.setData({ state: `查询管理员密码成功, 密码: ${result?.passcode}, 操作时间：${end - start}ms.` });
            wx.showLoading({ title: "上传服务器中" });
            LockAPI.changeAdminKeyboardPwd({
                lockId: ekeyInfo?.lockId, // 智能锁ID
                password: result?.passcode, // 管理员密码
            }).then(res => {
                if (HttpHandler.isResponseTrue(res)) {
                    ekeyInfo.noKeyPwd = result?.passcode;
                    this.setData({ "keyInfo.noKeyPwd": result?.passcode });
                    wx.setStorageSync("keyInfo", JSON.stringify(ekeyInfo));
                    wx.hideLoading();
                    HttpHandler.showErrorMsg("服务器上传成功");
                } else {
                    HttpHandler.handleResponseError(res);
                    wx.hideLoading();
                }
            }).catch(err => {
                HttpHandler.handleServerError(err);
                wx.hideLoading();
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("查询管理员密码失败");
            this.setData({state: `查询管理员密码失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    // 获取锁开关状态
    async toGetLockStatus() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: '正在查询智能锁开闭状态' });
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;
        const start = Date.now();

        try {
            /* 查询智能锁开闭状态 */
            const result = await TTLockPlugin.getLockStatus({
                lockData: ekeyInfo?.lockData,
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);
            let lockStr = "锁状态未知";
            if (result.lockStatus === 0) lockStr = "已闭锁";
            else if (result.lockStatus === 1) lockStr = "已开锁";
            wx.showToast({ icon: "success", title: `状态: ${lockStr}` });
            this.setData({ state: `查询智能锁开闭状态成功: ${lockStr}, 操作时间：${end - start}ms.` });
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("查询智能锁开闭状态失败");
            this.setData({state: `查询智能锁开闭状态失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },
})