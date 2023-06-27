import API from "../../api/API";
const plugin = requirePlugin("myPlugin");
let deviceId: string = ""; // 当前智能锁ID

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        specialValueObj: {}, // 智能锁特征值
    },
    // 设置初始化参数
    onLoad() {
        deviceId = "";
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        const specialValueObj = plugin.parseSpecialValues(keyInfo.featureValue || keyInfo.specialValue);
        console.log(keyInfo, specialValueObj)
        this.setData({
            keyInfo: keyInfo,
            specialValueObj: specialValueObj
        });
    },

    // 点击开锁
    toOpenDoor() {
        const lockData = this.data.keyInfo.lockData;
        wx.showLoading({ title: "正在开锁" });
        this.setData({ state: `正在开锁` });
        const start = Date.now();
        // 调用开锁接口
        plugin.controlLock(plugin.ControlAction.OPEN, lockData, res => {
            console.log("控制智能锁时设备连接已断开", res);
        }, null, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                wx.showToast({ icon: "success", title: "开锁成功" });
                this.setData({ state: `已开锁, 正在读取操作记录, 开锁操作时间: ${Date.now() - start}ms.`});
                this.toReadRecord();
            } else {
                wx.showToast({ icon: "error", title: "开锁失败" });
                this.setData({state: `开锁失败, 错误信息: ${res.errorMsg}` });
            }
        })
    },

    // 点击闭锁
    toCloseDoor() {
        const lockData = this.data.keyInfo.lockData;
        wx.showLoading({ title: "正在闭锁" });
        this.setData({ state: `正在闭锁` });
        const start = Date.now();
        // 调用闭锁接口
        plugin.controlLock(plugin.ControlAction.CLOSE, lockData, res => {
            console.log("操作闭锁时设备连接已断开", res)
        }, null, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                wx.showToast({ icon: "success", title: "已闭锁" });
                this.setData({ state: `已闭锁, 操作时间: ${Date.now() - start}ms.` });
            } else {
                wx.showToast({ icon: "error", title: "闭锁失败" });
                this.setData({state: `闭锁失败, 错误信息: ${res.errorMsg}` });
            }
        });
    },

    // 校准锁时间
    toCheckLockTime() {
        const lockData = this.data.keyInfo.lockData;
        wx.showLoading({ title: "正在校准锁时间" });
        this.setData({ state: `正在校准锁时间` });
        const start = Date.now();
        // 建议使用服务器时间
        plugin.setLockTime(Date.now(), lockData, res => {
            console.log("校准锁时间时设备连接已断开", res)
        }, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                wx.showToast({ icon: "success", title: "锁时间已校准" });
                this.setData({ state: `锁时间已校准, 操作时间: ${Date.now() - start}ms` });
            } else {
                wx.showToast({ icon: "error", title: "校准锁时间失败" });
                this.setData({ state: `校准锁时间失败, 错误信息: ${res.errorMsg}` });
            }
        });
    },

    // 读取操作记录
    toReadRecord() {
        const lockData = this.data.keyInfo.lockData;
        wx.showLoading({ title: "正在读取锁内操作记录" });
        const start = Date.now();
        // 获取操作记录
        plugin.getOperationLog(plugin.RecordReadType.NEW, lockData, res => {
            console.log("上传操作记录连接已断开", res);
        }, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            const logList = res.log ? JSON.parse(res.log) : [];
            if (res.errorCode === 0) {
                this.setData({ state: `最新操作记录已获取, 共${logList.length}条, 操作时间: ${Date.now() - start}ms.` });
            } else {
                this.setData({ state: `读取操作记录失败, 共读取到${logList.length}条操作记录, 操作结果: ${res.errorMsg}.` });
            }

            if (logList.length > 0) {
                wx.showLoading({ title: "正在上传操作记录" });
                API.uploadOperation({
                    "lockId": this.data.keyInfo.lockId,
                    "records": res.log
                }).then(res => {
                    if (res) {
                        wx.showToast({ icon: "success", title: "操作记录已上传" });
                    } else {
                        wx.showToast({ icon: "error", title: "操作记录上传失败" });
                    }
                })
            } else {
                wx.showToast({ icon: "none", title: "未读取到操作记录" });
            }
        })
    },

    // 点击重置蓝牙设备
    toResetLock() {
        const lockData = this.data.keyInfo.lockData;
        wx.showLoading({ title: "正在重置智能锁" });
        this.setData({ state: `正在重置智能锁` });
        const start = Date.now();
        /**
         * 调用重置接口 
         * 请传入钥匙lockData, 初始化返回的lockData不做任何限制，直接使用调用接口仅适用于本地测试
         */
        plugin.resetLock(lockData, res => {
            console.log("重置智能锁连接已断开", res)
        }, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                this.setData({ state: `智能锁已重置，正在同步服务器, 操作时间：${Date.now() - start}ms.` });
                // 同步到服务器
                API.deleteLock({
                    lockId: this.data.keyInfo.lockId
                }).then(res => {
                    if (res) {
                        wx.showToast({
                            icon: "success",
                            title: '智能锁已删除',
                            mask: true,
                            complete: () => {
                                setTimeout(wx.navigateBack, 2000);
                            }
                        });
                    } else {
                        wx.showToast({ icon: "error", title: "同步服务器失败，智能锁已重置" });
                        this.setData({ state: `同步服务器失败，智能锁已重置` });
                    }
                })
            } else {
                wx.showToast({ icon: "error", title: "重置智能锁失败" });
                this.setData({ state: `重置智能锁失败, 错误信息: ${res.errorMsg}` });
            }
        })
    },

    // 进入开门方式页面
    toOpenMethods(event) {
        wx.navigateTo({
            url: "../openMethods/openMethods"
        })
    },

    // 进入设置智能锁页面
    toConfigLock(event) {
        wx.navigateTo({
            url: "../lockBase/lockBase"
        })
    }
})