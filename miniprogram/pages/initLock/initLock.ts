// 添加智能锁
import API from "../../api/API";
const plugin = requirePlugin("myPlugin");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        lockList: [], // 蓝牙扫描锁列表
        state: '' // 错误提示
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        this.handleStopAllOperations();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        this.handleStopAllOperations();
    },

    // 开始扫描附近的智能锁设备
    startScan() {
        this.setData({
            lockList: [],
            state: "正在搜索蓝牙设备"
        });
        plugin.startScanBleDevice((lockDevice, lockList) => {
            this.setData({
                lockList: lockList
            });
        }, err => {
            console.log(err)
            wx.showToast({
                icon: "none",
                title: err.errorMsg,
            });
            this.setData({
                lockList: [],
                state: err.errorMsg
            });
        });
    },

    // 停止蓝牙扫描设备
    stopScan() {
        this.setData({
            state: "正在停止搜索蓝牙设备"
        });
        plugin.stopScanBleDevice().then(res => {
            console.log(res)
            this.setData({
                lockList: [],
                state: res.errorCode === 0 ? "蓝牙设备已停止扫描" : res.errorMsg,
            });
        });
    },

    // 停止所有蓝牙操作，并退出操作中状态
    handleStopAllOperations() {
        this.setData({ state: "正在停止全部蓝牙操作" });
        plugin.stopAllOperations().then(res => {
            console.log(res);
            this.setData({
                lockList: [],
                state: res.errorMsg
            });
        })
    },

    // 初始化蓝牙设备
    init(event) {
        // 2.8.6以上
        // const lockItem = event.target.dataset.value;
        // 2.8.5及其以下
        const index = event.currentTarget.dataset.index;
        const lockItem = this.data.lockList[index];
        this.handleInitLock(lockItem);
    },
    
    // 初始化智能锁
    handleInitLock(deviceFromScan) {
        if (!deviceFromScan.isSettingMode) {
            return wx.showToast({
                icon: "none",
                title: '智能锁不可添加',
            });
        }
        this.setData({
            lockList: [],
            state: `正在初始化蓝牙智能锁${deviceFromScan.deviceName}, MAC地址：${deviceFromScan.MAC}`
        }, () => {
            plugin.getLockVersion(deviceFromScan, res => {
                console.log("获取版本信息时设备连接已断开", res);
            }).then(res => {
                if (res.errorCode === 0) {
                    console.log(res)
                    // 调用添加锁接口
                    plugin.initLock(deviceFromScan, res => {
                        console.log("初始化设备时连接断开", res);
                    }).then(res => {
                        console.log(res)
                        if (res.errorCode === 0) {
                            // 设备已成功初始化，请调用开放平台接口上传lockData
                            this.setData({ state: "设备已成功初始化，正在调用开放平台接口上传lockData" });
                            API.initialize({
                                lockData: res.lockData
                            }).then(res => {
                                if (res) {
                                    wx.showToast({
                                        icon: "success",
                                        title: '智能锁已添加',
                                        mask: true,
                                        complete: () => {
                                            setTimeout(wx.navigateBack, 2000);
                                        }
                                    })
                                } else {
                                    this.setData({ state: "智能锁数据上传失败" });
                                }
                            })
                        } else {
                            this.setData({ state: `初始化智能锁失败, 错误信息：${res.errorMsg}` })
                        }
                    })
                } else {
                    this.setData({ state: `初始化智能锁失败, 错误信息：${res.errorMsg}` });
                }
            });
        });
    },
})