// 添加智能网关
import debounce from "debounce";
import * as GatewayAPI from "../../api/interfaces/gateway";
import { HttpHandler } from "../../api/handle/httpHandler";
import { AES_Decrypt, MD5_Encrypt } from "../../utils/crypto";

interface FormStatus {
    password?: string; // 密码
}

Page({
    data: {
        plugList: new Array<TTGatewayFromScan>(), // 蓝牙扫描网关列表
        wifiList: new Array<TTLockWifiFromScan>(), // 搜索到的网关列表
        state: '', // 错误提示
        isInitGateway: false, // 是否正在初始化蓝牙网关
        currentPlug: null, // 当前操作的网关
        currentWifi: null, // 当前操作的WIFI信息
        password: "", // WIFI密码
        showInput: false, // 是否显示密码表单
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
    handleInputEmpty() {}, // 解决绑定数据输入报错

    // 重置数据参数
    handleResetData(errorMsg: string) {
        this.data.plugList.splice(0, this.data.plugList.length);
        this.data.wifiList.splice(0, this.data.wifiList.length);
        this.setData({
            plugList: this.data.plugList,
            wifiList: this.data.wifiList,
            currentPlug: null,
            currentWifi: null,
            password: "",
            showInput: false,
            state: errorMsg
        });
    },

    // 开始扫描附近的网关设备
    startScan() {
        if (this.data.isInitGateway) {
            HttpHandler.showErrorMsg("正在添加蓝牙网关，请稍候再试");
            return;
        }
        this.data.plugList.splice(0, this.data.plugList.length);
        this.data.wifiList.splice(0, this.data.wifiList.length);
        this.setData({ plugList: this.data.plugList, wifiList: this.data.wifiList, state: "启动蓝牙设备扫描" });
        requirePlugin("myPlugin", ({ startScanGateway }: TTLockPlugin) => {
            // 开启蓝牙设备扫描
            startScanGateway((deviceFromScan, deviceFromScanList) => {
                // TODO 成功扫描到设备
                if (!this.data.isInitGateway) // 初始化操作关闭扫描有延迟，进入扫描模式后忽略扫描结果
                    this.setData({ plugList: deviceFromScanList, state: "蓝牙设备扫描中" });
            }, (err) => {
                HttpHandler.showErrorMsg(err.errorMsg);
                this.data.plugList.splice(0, this.data.plugList.length);
                this.setData({ plugList: this.data.plugList, state: `蓝牙扫描开启失败：${err.errorMsg}`});
            });
        });
    },

    // 停止蓝牙扫描设备
    stopScan() {
        this.setData({ state: "正在停止搜索蓝牙设备" });
        requirePlugin("myPlugin", ({ stopScanGateway }: TTLockPlugin) => {
            // 关闭蓝牙设备扫描
            stopScanGateway().then(res => {
                // TODO 关闭蓝牙设备扫描返回
                this.data.plugList.splice(0, this.data.plugList.length);
                this.setData({
                    plugList: this.data.plugList,
                    state: res.errorCode == 0 ? "蓝牙设备扫描已关闭" : `关闭蓝牙扫描失败：${res.errorMsg}`
                });
            });
        });
        // this.setData({
        //     state: "正在停止搜索蓝牙网关"
        // });
        // plugin.stopScanGateway().then(res => {
        //     console.log(res);
        //     this.handleResetData(res.errorCode === 0 ? "蓝牙设备已停止扫描" : res.errorMsg);
        // });
    },

    // 停止所有蓝牙操作，并退出操作中状态
    handleStopAllOperations() {
        this.setData({ state: "正在停止全部蓝牙操作" });
        requirePlugin("myPlugin", ({ stopAllOperations }: TTLockPlugin) => {
            // 停止所有蓝牙操作
            stopAllOperations().then(res => {
                // TODO 停止蓝牙操作返回
                HttpHandler.showErrorMsg(res.errorMsg);
                this.handleResetData(res.errorCode == 0 ? "蓝牙操作已关闭" : `停止蓝牙操作失败：该接口无法打断正在连接的动作`);
            });
        });
    },

    // 初始化蓝牙网关
    init(event) {
        this.data.isInitGateway = true;
        const index = event.currentTarget.dataset.index;
        const plugItem = this.data.plugList[index];
        // const plugItem = JSON.parse(JSON.stringify(event.target.dataset.value));
        this.setData({ currentPlug: plugItem });
        this.handleInitGateway(plugItem);
    },
    
    // 初始化蓝牙网关
    handleInitGateway(deviceFromScan: TTGatewayFromScan) {
        if (!deviceFromScan.isSettingMode) {
            this.data.isInitGateway = false;
            return HttpHandler.showErrorMsg(`网关当前不可添加，请重新通电后再试`);
        }
        this.data.plugList.splice(0, this.data.plugList.length);
        this.data.wifiList.splice(0, this.data.wifiList.length);
        this.setData({
            plugList: this.data.plugList,
            wifiList: this.data.wifiList,
            currentPlug: deviceFromScan,
            state: `正在连接蓝牙网关${deviceFromScan.deviceName}, MAC地址：${deviceFromScan.MAC}`
        });
        requirePlugin("myPlugin", ({ connectGateway }: TTLockPlugin) => {
            // 连接蓝牙网关
            connectGateway({ deviceFromScan }).then(res => {
                if (res.errorCode == 0) {
                    // TODO 蓝牙网关连接成功
                    this.setData({
                        isInitGateway: deviceFromScan.type == 2 ? true : false,
                        state: `蓝牙网关已连接，网关类型：G${deviceFromScan.type}`
                    });
                    if (deviceFromScan.type == 2) { // G2网关进行wifi扫描
                        this.handleScanWifi(deviceFromScan);
                    }
                }
                else this.setData({ isInitGateway: false, state: `网关连接失败：${res.errorMsg}` });
            });
        });
    },

    // 扫描WIFI列表
    scanWifi(event) {
        this.handleScanWifi(this.data.currentPlug);
    },

    // 扫描智能锁连接的网关设备
    handleScanWifi(deviceFromScan: TTGatewayFromScan) {
        if (deviceFromScan.type != 2) return;
        this.data.isInitGateway = true;
        this.data.plugList.splice(0, this.data.plugList.length);
        this.data.wifiList.splice(0, this.data.wifiList.length);
        this.setData({
            plugList: this.data.plugList,
            wifiList: this.data.wifiList,
            currentPlug: deviceFromScan,
            state: `G2网关${deviceFromScan.deviceName}正在搜索wifi列表, MAC地址：${deviceFromScan.MAC}`
        });
        requirePlugin("myPlugin", ({ scanWiFiByGateway }: TTLockPlugin) => {
            // 扫描智能锁附近可用网关列表
            scanWiFiByGateway({ deviceFromScan }).then(res => {
                if (res.errorCode == 0) {
                    // TODO 网关扫描成功
                    res.data.wifiList.forEach(item => this.data.wifiList.push(item))
                    this.setData({ isInitGateway: false, wifiList: this.data.wifiList, state: `wifi列表扫描完成` });
                }
                else this.setData({ isInitGateway: false, state: `wifi扫描失败：${res.errorMsg}` });
            });
        });
    },

    // 设置网关配置参数
    toConfigWifiInfo(event) {
        const index = event.currentTarget.dataset.index;
        const wifiItem = this.data.wifiList[index];
        this.data.plugList.splice(0, this.data.plugList.length);
        this.data.wifiList.splice(0, this.data.wifiList.length);
        this.setData({
            plugList: this.data.plugList,
            wifiList: this.data.wifiList,
            currentWifi: wifiItem,
            state: `请输入wifi密码`,
            showInput: true,
            password: "",
        });
    },

    // 输入校验
    handleCheckInput(event: FormStatus) {
        if (!event.password) {
            HttpHandler.showErrorMsg("请输入wifi密码");
            return false;
        } else {
            return true;
        }
    },

    // 初始化网关
    initGateway: debounce(function (event) {
        const value = event.detail.value as FormStatus;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.data.isInitGateway = true;
        const deviceFromScan = this.data.currentPlug as TTGatewayFromScan;
        const wifiItem = this.data.currentWifi as TTLockWifiFromScan;
        const defaultUID = parseInt(AES_Decrypt(wx.getStorageSync<string>("uid"))); // 本地保存的用户名
        const defaultPSD = AES_Decrypt(wx.getStorageSync<string>("user_psd")); // 本地保存的密码
        this.setData({
            state: `正在初始化网关${deviceFromScan.deviceName}, MAC地址：${deviceFromScan.MAC}, SSID:${wifiItem.SSID}, 密码：${value.password}`,
            showInput: false,
        })
        requirePlugin("myPlugin", ({ initGateway }: TTLockPlugin) => {
            // 初始化网关信息
            initGateway({
                deviceFromScan,
                configuration: {
                    type: deviceFromScan.type,
                    SSID: deviceFromScan.type == 2 ? wifiItem.SSID : undefined,
                    wifiPwd: deviceFromScan.type == 2 ? value.password : undefined,
                    uid: defaultUID,
                    password: MD5_Encrypt(defaultPSD),
                    companyId: 0,
                    branchId: 0,
                    plugName: deviceFromScan.deviceName,
                    server: "plug.sciener.cn",
                    port: 2999,
                    useLocalIPAddress: false
                }
            }).then(initRes => {
                console.log("初始化", initRes)
                if (initRes.errorCode === 0) {
                    this.setData({ isInitGateway: false, state: `网关初始化成功, 正在查询服务器` });
                    wx.showLoading({ title: "" });
                    GatewayAPI.isInitSuccess({ gatewayNetMac: deviceFromScan.MAC }).then(checkRes => {
                        if (HttpHandler.isResponseTrue(checkRes)) {
                            this.setData({ state: `网关已初始化，正在更新设备信息` });
                            GatewayAPI.uploadDetail({
                                gatewayId: checkRes.gatewayId,
                                modelNum: initRes.data.modelNum,
                                hardwareRevision: initRes.data.hardware,
                                firmwareRevision: initRes.data.firmware,
                                networkName: wifiItem.SSID
                            }).then(res => {
                                if (HttpHandler.isResponseTrue(res)) {
                                    wx.hideLoading();
                                    this.setData({ state: "网关初始化完成" });
                                    HttpHandler.showErrorMsg("网关已初始化");
                                    setTimeout(wx.navigateBack, 2000);
                                } else {
                                    wx.hideLoading();
                                    HttpHandler.handleResponseError(res);
                                    this.setData({ state: "网关信息更新失败" });
                                }
                            }).catch(err => {
                                wx.hideLoading();
                                HttpHandler.handleServerError(err);
                                this.setData({ state: "网关信息更新失败" });
                            })
                        }
                        else {
                            wx.hideLoading();
                            HttpHandler.handleResponseError(checkRes);
                            this.setData({ state: "查询网关初始化状态失败" });
                        }
                    }).catch(err => {
                        wx.hideLoading();
                        HttpHandler.handleServerError(err);
                        this.setData({ state: "查询网关初始化状态失败" });
                    })
                }
                else this.setData({ isInitGateway: false, state: `网关初始化失败：${initRes.errorMsg}` });
            })
        })
    }, 100),
})