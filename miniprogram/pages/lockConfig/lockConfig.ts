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
        this.setData({
            keyInfo: keyInfo,
            specialValueObj: specialValueObj
        });
    },

    // 设置远程开关
    toSetRemoteUnlock() {
        const lockData = this.data.keyInfo.lockData;
        const allowRemoteUnlock = this.data.specialValueObj.gatewayUnlock;
        wx.showLoading({ title: allowRemoteUnlock ? `正在关闭远程开关` : '正在开启远程开关' });
        this.setData({ state: allowRemoteUnlock ? `正在关闭远程开关` : '正在开启远程开关' });
        const start = Date.now();
        // 设置远程开关
        plugin.setRemoteUnlockSwitchState(allowRemoteUnlock ? false : true, lockData, res => {
            console.log("设置远程开关连接已断开", res)
        }, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                
                this.setData({
                    state: `远程开关设置成功, 操作时间：${Date.now() - start}ms.`,
                    'keyInfo.specialValue': res.specialValue,
                    specialValueObj: plugin.parseSpecialValues(res.specialValue)
                });
                API.updateLockData({
                    lockId: this.data.keyInfo.lockId,
                    lockData: res.lockData
                }).then(res1 => {
                    if (!!res1) {
                        wx.showToast({ icon: "success", title: "操作成功" });
                        this.setData({
                            state: `特征值已上传, 远程开关状态: ${plugin.parseSpecialValues(res.specialValue).gatewayUnlock ? '已关闭': '已开启'}`
                        });
                    } else {
                        wx.showToast({ icon: "error", title: "修改远程开关状态失败" });
                        this.setData({ state: `上传失败，远程开关状态已修改, 错误信息: ${res.errorMsg}` });
                    }
                })
            } else {
                wx.showToast({ icon: "error", title: "远程开关状态设置失败" });
                this.setData({ state: `远程开关状态设置失败, 错误信息: ${res.errorMsg}` });
            }
        })
    },

    // 获取远程开关状态
    toGetRemoteUnlock() {
        const lockData = this.data.keyInfo.lockData;
        const allowRemoteUnlock = this.data.specialValueObj.gatewayUnlock;
        wx.showLoading({ title: '正在获取远程开关状态' });
        this.setData({ state: '正在获取远程开关状态' });
        const start = Date.now();
        // 获取远程开关状态
        plugin.getRemoteUnlockSwitchState(lockData, res => {
            console.log("获取远程开关状态连接已断开", res)
        }, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                this.setData({
                    state: `远程开关获取成功，开启状态：${res.enabled ? '已开启' : '已关闭'}, 操作时间：${Date.now() - start}ms.`,
                    'keyInfo.specialValue': res.specialValue,
                    specialValueObj: plugin.parseSpecialValues(res.specialValue)
                })
                API.updateLockData({
                    lockId: this.data.keyInfo.lockId,
                    lockData: res.lockData
                }).then(res1 => {
                    if (!!res1) {
                        wx.showToast({ icon: "success", title: "操作成功" });
                        this.setData({
                            state: `特征值已上传, 远程开关状态: ${res.enabled ? '已关闭': '已开启'}`
                        });
                    } else {
                        wx.showToast({ icon: "error", title: "上传远程开关状态失败" });
                    }
                })
            } else {
                wx.showToast({ icon: "error", title: "获取远程开关状态失败" });
                this.setData({ state: `获取远程开关状态失败, 错误信息: ${res.errorMsg}` });
            }
        })
    },

    // 获取管理员密码
    toGetAdminPasscode() {
        const lockData = this.data.keyInfo.lockData;
        wx.showLoading({ title: "正在获取管理员密码" });
        this.setData({ state: `正在获取管理员密码` });
        const start = Date.now();
        plugin.getAdminPasscode(lockData, res => {
            console.log("获取管理员密码连接已断开", res)
        }, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                wx.showToast({ icon: "success", title: "操作成功" });
                this.setData({ state: `获取管理员密码成功, 密码: ${res.passcode}, 操作时间：${Date.now() - start}ms.` });
            } else {
                wx.showToast({ icon: "error", title: "获取管理员密码失败" });
                this.setData({ state: `获取管理员密码失败, 错误信息: ${res.errorMsg}` });
            }
        })
    },

    // 获取锁开关状态
    toGetLockStatus() {
        const lockData = this.data.keyInfo.lockData;
        wx.showLoading({ title: "正在获取智能锁开关状态" });
        this.setData({ state: `正在获取智能锁开关状态` });
        const start = Date.now();
        plugin.getLockStatus(lockData, res => {
            console.log("监控到设备连接已断开", res);
        }, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                let lockStr = "未知";
                if (res.lockStatus === 0) lockStr = "闭锁";
                else if (res.lockStatus === 1) lockStr = "开启";
                wx.showToast({ icon: "success", title: `状态: ${lockStr}` });
                this.setData({ state: `获取智能锁开关状态成功, 结果: ${lockStr}, 操作时间：${Date.now() - start}ms.` });
            } else {
                wx.showToast({ icon: "error", title: "获取智能锁开关状态失败" });
                this.setData({ state: `获取智能锁开关状态失败, 错误信息: ${res.errorMsg}` });
            }
        })
    },
})