import debounce from "debounce";
import * as LockAPI from "../../api/interfaces/lock";
import * as LockRecordAPI from "../../api/interfaces/lockRecord";
import * as HttpHandler from "../../api/handle/httpHandler";
import { CLIENT_ID } from "../../api/tools/config";
import * as Crypto from "../../utils/crypto";

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        specialValueObj: {}, // 智能锁特征值
    },
    // 设置初始化参数
    onLoad() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({ keyInfo: keyInfo });
        requirePlugin("myPlugin", ({ parseSpecialValues }: TTLockPlugin) => {
            const specialValueObj = parseSpecialValues(keyInfo.featureValue);
            this.setData({ specialValueObj: specialValueObj });
        })
        wx.setNavigationBarTitle({ title: keyInfo.lockAlias });
        
    },

    // 点击开锁
    toOpenDoor: debounce(function () {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "正在开锁" });
        this.setData({ state: `正在开锁` });
        requirePlugin("myPlugin", ({ controlLock }: TTLockPlugin) => {
            const start = Date.now();
            // 控制智能锁
            controlLock({
                /* 控制智能锁方式 3 -开锁, 6 -闭锁 */
                controlAction: 3,
                lockData: ekeyInfo.lockData,
                serverTime: Date.now(),
            }).then(res => {
                if (res.errorCode == 0) {
                    wx.showToast({ icon: "success", title: "已开锁" });
                    this.setData({ state: `已开锁, 正在读取操作记录, 开锁操作时间: ${Date.now() - start}ms.`});
                    
                    this.toReadRecord();
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg("开锁失败");
                    this.setData({state: `开锁失败: ${res.errorMsg}` });
                }
            })
        });
    }, 100),

    // 点击闭锁
    toCloseDoor: debounce(function () {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "正在闭锁" });
        this.setData({ state: `正在闭锁` });
        const start = Date.now();
        requirePlugin("myPlugin", ({ controlLock }: TTLockPlugin) => {
            // 调用闭锁接口
            controlLock({
                /* 控制智能锁方式 3 -开锁, 6 -闭锁 */
                controlAction: 6,
                lockData: ekeyInfo.lockData,
            }).then(res => {
                if (res.errorCode === 0) {
                    wx.showToast({ icon: "success", title: "已闭锁" });
                    this.setData({ state: `已闭锁, 正在读取操作记录, 操作时间: ${Date.now() - start}ms.` });
                    this.toReadRecord();
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg("闭锁失败");
                    this.setData({state: `闭锁失败: ${res.errorMsg}` });
                }
            });
        })
    }, 100),

    // 校准锁时间
    toCheckLockTime() {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "正在校准锁时间" });
        this.setData({ state: `正在校准锁时间` });
        const start = Date.now();
        requirePlugin("myPlugin", ({ setLockTime }: TTLockPlugin) => {
        // 建议使用服务器时间
            setLockTime({
                lockData: ekeyInfo.lockData,
                serverTime: Date.now(),
            }).then(res => {
                if (res.errorCode === 0) {
                    wx.showToast({ icon: "success", title: "锁时间已校准" });
                    this.setData({ state: `锁时间已校准, 操作时间: ${Date.now() - start}ms` });
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg("校准锁时间失败");
                    this.setData({state: `校准锁时间失败: ${res.errorMsg}` });
                }
            });
        });
    },

    // 读取操作记录
    toReadRecord: debounce(function () {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "正在读取操作记录" });
        const start = Date.now();
        requirePlugin("myPlugin", ({ getOperationLog }: TTLockPlugin) => {
            // 读取智能锁操作记录
            getOperationLog({
                /* 读取操作记录方式 1 -全部, 2 -最信 */
                logType: 2,
                lockData: ekeyInfo.lockData
            }).then(res => {
                if (res.errorCode === 0) {
                    const logList = res.log ? JSON.parse(res.log) : [];
                    this.setData({ state: `最新操作记录已获取, 共${logList.length}条, 操作时间: ${Date.now() - start}ms.` });
                    if (logList.length > 0) {
                        wx.showLoading({ title: "正在上传操作记录" });
                        LockRecordAPI.uploadOperation({
                            lockId: ekeyInfo.lockId,
                            records: res.log
                        }).then(res => {
                            if (HttpHandler.isResponseTrue(res)) {
                                wx.showToast({ icon: "success", title: "操作记录已上传" });
                            } else {
                                wx.hideLoading();
                                HttpHandler.handleResponseError(res);
                            }
                        }).catch(err => {
                            wx.hideLoading();
                            HttpHandler.handleServerError(err);
                        })
                    }
                    else wx.hideLoading();
                }
                else {
                    wx.hideLoading();
                    this.setData({ state: `读取操作记录失败: ${res.errorMsg}.` });
                }
            })
        })
    }, 100),

    // 点击重置蓝牙设备
    toResetLock() {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "正在重置智能锁" });
        this.setData({ state: `正在重置智能锁` });
        const start = Date.now();
        requirePlugin("myPlugin", ({ resetLock }: TTLockPlugin) => {
            /**
             * 调用重置接口 
             * 请传入钥匙lockData, 初始化返回的lockData不做任何限制，直接使用调用接口仅适用于本地测试
             */
            resetLock({ lockData: ekeyInfo.lockData }).then(res => {
                if (res.errorCode == 0) {
                    this.setData({ state: `智能锁已重置, 操作时间：${Date.now() - start}ms.` });
                    // 同步到服务器
                    wx.showLoading({ title: "正在同步服务器" });
                    LockAPI.Delete({
                        lockId: this.data.keyInfo.lockId
                    }).then(res => {
                        if (HttpHandler.isResponseTrue(res)) {
                            wx.hideLoading();
                            this.setData({ state: "智能锁已删除" });
                            HttpHandler.showErrorMsg("智能锁已删除");
                            setTimeout(wx.navigateBack, 2000);
                        } else {
                            wx.hideLoading();
                            HttpHandler.handleResponseError(res);
                            this.setData({ state: `同步服务器失败，智能锁已重置` });
                        }
                    }).catch(err => {
                        wx.hideLoading();
                        HttpHandler.handleServerError(err);
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg("重置智能锁失败");
                    this.setData({ state: `重置智能锁失败: ${res.errorMsg}` });
                }
            })
        });
    },

    // 点击升级智能锁
    toUpgradeLock() {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在升级智能锁` });
        requirePlugin("myPlugin", ({ enterDfuMode }: TTLockPlugin) => {
            /**
             * 调用重置接口 
             * 请传入钥匙lockData, 初始化返回的lockData不做任何限制，直接使用调用接口仅适用于本地测试
             */
            enterDfuMode({
                dfuPackageInfo: {
                    clientId: CLIENT_ID,
                    accessToken: Crypto.AES_Decrypt(wx.getStorageSync<string>("access_token")),
                    lockId: ekeyInfo.lockId,
                },
                lockData: ekeyInfo.lockData,
                callback: (result) => {
                    this.setData({ state: result.description });
                    switch (result.type) {
                    case 1: {
                        this.setData({ state: result.description });
                    }; break;
                    case 2:{
                        wx.showLoading({ title: `${result.progress}%` });
                        this.setData({ state: `${result.description}, 进度：${result.progress}%` });
                    }; break;
                    case 3: {
                        this.setData({ state: result.description });
                    }; break;
                    case 4: {
                        this.setData({ state: result.description });
                    }; break;
                    case 5: {
                        this.setData({ state: result.description });
                    }; break;
                    default: {
                        wx.hideLoading();
                        HttpHandler.showErrorMsg(result.errorMsg);
                    }; break;
                    }
                }
            }).then(res => {
                wx.hideLoading();
                if (res.errorCode == 0) {
                    this.setData({ state: `智能锁已升级` });
                } else {
                    HttpHandler.showErrorMsg("智能锁升级失败");
                    this.setData({ state: `智能锁升级失败: ${res.description || res.errorMsg}` });
                }
            })
        });
    },
})