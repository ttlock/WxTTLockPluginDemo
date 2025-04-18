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
    onLoad() {
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        const specialValueObj = TTLockPlugin.parseSpecialValues(keyInfo?.featureValue);
        this.setData({ keyInfo, specialValueObj });
        wx.setNavigationBarTitle({ title: keyInfo.lockAlias });
    },

    // 点击开锁
    async toOpenDoor() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "正在开锁" });
        this.setData({ state: `正在开锁` });
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;
        const start = Date.now();
        try {
            /* 控制智能锁(接口内自动校准锁时间) */
            const result = await TTLockPlugin.controlLock({
                controlAction: 3, // 3 -开锁, 6 -闭锁
                lockData: ekeyInfo?.lockData,
                serverTime: Date.now(), // 生产环境中请从服务器获取
                disconnectCallback: (r) => {
                    // TODO 设备断连操作
                    console.log("设备断连", r);
                }
            });
            const end = Date.now();
            if (result?.errorCode != 0) {
                wx.hideLoading();
                HttpHandler.showErrorMsg("开锁失败");
                this.setData({state: `开锁失败: ${result?.errorMsg}, 操作时间: ${end - start}ms.` });
                return;
            }
            wx.showToast({ icon: "success", title: "已开锁" });
            this.setData({ state: `已开锁, 正在读取操作记录, 开锁操作时间: ${end - start}ms.`});
            /* 读取操作记录方式 */
            const recordRes = await TTLockPlugin.getOperationLog({
                logType: 2, // 1 -全部, 2 -最新
                lockData: ekeyInfo?.lockData,
            })
            if (recordRes?.errorCode != 0) {
                wx.hideLoading();
                this.setData({ state: `读取操作记录失败: ${recordRes?.errorMsg}, 开锁操作时间: ${end - start}ms.` });
                return;
            }
            const logList = recordRes?.log ? JSON.parse(recordRes?.log || "[]") : [];
            this.setData({ state: `最新操作记录已获取, 共${logList?.length}条, 开锁操作时间: ${end - start}ms.` });
            if (!(logList?.length > 0)) return wx.hideLoading();

            wx.showLoading({ title: "正在上传操作记录" });
            LockRecordAPI.uploadOperation({
                lockId: ekeyInfo.lockId,
                records: recordRes?.log
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
        } catch(err) {
            console.log(err);
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    // 点击闭锁
    async toCloseDoor() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "正在闭锁" });
        this.setData({ state: `正在闭锁` });
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;
        const start = Date.now();

        try {
            /* 控制智能锁(接口内自动校准锁时间) */
            const result = await TTLockPlugin.controlLock({
                controlAction: 6, // 3 -开锁, 6 -闭锁
                lockData: ekeyInfo?.lockData,
                serverTime: Date.now(), // 生产环境中请从服务器获取
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);
            wx.showToast({ icon: "success", title: "已闭锁" });
            this.setData({ state: `已闭锁, 操作时间: ${end - start}ms.`});
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("闭锁失败");
            this.setData({state: `闭锁失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    // 校准锁时间
    async toCheckLockTime() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "正在校准锁时间" });
        this.setData({ state: `正在校准锁时间` });
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;
        const start = Date.now();

        try {
            /* 校准锁时间 */
            const result = await TTLockPlugin.setLockTime({
                lockData: ekeyInfo?.lockData,
                serverTime: Date.now(), // 生产环境中请从服务器获取
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);
            wx.showToast({ icon: "success", title: "锁时间已校准" });
            this.setData({ state: `锁时间已校准, 操作时间: ${end - start}ms.`});
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("校准锁时间失败");
            this.setData({state: `校准锁时间失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    // 读取操作记录
    async toReadRecord() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "正在读取操作记录" });
        this.setData({ state: `正在读取操作记录` });
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;
        const start = Date.now();

        try {
            /* 读取智能锁操作记录 */
            const result = await TTLockPlugin.getOperationLog({
                logType: 2, // 1 -全部, 2 -最新
                lockData: ekeyInfo?.lockData
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);

            const logList = result?.log ? JSON.parse(result?.log || "[]") : [];
            this.setData({ state: `最新操作记录已获取, 共${logList?.length}条, 操作时间: ${end - start}ms.` });
            if (!(logList?.length > 0)) return wx.hideLoading();

            wx.showLoading({ title: "正在上传操作记录" });
            LockRecordAPI.uploadOperation({
                lockId: ekeyInfo.lockId,
                records: result?.log
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
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("读取操作记录失败");
            this.setData({state: `读取操作记录失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    // 点击重置蓝牙设备
    async toResetLock() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "正在重置智能锁" });
        this.setData({ state: `正在重置智能锁` });
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;
        const start = Date.now();

        try {
            /* 重置智能锁 */
            const result = await TTLockPlugin.resetLock({
                lockData: ekeyInfo?.lockData
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);

            this.setData({ state: `智能锁已重置, 正在同步服务器, 操作时间：${end - start}ms.` });
            wx.showLoading({ title: "正在同步服务器" });
            LockAPI.Delete({
                lockId: ekeyInfo?.lockId
            }).then(res => {
                if (HttpHandler.isResponseTrue(res)) {
                    wx.hideLoading();
                    this.setData({ state: "智能锁已删除" });
                    HttpHandler.showErrorMsg("智能锁已删除");
                    setTimeout(wx.navigateBack, 2000);
                } else {
                    wx.hideLoading();
                    HttpHandler.handleResponseError(res);
                    this.setData({ state: `同步服务器失败，智能锁已重置, 操作时间：${end - start}ms.` });
                }
            }).catch(err => {
                wx.hideLoading();
                HttpHandler.handleServerError(err);
                this.setData({ state: `同步服务器失败，智能锁已重置, 操作时间：${end - start}ms.` });
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("重置智能锁失败");
            this.setData({state: `重置智能锁失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    // 点击升级智能锁
    async toUpgradeLock() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "正在升级智能锁" });
        this.setData({ state: `正在升级智能锁` });
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;
        const start = Date.now();

        try {
            /**
             * 调用重置接口 
             * 请传入钥匙lockData, 初始化返回的lockData不做任何限制，直接使用调用接口仅适用于本地测试
             */
            const result = await TTLockPlugin.enterDfuMode({
                dfuPackageInfo: {
                    clientId: CLIENT_ID,
                    accessToken: Crypto.AES_Decrypt(wx.getStorageSync<string>("access_token")),
                    lockId: ekeyInfo.lockId,
                },
                lockData: ekeyInfo.lockData,
                callback: (result) => {
                    // PS: 智能锁蓝牙升级操作成功后中可能触发一次断开连接
                    this.setData({ state: result?.description });
                    switch (result?.type) {
                    case 1:
                    case 3:
                    case 4: 
                    case 5: {
                        this.setData({ state: result?.description });
                    }; break;
                    case 2:{
                        wx.showLoading({ title: `${result?.progress}%` });
                        this.setData({ state: `${result?.description}, 进度：${result?.progress}%` });
                    }; break;
                    }
                }
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);
            wx.hideLoading();
            this.setData({ state: `智能锁已升级, 操作时间：${end - start}ms.` });
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("智能锁升级失败");
            this.setData({state: `智能锁升级失败: ${err?.description || err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },
})