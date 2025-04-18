// 添加智能锁
import * as LockAPI from "../../api/interfaces/lock";
import * as HttpHandler from "../../api/handle/httpHandler";

Page({
    data: {
        lockList: [], // 蓝牙扫描锁列表
        state: '', // 错误提示
        isInitLock: false, // 是否正在初始化智能锁
    },
    onHide() {
        this.stopScan();
    },
    onUnload() {
        this.stopScan();
    },

    // 开始扫描附近的智能锁设备
    async startScan() {
        let list = (this.data?.lockList || []);
        list.splice(0, list?.length);
        this.setData({ lockList: list, state: "启动蓝牙设备扫描" });
        const plugin = requirePlugin("myPlugin") as TTLockPlugin;
        const res = await plugin.startScanBleDevice((lockDevice, lockList) => {
            // TODO 成功扫描到设备
            const l = JSON.parse(JSON.stringify(lockList));
            if (!this?.data?.isInitLock) this.setData({ lockList: l, state: "蓝牙设备扫描中" });
        }, (err) => {
            // TODO 3.1.0 若未扫描到任意设备或附近设备权限未开启，将在此处【额外】增加一次回调
            this.setData({ state: `蓝牙扫描：${err?.errorMsg}` });
        });
        // 3.1.0 操作结果立即返回
        this.setData({ state: res?.errorCode == 0 ? "蓝牙扫描已启用" : `蓝牙扫描开启失败：${res?.errorMsg}` });
    },

    // 停止蓝牙扫描设备
    async stopScan() {
        this.setData({ state: "正在停止搜索蓝牙设备" });
        const plugin = requirePlugin("myPlugin") as TTLockPlugin;
        const res = await plugin.stopScanBleDevice();
        const list = (this.data?.lockList || []);
        list.splice(0, list?.length);
        this.setData({
            lockList: list,
            state: res?.errorCode == 0
                ? "蓝牙设备扫描已关闭"
                : `关闭蓝牙扫描失败：${res.errorMsg}`
        });
    },

    // 停止所有蓝牙操作，并退出操作中状态
    async handleStopAllOperations() {
        this.setData({ state: "正在停止全部蓝牙操作" });
        const plugin = requirePlugin("myPlugin") as TTLockPlugin;
        const res = await plugin.stopAllOperations();
        HttpHandler.showErrorMsg(res?.errorMsg);
        const list = (this.data?.lockList || []);
        list.splice(0, list?.length);
        this.setData({
            lockList: list,
            state: res?.errorCode == 0
                ? "蓝牙操作已关闭"
                : "停止蓝牙操作失败"
        });
    },

    // 初始化蓝牙设备
    init(event) {
        this.data.isInitLock = true;
        const lockItem = JSON.parse(JSON.stringify(event?.target?.dataset?.value || {}));
        this.handleInitLock(lockItem);
    },
    
    // 初始化智能锁
    async handleInitLock(deviceFromScan: TTLockFromScan) {
        this.data.isInitLock = deviceFromScan?.isSettingMode ? true : false;
        if (!deviceFromScan?.isSettingMode)
            return HttpHandler.showErrorMsg(`智能锁${deviceFromScan?.deviceName || deviceFromScan?.MAC}已被初始化，当前不可添加`);
        const list = (this.data?.lockList || []);
        list.splice(0, list?.length);
        this.setData({ isInitLock: true, lockList: list, state: `正在初始化蓝牙智能锁${deviceFromScan.deviceName}, MAC地址：${deviceFromScan.MAC}` });

        const plugin = requirePlugin("myPlugin") as TTLockPlugin;
        try {
            await plugin.stopScanBleDevice();
            // 3.1.0版本可直接调用初始化接口
            // await plugin.getLockVersion({ deviceFromScan });
            const result = await plugin.initLock({ deviceFromScan });
            if (result?.errorCode != 0) throw(result);
            this.setData({ state: "设备已成功初始化，正在调用开放平台接口上传锁数据" });
            LockAPI.initialize({ lockData: result?.lockData }).then(async res => {
                if (HttpHandler.isResponseTrue(res)) {
                    this.setData({ isInitLock: false });
                    HttpHandler.showErrorMsg("智能锁已添加");
                    await plugin.finishOperations();
                    setTimeout(wx.navigateBack, 2000);
                } else {
                    HttpHandler.handleResponseError(res);
                    this.setData({ state: "智能锁数据上传失败, 正在重置智能锁" });
                    this.handleResetLock(result.lockData);
                }
            }).catch(err => {
                HttpHandler.handleServerError(err);
                this.setData({ state: "智能锁数据上传失败, 正在重置智能锁" });
                this.handleResetLock(result.lockData);
            })
        } catch(err) {
            this.setData({ isInitLock: false, state: `初始化智能锁失败：${err?.errorMsg}` });
            // 3.1.0 及时关闭蓝牙占用
            const finalRes = await plugin.finishOperations();
            console.log(finalRes);
        }
    },

    // 重置智能锁
    async handleResetLock (lockData: string) {
        const plugin = requirePlugin("myPlugin") as TTLockPlugin;
        try {
            const res = await plugin.resetLock({ lockData });
            this.setData({
                isInitLock: false,
                state: res?.errorCode == 0
                    ? "初始化智能锁失败，智能锁已重置"
                    : `智能锁重置失败，请长按重置键进行设备重置：${res.errorMsg}`
            });
        } catch(err) {
            console.log(err);
        } finally {
            await plugin.finishOperations();
        }
    }
})