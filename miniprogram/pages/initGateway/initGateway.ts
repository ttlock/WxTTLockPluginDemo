// 添加智能网关
import * as GatewayAPI from "../../api/interfaces/gateway";
import * as HttpHandler from "../../api/handle/httpHandler";
import * as Crypto from "../../utils/crypto";

Page({
    data: {
        plugList: [], // 蓝牙扫描网关列表
        wifiList: [], // 搜索到的网关列表
        state: '', // 错误提示
        isInitGateway: false, // 是否正在初始化蓝牙网关
        currentPlug: null, // 当前操作的网关
        currentWifi: null, // 当前操作的WIFI信息
        password: "", // WIFI密码
        showInput: false, // 是否显示密码表单
    },
    onHide() {
        this.stopScan();
    },
    onUnload() {
        this.stopScan();
        
    },
    handleInputEmpty() {},

    // 重置数据参数
    handleResetData(errorMsg: string) {
        const plugList = this.data?.plugList || [];
        const wifiList = this.data?.wifiList || [];
        plugList.splice(0, plugList?.length);
        wifiList.splice(0, wifiList?.length);
        this.setData({
            plugList,
            wifiList,
            currentPlug: null,
            currentWifi: null,
            password: "",
            showInput: false,
            state: errorMsg,
            isInitGateway: false,
        });
    },

    // 开始扫描附近的网关设备
    async startScan() {
        if (this.data?.isInitGateway) return HttpHandler.showErrorMsg("正在添加蓝牙网关，请稍候再试");

       const plugList = this.data?.plugList || [];
        const wifiList = this.data?.wifiList || [];
        plugList.splice(0, plugList?.length);
        wifiList.splice(0, wifiList?.length);
        this.setData({ plugList, wifiList, state: "启动蓝牙设备扫描" });

        const plugin = requirePlugin("myPlugin") as TTLockPlugin;
        const res = await plugin.startScanGateway((deviceFromScan, deviceFromScanList) => {
            // TODO 成功扫描到设备
            const l = JSON.parse(JSON.stringify(deviceFromScanList));
            if (!this?.data?.isInitGateway) this.setData({ plugList: l, state: "蓝牙设备扫描中" });
        }, (err) => {
            // TODO 3.1.0 若未扫描到任意设备或附近设备权限未开启，将在此处【额外】增加一次回调，该回调不会关闭扫描
            this.setData({ state: `蓝牙扫描：${err?.errorMsg}` });
        });
        // 3.1.0 操作结果立即返回
        this.setData({ state: res?.errorCode == 0 ? "蓝牙扫描已启用" : `蓝牙扫描开启失败：${res?.errorMsg}` });
    },

    // 停止蓝牙扫描设备
    async stopScan() {
        this.setData({ state: "正在停止搜索蓝牙设备" });
        const plugin = requirePlugin("myPlugin") as TTLockPlugin;
        const res = await plugin.stopScanGateway();
        const list = (this.data?.plugList || []);
        list.splice(0, list?.length);
        this.setData({
            plugList: list,
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
        const list = (this.data?.plugList || []);
        list.splice(0, list?.length);
        this.setData({
            plugList: list,
            state: res?.errorCode == 0
                ? "蓝牙操作已关闭"
                : "停止蓝牙操作失败"
        });
    },

    // 初始化蓝牙网关
    init(event) {
        this.data.isInitGateway = true;
        const plugItem = JSON.parse(JSON.stringify(event?.target?.dataset?.value || {}));
        this.setData({ currentPlug: plugItem });
        this.handleInitGateway(plugItem);
    },
    
    // 初始化蓝牙网关
    async handleInitGateway(deviceFromScan: TTGatewayFromScan) {
        this.data.isInitGateway = deviceFromScan?.isSettingMode ? true : false;
        if (!deviceFromScan?.isSettingMode) return HttpHandler.showErrorMsg(`网关当前不可添加，请重新通电后再试`);

        const plugList = this.data?.plugList || [];
        const wifiList = this.data?.wifiList || [];
        plugList.splice(0, plugList?.length);
        wifiList.splice(0, wifiList?.length);
        this.setData({
            plugList,
            wifiList,
            currentPlug: deviceFromScan,
            state: `正在连接蓝牙网关${deviceFromScan.deviceName}, MAC地址：${deviceFromScan.MAC}`
        });
        const plugin = requirePlugin("myPlugin") as TTLockPlugin;
        try {
            await plugin.stopScanBleDevice();
            const result = await plugin.connectGateway({ deviceFromScan });
            if (result?.errorCode != 0) throw(result);

            this.setData({
                isInitGateway: true,
                state: `蓝牙网关已连接，网关类型：G${deviceFromScan?.type}`
            });

            // TODO 蓝牙网关连接成功
            if (deviceFromScan?.type == 2) { // G2网关进行wifi扫描
                this.handleScanWifi(deviceFromScan);
            } else { // G3、G4网关直接添加
                this.initGateway();
            }
        } catch(err) {
            this.setData({ isInitGateway: false, state: `网关连接失败：${err?.errorMsg}` });
            // 3.1.0 及时关闭蓝牙占用
            const finalRes = await plugin.finishOperations();
            console.log(finalRes);
        }
    },

    // 扫描WIFI列表
    scanWifi(event) {
        this.handleScanWifi(this.data.currentPlug);
    },

    // 扫描智能锁连接的网关设备
    async handleScanWifi(deviceFromScan: TTGatewayFromScan) {
        if (deviceFromScan?.type != 2) return;
        this.data.isInitGateway = true;
        const plugList = this.data?.plugList || [];
        const wifiList = this.data?.wifiList || [];
        plugList.splice(0, plugList?.length);
        wifiList.splice(0, wifiList?.length);
        this.setData({
            isInitGateway: true,
            plugList,
            wifiList,
            currentPlug: deviceFromScan,
            state: `G2网关${deviceFromScan?.deviceName}正在搜索wifi列表, MAC地址：${deviceFromScan?.MAC}`
        });

        const plugin = requirePlugin("myPlugin") as TTLockPlugin;
        const res = await plugin.scanWiFiByGateway({ deviceFromScan });
        if (res?.errorCode != 0) this.setData({ isInitGateway: false, state: `wifi扫描失败：${res?.errorMsg}` });
        // TODO 网关扫描成功
        (res?.data?.wifiList || []).forEach(item => this.data.wifiList.push(item))
        this.setData({ isInitGateway: false, wifiList: this.data.wifiList, state: `wifi列表扫描完成` });
    },

    // 设置网关配置参数
    toConfigWifiInfo(event) {
        const index = event.currentTarget.dataset.index;
        const wifiItem = this.data.wifiList[index];
        const plugList = this.data?.plugList || [];
        const wifiList = this.data?.wifiList || [];
        plugList.splice(0, plugList?.length);
        wifiList.splice(0, wifiList?.length);
        this.setData({
            plugList,
            wifiList,
            currentWifi: wifiItem,
            state: `请输入wifi密码`,
            showInput: true,
            password: "",
        });
    },

    // 输入校验
    handleCheckInput(event) {
        if (!event.password) {
            HttpHandler.showErrorMsg("请输入wifi密码");
            return false;
        } else {
            return true;
        }
    },

    // 初始化网关
    async initGateway(event) {
        const value = event?.detail?.value;
        this.data.isInitGateway = true;
        const deviceFromScan = this.data.currentPlug as TTGatewayFromScan;
        const wifiItem = this.data.currentWifi as TTGateway.WiFiInfo;
        const defaultUID = parseInt(Crypto.AES_Decrypt(wx.getStorageSync<string>("uid"))); // 本地保存的用户名
        const defaultPSD = Crypto.AES_Decrypt(wx.getStorageSync<string>("user_psd")); // 本地保存的密码
        this.setData({
            state: `正在初始化网关${deviceFromScan.deviceName}, MAC地址：${deviceFromScan.MAC}, SSID:${wifiItem?.SSID || "--"}, 密码：${value?.password || "--"}`,
            showInput: false,
        })

        const plugin = requirePlugin("myPlugin") as TTLockPlugin;
        try {
            const initRes = await plugin.initGateway({
                deviceFromScan,
                configuration: {
                    type: deviceFromScan?.type,
                    SSID: deviceFromScan?.type == 2 ? wifiItem?.SSID : undefined,
                    wifiPwd: deviceFromScan?.type == 2 ? value?.password : undefined,
                    uid: defaultUID,
                    password: Crypto.MD5_Encrypt(defaultPSD),
                    companyId: 0,
                    branchId: 0,
                    plugName: deviceFromScan?.deviceName,
                    server: "plug.sciener.cn",
                    port: 2999,
                    useLocalIPAddress: false
                    // TODO 若一直返回超时，可能是本地IP配置错误，将设置改为DHCP后重新添加
                    // useLocalIPAddress: true,
                    // useDHCP: true
                }
            });
            if (initRes?.errorCode != 0) throw(initRes);
            this.setData({ isInitGateway: false, state: `网关初始化成功, 正在查询服务器` });
            wx.showLoading({ title: "" });
            GatewayAPI.isInitSuccess({ gatewayNetMac: deviceFromScan?.MAC }).then(checkRes => {
                if (HttpHandler.isResponseTrue(checkRes)) {
                    this.setData({ state: `网关已初始化，正在更新设备信息` });
                    GatewayAPI.uploadDetail({
                        gatewayId: checkRes?.gatewayId,
                        modelNum: initRes?.data?.modelNum,
                        hardwareRevision: initRes?.data?.hardware,
                        firmwareRevision: initRes?.data?.firmware,
                        networkName: wifiItem?.SSID
                    }).then(res => {
                        wx.hideLoading();
                        if (HttpHandler.isResponseTrue(res)) {
                            this.setData({ state: "网关初始化完成" });
                            HttpHandler.showErrorMsg("网关已初始化");
                            setTimeout(wx.navigateBack, 2000);
                        } else {
                            HttpHandler.handleResponseError(res);
                            this.setData({ state: "网关信息更新失败" });
                        }
                    }).catch(err => {
                        wx.hideLoading();
                        HttpHandler.handleServerError(err);
                        this.setData({ state: "网关信息更新失败" });
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.handleResponseError(checkRes);
                    this.setData({ state: "查询网关初始化状态失败" });
                }
            }).catch(err => {
                wx.hideLoading();
                HttpHandler.handleServerError(err);
                this.setData({ state: "查询网关初始化状态失败" });
            })
        } catch(err) {
            this.setData({ isInitGateway: false, state: `网关初始化失败：${err?.errorMsg}` });
            console.log(err);
        } finally {
            await plugin.finishOperations();
        }
    }
})