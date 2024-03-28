// 添加智能锁
import debounce from "debounce";
import * as LockAPI from "../../api/interfaces/lock";
import { HttpHandler } from "../../api/handle/httpHandler";

Page({
    data: {
        lockList: new Array<TTLockFromScan>(), // 蓝牙扫描锁列表
        state: '', // 错误提示
        isInitLock: false, // 是否正在初始化智能锁
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        this.stopScan();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        this.stopScan();
    },

    // 开始扫描附近的智能锁设备
    startScan() {
        this.data.lockList.splice(0, this.data.lockList.length);
        this.setData({ lockList: this.data.lockList, state: "启动蓝牙设备扫描" });
        requirePlugin("myPlugin", ({ startScanBleDevice }: TTLockPlugin) => {
            // 开启蓝牙设备扫描
            startScanBleDevice((lockDevice, lockList) => {
                // TODO 成功扫描到设备
                if (!this.data.isInitLock)
                    this.setData({ lockList: lockList, state: "蓝牙设备扫描中" });
            }, (err) => {
                HttpHandler.showErrorMsg(err.errorMsg);
                this.data.lockList.splice(0, this.data.lockList.length);
                this.setData({ lockList: this.data.lockList, state: `蓝牙扫描开启失败：${err.errorMsg}`});
            });
        });
    },

    // 停止蓝牙扫描设备
    stopScan() {
        this.setData({ state: "正在停止搜索蓝牙设备" });
        requirePlugin("myPlugin", ({ stopScanBleDevice }: TTLockPlugin) => {
            // 关闭蓝牙设备扫描
            stopScanBleDevice().then(res => {
                // TODO 关闭蓝牙设备扫描返回
                this.data.lockList.splice(0, this.data.lockList.length);
                this.setData({
                    lockList: this.data.lockList,
                    state: res.errorCode == 0 ? "蓝牙设备扫描已关闭" : `关闭蓝牙扫描失败：${res.errorMsg}`
                });
            });
        });
    },

    // 停止所有蓝牙操作，并退出操作中状态
    handleStopAllOperations() {
        this.setData({ state: "正在停止全部蓝牙操作" });
        requirePlugin("myPlugin", ({ stopAllOperations }: TTLockPlugin) => {
            // 停止所有蓝牙操作
            stopAllOperations().then(res => {
                // TODO 停止蓝牙操作返回
                HttpHandler.showErrorMsg(res.errorMsg);
                this.data.lockList.splice(0, this.data.lockList.length);
                this.setData({
                    lockList: this.data.lockList,
                    state: res.errorCode == 0 ? "蓝牙操作已关闭" : `停止蓝牙操作失败：该接口无法打断正在连接的动作`
                });
            });
        });
    },

    // 初始化蓝牙设备
    init(event) {
        this.data.isInitLock = true;
        const index = event.currentTarget.dataset.index;
        const lockItem = this.data.lockList[index];
        this.handleInitLock(lockItem);
    },
    
    // 初始化智能锁
    handleInitLock: debounce(function (deviceFromScan: TTLockFromScan) {
        if (!deviceFromScan.isSettingMode) {
            this.data.isInitLock = false;
            return HttpHandler.showErrorMsg(`智能锁${deviceFromScan.deviceName || deviceFromScan.MAC}已被初始化，当前不可添加`);
        }
        this.data.lockList.splice(0, this.data.lockList.length);
        this.setData({ lockList: this.data.lockList, state: `正在初始化蓝牙智能锁${deviceFromScan.deviceName}, MAC地址：${deviceFromScan.MAC}` });
        requirePlugin("myPlugin", ({ getLockVersion, initLock }: TTLockPlugin) => {
            // 更新智能锁版本信息
            getLockVersion({ deviceFromScan }).then(res => {
                if (res.errorCode == 0) {
                    // TODO 更新版本信息成功
                    this.setData({ state: "智能锁版本信息已更新，正在初始化设备" });
                    // 调用添加锁接口, serverTime传入服务器时间
                    initLock({ deviceFromScan }).then(result => {
                        if (result.errorCode == 0) {
                            // 设备已成功初始化，请调用开放平台接口上传lockData
                            this.setData({ state: "设备已成功初始化，正在调用开放平台接口上传锁数据" });
                            LockAPI.initialize({ lockData: result.lockData }).then(res => {
                                if (HttpHandler.isResponseTrue(res)) {
                                    this.setData({ isInitLock: false });
                                    HttpHandler.showErrorMsg("智能锁已添加");
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
                        }
                        else this.setData({ isInitLock: false, state: `初始化智能锁失败：${result.errorMsg}` });
                    })
                }
                else this.setData({ isInitLock: false, state: `更新智能锁版本信息失败：${res.errorMsg}` });
            });
        });
    }, 100),

    // 重置智能锁
    handleResetLock: debounce(function (lockData: string) {
        requirePlugin("myPlugin", ({ resetLock }: TTLockPlugin) => {
            // 重置智能锁
            resetLock({ lockData }).then(res => {
                if (res.errorCode == 0) this.setData({ isInitLock: false, state: "初始化智能锁失败，智能锁已重置" });
                else this.setData({ isInitLock: false, state: `智能锁重置失败，请长按重置键进行设备重置：${res.errorMsg}` });
            });
        });
    }, 100),
})