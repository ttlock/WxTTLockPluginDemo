// 添加智能网关
import API from "../../api/API";
import { AES_Decrypt, MD5_Encrypt } from "../../utils/crypto";
const plugin = requirePlugin("myPlugin");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        plugList: [], // 蓝牙扫描网关列表
        wifiList: [], // 搜索到的网关列表
        state: '', // 错误提示
        currentPlug: null, // 当前操作的网关
        currentWifi: null, // 当前操作的WIFI信息
        password: "", // WIFI密码
        showInput: false, // 是否显示密码表单
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
    handleInputEmpty() {}, // 解决绑定数据输入报错

    handleResetData(errorMsg: string) {
        this.setData({
            wifiList: [],
            plugList: [],
            currentPlug: null,
            currentWifi: null,
            password: "",
            showInput: false,
            state: errorMsg
        });
    },

    // 开始扫描附近的网关设备
    startScan() {
        this.setData({
            plugList: [],
            state: "正在搜索蓝牙网关"
        });
        plugin.startScanGateway((plugDevice, plugList) => {
            this.setData({ plugList: plugList });
        }, err => {
            console.log(err)
            wx.showToast({
                icon: "none",
                title: err.errorMsg,
            });
            this.setData({
                plugList: [],
                state: err.errorMsg
            });
        });
    },

    // 停止蓝牙扫描设备
    stopScan() {
        this.setData({
            state: "正在停止搜索蓝牙网关"
        });
        plugin.stopScanGateway().then(res => {
            console.log(res);
            this.handleResetData(res.errorCode === 0 ? "蓝牙设备已停止扫描" : res.errorMsg);
        });
    },

    // 停止所有蓝牙操作，并退出操作中状态
    handleStopAllOperations() {
        this.setData({ state: "正在停止全部蓝牙操作" });
        plugin.stopAllOperations().then(res => {
            console.log(res);
            this.handleResetData(res.errorMsg);
        });
    },

    // 初始化蓝牙网关
    init(event) {
        const plugItem = JSON.parse(JSON.stringify(event.target.dataset.value));
        this.setData({ currentPlug: plugItem });
        this.handleInitGateway(plugItem);
    },
    
    // 初始化蓝牙网关
    handleInitGateway(deviceFromScan) {
        if (!deviceFromScan.isSettingMode) {
            return wx.showToast({
                icon: "none",
                title: "网关不可添加",
            });
        }
        this.setData({
            wifiList: [],
            plugList: [],
            state: `正在连接蓝牙网关${deviceFromScan.deviceName}, MAC地址：${deviceFromScan.MAC}`,
            currentPlug: deviceFromScan
        })
        // 连接智能网关
        plugin.connectGateway(deviceFromScan, err => {
            console.log("检测到设备断开连接(连接设备）", err);
            this.handleResetData("网关设备已断开连接");
        }).then(res => {
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({ state: `设备${deviceFromScan.deviceName}已连接，正在搜索WIFI列表` }, () => {
                    this.handleScanWifi(deviceFromScan);
                });
            } else {
                this.setData({
                    plugList: [],
                    state: `网关连接失败, 错误信息：${res.errorMsg}`
                });
            }
        })
    },

    // 扫描WIFI列表
    scanWifi(event) {
        this.handleScanWifi(this.data.currentPlug);
    },

    // 扫描智能锁连接的网关设备
    handleScanWifi(deviceFromScan) {
        this.setData({
            plugList: [],
            wifiList: [],
            state: `设备${deviceFromScan.deviceName}正在搜索WIFI列表, MAC地址：${deviceFromScan.MAC}`
        });
        plugin.scanWiFiByGateway(deviceFromScan, err => {
            console.log("检测到设备断开连接（扫描WIFI)", err)
            this.handleResetData("网关设备已断开连接");
        }).then(res => {
            console.log("WIFI扫描完成", res)
            if (res.errorCode === 0) {
                this.setData({
                    state: `搜索WIFI列表成功`,
                    wifiList: res.data.wifiList
                })
            } else {
                this.setData({
                    state: `搜索wifi列表失败, 错误信息：${res.errorMsg}`,
                    wifiList: []
                });
            }
        })
    },

    // 设置网关配置参数
    toConfigWifiInfo(event) {
        const wifiItem = JSON.parse(JSON.stringify(event.target.dataset.value));
        this.setData({
            wifiList: [],
            plugList: [],
            state: "",
            currentWifi: wifiItem,
            showInput: true,
            password: "",
        });
    },

    // 输入校验
    handleCheckInput(event) {
        if (!event.password) {
            wx.showToast({
                icon: "none",
                title: "请输入WIFI密码"
            });
            return false;
        } else {
            return true;
        }
    },

    // 初始化网关
    initGateway(event) {
        const value = event.detail.value;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        const deviceFromScan = this.data.currentPlug;
        const wifiItem = this.data.currentWifi;
        const defaultUID = AES_Decrypt(wx.getStorageSync<string>("uid")); // 本地保存的用户名
        const defaultPSD = AES_Decrypt(wx.getStorageSync<string>("user_psd")); // 本地保存的密码
        this.setData({
            state: `正在初始化网关${deviceFromScan.deviceName}, MAC地址：${deviceFromScan.MAC}, SSID:${wifiItem.SSID}, 密码：${value.password}`,
            showInput: false,
        })
        plugin.initGateway(deviceFromScan, {
            SSID: wifiItem.SSID,
            wifiPwd: value.password,
            uid: defaultUID,
            password: MD5_Encrypt(defaultPSD),
            companyId: 0,
            branchId: 0,
            plugName: deviceFromScan.deviceName,
            server: "plug.sciener.cn",
            port: 2999,
            useLocalIPAddress: false,
            useDHCP: true,
        }, err => {
            console.log("检测到设备断开连接（扫描WIFI)", err)
            this.handleResetData(err.errorMsg);
        }).then(initRes => {
            console.log("初始化", initRes)
            if (initRes.errorCode === 0) {
                this.setData({ state: `网关初始化成功, 正在上传初始化数据` });
                API.isInitSuccess({ gatewayNetMac: deviceFromScan.MAC }).then(checkRes => {
                    if (checkRes) {
                        console.log(checkRes)
                        API.uploadDetail({
                            gatewayId: checkRes.gatewayId,
                            modelNum: initRes.data.modelNum,
                            hardwareRevision: initRes.data.hardware,
                            firmwareRevision: initRes.data.firmware,
                            networkName: wifiItem.SSID
                        }).then(res => {
                            console.log(res)
                            if (res) {
                                wx.showToast({
                                    icon: "success",
                                    title: '网关已添加',
                                    mask: true,
                                    complete: () => {
                                        setTimeout(wx.navigateBack, 2000);
                                    }
                                });
                            } else {
                                this.setData({ state: "网关数据上传失败" });
                            }
                        })
                    } else {
                        this.setData({ state: "网关数据上传失败" });
                    }
                })
            } else {
                this.setData({ state: `网关初始化失败, 错误信息：${initRes.errorMsg}` });
            }
        })
    },
})