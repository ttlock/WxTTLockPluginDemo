// miniprogram/pages/list/list.js
import API from "../../api/API";
const plugin = requirePlugin("myPlugin");
console.log(plugin)

Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        keyList: [],
        wifiList: [], // wifi列表
        currentGateway: {}, // 当前网关参数
        currentWifi: {}, // 当前使用的wifi
        showInput: false, // 是否展示wifi密码输入框
        pwd: "", // wifi密码

        lockList: [], // 蓝牙扫描锁列表
        state: '' // 错误提示
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow(options) {
        plugin.setShowLog(true); // 开启错误日志
        this.modifyKeyList();
    },

    // 更新智能锁列表
    modifyKeyList() {
        API.keyList().then(res => {
            if (!!res) {
                console.log(res);
                this.setData({
                    keyList: res.list
                })
            }
        })
    },

    // 开始扫描附近的智能锁设备
    startScan() {
        this.setData({
            lockList: [],
            wifiList: [],
            state: "正在搜索蓝牙设备"
        })
        plugin.startScanBleDevice((lockDevice, lockList) => {
            if (!!lockDevice && lockDevice.isTouch) {
                console.log(lockDevice, lockList)
            }
            this.setData({
                lockList: lockList
            })
        }, err => {
            console.log(err)
            this.setData({
                lockList: [],
                state: err.errorMsg
            })
        })
    },

    // 停止蓝牙扫描设备
    stopScan() {
        plugin.stopScanBleDevice().then(res => {
            console.log(res)
            this.setData({
                lockList: [],
                state: res.errorCode === 0 ? "蓝牙设备已停止扫描" : res.errorMsg,
                wifiList: [],
            })
        })
    },

    // 开始扫描附近的网关设备
    startScanGateway() {
        this.setData({
            lockList: [],
            wifiList: [],
            state: "正在搜索蓝牙网关设备"
        })
        plugin.startScanGateway((deviceItem, deviceList) => {
            console.log(deviceItem, deviceList)
            this.setData({
                lockList: deviceList
            })
        }, err => {
          console.log(err)
          this.setData({
            lockList: [],
            state: err.errorMsg
          })
        })
    },

    // 停止蓝牙扫描网关设备
    stopScanGateway() {
        plugin.stopScanGateway().then(res => {
            console.log(res)
            this.setData({
                lockList: [],
                state: res.errorCode === 0 ? "蓝牙设备已停止扫描" : res.errorMsg,
                wifiList: [],
            })
        });
    },

    // 停止所有蓝牙操作，并退出操作中状态
    stopAll() {
        plugin.stopAllOperations().then(res => {
            console.log(res);
            this.setData({
                lockList: [],
                state: res.errorMsg,
                wifiList: [],
                showInput: false
            })
        })
    },

    // 初始化蓝牙设备
    init (event) {
        const index = event.currentTarget.dataset.index;
        const lockItem = this.data.lockList[index];
        if (lockItem.isGateway) {
            this.addGateway(lockItem, index);
        } else {
            this.initLock(lockItem);
        }
    },
    
    // 初始化智能锁
    initLock (deviceFromScan) {
        if (!deviceFromScan.isSettingMode) {
            wx.showToast({
                icon: "none",
                title: '智能锁不可添加',
            })
            return;
        }
        this.setData({
            wifiList: [],
            lockList: [],
            state: `正在初始化蓝牙智能锁${deviceFromScan.lockMac}`
        })
        plugin.getLockVersion(deviceFromScan, res => {
            if (res.errorCode === 10003) {
                console.log("获取版本信息时设备连接已断开", res)
            }
        }).then(res => {
            if (res.errorCode === 0) {
                console.log(res)
                // 调用添加锁接口
                plugin.initLock(deviceFromScan, res => {
                    if (res.errorCode === 10003) {
                        console.log("初始化设备时连接断开", res)
                    }
                }).then(res => {
                    console.log(res)
                    if (res.errorCode === 0) {
                        // 设备已成功初始化，请调用开放平台接口上传lockData
                        this.setData({
                            state: "设备已成功初始化，正在调用开放平台接口上传lockData"
                        })
                        API.initialize({
                            lockData: res.lockData
                        }).then(res => {
                            if (!!res) {
                                this.modifyKeyList();
                                this.setData({
                                    state: "设备已添加"
                                })
                            } else {
                                this.setData({
                                    state: "智能锁数据上传失败"
                                })
                            }
                        })
                    } else {
                        this.setData({
                            state: `初始化智能锁失败，${res.errorMsg}`
                        })
                    }
                })
            } else {
                this.setData({
                    state: `初始化智能锁失败，${res.errorMsg}`
                })
            }
        })
    },

    // 初始化蓝牙网关
    addGateway(deviceFromScan, index) {
        if (!deviceFromScan.isSettingMode) {
            wx.showToast({
                icon: "none",
                title: '网关不可添加',
            })
            return;
        }
        this.setData({
            wifiList: [],
            lockList: [],
            state: `正在连接蓝牙网关${deviceFromScan.MAC}`,
            currentGateway: deviceFromScan
        })
        // 调用添加锁网关
        plugin.connectGateway(deviceFromScan, err => {
            console.log("检测到设备断开连接(连接设备）", err)
            this.setData({
                wifiList: [],
                lockList: [],
                state: `设备已断开连接`
            })
        }).then(res => {
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    lockList: [],
                    state: `设备已连接，正在搜索WIFI列表`
                })
                plugin.scanWiFiByGateway(deviceFromScan, err => {
                    console.log("检测到设备断开连接（扫描WIFI)", err)
                    this.setData({
                        wifiList: [],
                        lockList: [],
                        state: `设备已断开连接`
                    })
                }).then(res => {
                    console.log("扫描完成", res)
                    if (res.errorCode === 0) {
                        this.setData({
                            state: `搜索WIFI列表成功`,
                            wifiList: res.data.wifiList
                        })
                    } else {
                        this.setData({
                            state: `搜索wifi列表失败${res.errorMsg}`,
                            wifiList: []
                        })
                    }
                })
            } else {
                this.setData({
                    lockList: [],
                    state: `网关连接失败, ${res.errorMsg}`
                })
            }
        })
    },

    ///////// 添加网关参数
    toAddPsd(event) {
        console.log(event, this.data.currentGateway);
        const index = event.currentTarget.dataset.index;
        const wifiItem = this.data.wifiList[index];
        this.setData({
            lockList: [],
            state: `请输入wifi密码--SSID:${wifiItem.SSID}`,
            wifiList: [],
            currentWifi: JSON.parse(JSON.stringify(wifiItem)),
            showInput: true,
            pwd: "",
        })
    },


    /////// 初始化网关
    initGateway(event) {
        console.log(this.data.pwd, this.data.currentGateway, this.data.currentWifi);
        const pwd = String(this.data.pwd);
        this.setData({
            state: `正在初始化网关--SSID:${this.data.currentWifi.SSID}--密码：${this.data.pwd}--`,
            showInput: false,
            pwd: "",
        })
        plugin.initGateway(this.data.currentGateway, {
            SSID: this.data.currentWifi.SSID,
            wifiPwd: pwd,
            uid: wx.getStorageSync("uid"),
            password: wx.getStorageSync("psd"),
            companyId: 0,
            branchId: 0,
            plugName: this.data.currentGateway.deviceName,
            server: "plug.sciener.cn",
            port: 2999,
            useLocalIPAddress: false,
            // useDHCP: false,
            // ipAddress: "121.196.45.100",
            // subnetMask: "255.255.255.0",
            // router: "192.168.10.254",
            // dns1: "114.114.114.114",
            // dns2: "0.0.0.0",
        }, err => {
            console.log("检测到设备断开连接（扫描WIFI)", err)
            this.setData({
                wifiList: [],
                lockList: [],
                state: `设备已断开连接`
            })
        }).then(initRes => {
            console.log("初始化", initRes)
            if (initRes.errorCode === 0) {
                this.setData({
                    state: `网关初始化成功, 正在上传初始化数据`
                });
                API.isInitSuccess({
                    gatewayNetMac: this.data.currentGateway.MAC
                }).then(checkRes => {
                    if (!!checkRes) {
                        console.log(checkRes)
                        API.uploadDetail({
                            gatewayId: checkRes.gatewayId,
                            modelNum: initRes.data.modelNum,
                            hardwareRevision: initRes.data.hardware,
                            firmwareRevision: initRes.data.firmware,
                            networkName: this.data.currentWifi.SSID
                        }).then(res => {
                            if (!!res) {
                                console.log(res)
                                this.setData({
                                    state: "网关已添加"
                                })
                            } else {
                                this.setData({
                                    state: "网关数据上传失败"
                                })
                            }
                        })
                    } else {
                        this.setData({
                            state: "网关数据上传失败"
                        })
                    }
                })
            } else {
                this.setData({
                    state: `网关初始化失败${initRes.errorMsg}`
                })
            }
        })
    },

    // 进入锁详情页
    toDetail(event) {
        const index = event.currentTarget.dataset.index;
        const lockItem = this.data.keyList[index];
        wx.setStorageSync('keyInfo', JSON.stringify(lockItem));
        wx.navigateTo({
            url: '../index/index'
        })
    }
})