import * as LockAPI from "../../api/interfaces/lock";
import * as HttpHandler from "../../api/handle/httpHandler";
const plugin = requirePlugin("myPlugin");
let deviceId: string = ""; // 当前智能锁ID

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        specialValueObj: {}, // 智能锁特征值
    },
    // 设置初始化参数
    onShow() {
        const keyInfo: IEKey.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({ keyInfo: keyInfo });
        requirePlugin("myPlugin", ({ parseSpecialValues }: TTLockPlugin) => {
            const specialValueObj = parseSpecialValues(keyInfo.featureValue);
            this.setData({ specialValueObj: specialValueObj });
        })
        wx.setNavigationBarTitle({ title: keyInfo.lockAlias });
    },

    // 设置远程开关
    toSetRemoteUnlock() {
        const ekeyInfo = this.data.keyInfo as IEKey.List.EKeyInfo;
        const specialValueObj = this.data.specialValueObj as TTLockFeatureValue;
        wx.showLoading({ title: "" });
        this.setData({ state: specialValueObj.gatewayUnlock ? `正在关闭远程开关` : '正在开启远程开关' });
        const start = Date.now();
        requirePlugin("myPlugin", ({ setRemoteUnlockSwitchState, parseSpecialValues }: TTLockPlugin) => {
            console.log(specialValueObj.gatewayUnlock ? false : true)
            // 设置远程开关
            setRemoteUnlockSwitchState({
                enable: specialValueObj.gatewayUnlock ? false : true,
                lockData: ekeyInfo.lockData
            }).then(result => {
                if (result.errorCode === 0) {
                    this.data.keyInfo.featureValue = result.featureValue;
                    wx.setStorageSync("keyInfo", JSON.stringify(this.data.keyInfo));
                    this.setData({
                        state: `远程开关设置成功, 操作时间：${Date.now() - start}ms.`,
                        'keyInfo.featureValue': result.featureValue,
                        specialValueObj: parseSpecialValues(result.featureValue)
                    });
                    LockAPI.updateLockData({
                        lockId: ekeyInfo.lockId,
                        lockData: result.lockData
                    }).then(res => {
                        if (HttpHandler.isResponseTrue(res)) {
                            wx.showToast({ icon: "success", title: "操作成功" });
                            this.setData({
                                state: `特征值已上传, 远程开关状态: ${result.enabled ? '已开启': '已关闭'}`
                            });
                        } else {
                            wx.hideLoading();
                            HttpHandler.handleResponseError(res);
                        }
                    }).catch(err => {
                        wx.hideLoading();
                        HttpHandler.showErrorMsg(err);
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg("远程开关状态设置失败");
                    this.setData({ state: `远程开关状态设置失败：${result.errorMsg}` });
                }
            })
        });
    },

    // 获取远程开关状态
    toGetRemoteUnlock() {
        const ekeyInfo = this.data.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: '正在查询远程开关状态' });
        const start = Date.now();
        requirePlugin("myPlugin", ({ getRemoteUnlockSwitchState, parseSpecialValues }: TTLockPlugin) => {
            // 获取远程开关状态
            getRemoteUnlockSwitchState({ lockData: ekeyInfo.lockData }).then(result => {
                if (result.errorCode === 0) {
                    this.data.keyInfo.featureValue = result.featureValue;
                    wx.setStorageSync("keyInfo", JSON.stringify(this.data.keyInfo));
                    this.setData({
                        state: `远程开关获取成功，开启状态：${result.enabled ? '已开启' : '已关闭'}, 操作时间：${Date.now() - start}ms.`,
                        'keyInfo.featureValue': result.featureValue,
                        specialValueObj: parseSpecialValues(result.featureValue)
                    })
                    LockAPI.updateLockData({
                        lockId: ekeyInfo.lockId,
                        lockData: result.lockData
                    }).then(res => {
                        if (HttpHandler.isResponseTrue(res)) {
                            wx.showToast({ icon: "success", title: "操作成功" });
                            this.setData({
                                state: `特征值已上传, 远程开关状态: ${result.enabled ? '已开启': '已关闭'}`
                            });
                        } else {
                            wx.hideLoading();
                            HttpHandler.handleResponseError(res);
                        }
                    }).catch(err => {
                        wx.hideLoading();
                        HttpHandler.handleServerError(err)
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg("远程开关状态查询失败");
                    this.setData({ state: `远程开关状态查询失败：${result.errorMsg}` });
                }
            })
        });
    },

    // 获取管理员密码
    toGetAdminPasscode() {
        const ekeyInfo = this.data.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: '正在查询管理员密码' });
        const start = Date.now();
        requirePlugin("myPlugin", ({ getAdminPasscode }: TTLockPlugin) => {
            getAdminPasscode({ lockData: ekeyInfo.lockData }).then(result => {
                if (result.errorCode === 0) {
                    this.setData({ state: `查询管理员密码成功, 密码: ${result.passcode}, 操作时间：${Date.now() - start}ms.` });
                    wx.showLoading({ title: "上传服务器中" });
                    LockAPI.changeAdminKeyboardPwd({
                        lockId: ekeyInfo.lockId, // 智能锁ID
                        password: result.passcode, // 管理员密码
                    }).then(res => {
                        if (HttpHandler.isResponseTrue(res)) {
                            this.data.keyInfo.noKeyPwd = result.passcode;
                            this.setData({ "keyInfo.noKeyPwd": result.passcode });
                            wx.setStorageSync("keyInfo", JSON.stringify(this.data.keyInfo));
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
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg("查询管理员密码失败");
                    this.setData({ state: `查询管理员密码失败：${result.errorMsg}` });
                }
            })
        });
    },

    // 获取锁开关状态
    toGetLockStatus() {
        const ekeyInfo = this.data.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: '正在查询智能锁开闭状态' });
        const start = Date.now();
        requirePlugin("myPlugin", ({ getLockStatus }: TTLockPlugin) => {
            getLockStatus({ lockData: ekeyInfo.lockData }).then(result => {
                if (result.errorCode === 0) {
                    let lockStr = "锁状态未知";
                    if (result.lockStatus === 0) lockStr = "已闭锁";
                    else if (result.lockStatus === 1) lockStr = "已开锁";
                    wx.showToast({ icon: "success", title: `状态: ${lockStr}` });
                    this.setData({ state: `查询智能锁开闭状态成功: ${lockStr}, 操作时间：${Date.now() - start}ms.` });
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg("查询智能锁开闭状态失败");
                    this.setData({ state: `查询智能锁开闭状态失败：${result.errorMsg}` });
                }
            })
        });
    },
})