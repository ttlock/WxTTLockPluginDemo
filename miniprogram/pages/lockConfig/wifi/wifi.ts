// 智能锁wifi设置
import debounce from "debounce";
import * as WifiLockAPI from "../../../api/interfaces/wifiLock";
import * as HttpHandler from "../../../api/handle/httpHandler";

interface FormStatus {
    password?: string; // wifi密码
}

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        wifiList: [], // 扫描到的wifi列表
        configSwitch: false, // 是否已配置wifi信息
        currentWifi: null, // 当前选择的wifi信息
        password: "",
    },
    onLoad() {
        const keyInfo: IEKey.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({ keyInfo: keyInfo }, () => {
            this.handleUpdate();
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错

    handleUpdate: debounce(function() {
        const ekeyInfo = this.data.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        WifiLockAPI.detail({ lockId: ekeyInfo.lockId }).then(res => {
            wx.hideLoading();
            if (HttpHandler.isResponseTrue(res)) {
                this.setData({ configSwitch: res.networkName });
            } else {
                HttpHandler.handleResponseError(res);
                this.setData({ configSwitch: false });
            }
        }).catch(err => {
            console.log(err)
            wx.hideLoading();
            this.setData({ configSwitch: false });
            HttpHandler.handleServerError(err);
        })
    }, 100),

    // 输入校验
    handleCheckInput(value: FormStatus) {
        if (!value.password) {
            HttpHandler.showErrorMsg(`请输入wifi密码`);
            return false;
        } else return true;
    },

    /* 扫描智能锁附近可用wifi列表 */
    handleSearchWifi: debounce(function () {
        const ekeyInfo = this.data.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.data.wifiList.splice(0, this.data.wifiList.length);
        this.setData({
            state: `正在扫描智能锁附近可用wifi列表`,
            wifiList: this.data.wifiList,
            currentWifi: null,
        })
        requirePlugin("myPlugin", ({ scanWifi }: TTLockPlugin) => {
            scanWifi({ lockData: ekeyInfo.lockData }).then(res => {
                if (res.errorCode == 0) {
                    wx.hideLoading();
                    this.data.wifiList.splice(0, this.data.wifiList.length, ...res.data.wifiList);
                    this.setData({
                        state: `扫描智能锁附近可用wifi列表成功`,
                        wifiList: this.data.wifiList
                    });
                } else {
                    wx.hideLoading();
                    this.setData({ state: `扫描智能锁附近可用wifi列表失败：${res.errorMsg}` });
                }
            })
        });
    }, 100),

    /* 点击配置wifi信息 */
    toConfigWifiInfo: debounce(function(event) {
        const index = event.currentTarget.dataset.index;
        const wifiItem = this.data.wifiList[index];
        this.data.wifiList.splice(0, this.data.wifiList.length);
        this.setData({
            wifiList: this.data.wifiList,
            currentWifi: wifiItem,
            password: "",
        });
    }),

    /* 点击提交配置信息 */
    handleSubmit: debounce(function (event) {
        const value = event.detail.value;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleConfigWifi(value);
    }, 100),


    handleConfigWifi: debounce(function(value: FormStatus) {
        const ekeyInfo = this.data.keyInfo as IEKey.List.EKeyInfo;
        const wifiInfo = this.data.currentWifi as TTLock.WiFiInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在配置wifi信息` });
        requirePlugin("myPlugin", ({ configWifi, configServer }: TTLockPlugin) => {
            configWifi({
                config: {
                    SSID: wifiInfo.SSID,
                    password: value.password
                },
                lockData: ekeyInfo.lockData
            }).then(res => {
                if (res.errorCode == 0) {
                    this.setData({ state: `正在配置服务器信息` });
                    configServer({
                        config: {
                            server: "cnwifilock.ttlock.com",
                            port: 4999,
                        },
                        lockData: ekeyInfo.lockData
                    }).then(res => {
                        if (res.errorCode == 0) {
                            this.setData({ state: `服务器配置成功` });
                            WifiLockAPI.updateNetwork({
                                lockId: ekeyInfo.lockId, // 智能锁ID
                                networkName: wifiInfo.SSID, // 连接的网络名称
                                rssi: wifiInfo.rssi, // Wifi信号强度
                                useStaticIp: false, // 是否使用静态IP
                            }).then(res => {
                                console.log(111, res);
                                wx.hideLoading();
                                if (HttpHandler.isResponseTrue(res)) {
                                    HttpHandler.showErrorMsg("参数已上传服务器");
                                    this.handleUpdate();
                                } else {
                                    HttpHandler.handleResponseError(res);
                                }
                            }).catch(err => {
                                console.log(err)
                                wx.hideLoading();
                                HttpHandler.handleServerError(err);
                            })
                        } else {
                            wx.hideLoading();
                            this.setData({ state: `配置服务器信息失败：${res.errorMsg}` });
                        }
                    });
                } else {
                    wx.hideLoading();
                    this.setData({ state: `配置wifi信息失败：${res.errorMsg}` });
                }
            })
        });
    }, 100)
})