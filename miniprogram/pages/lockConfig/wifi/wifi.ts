// 智能锁wifi设置
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
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        this.setData({ keyInfo }, () => {
            this.handleUpdate();
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错
    handleCheckInput(value: FormStatus) {
        if (!value?.password) {
            HttpHandler.showErrorMsg(`请输入wifi密码`);
            return false;
        } else return true;
    },
    /** 查询服务器设置状态 */
    handleUpdate() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        WifiLockAPI.detail({
            lockId: ekeyInfo?.lockId
        }).then(res => {
            wx.hideLoading();
            if (HttpHandler.isResponseTrue(res)) {
                this.setData({ configSwitch: res?.networkName });
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
    },

    /* 扫描智能锁附近可用wifi列表 */
    async handleSearchWifi() {
        let list = this.data?.wifiList;
        (list || []).splice(0, (list || [])?.length);
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({
            state: `正在扫描智能锁附近可用wifi列表`,
            wifiList: list,
            currentWifi: null,
        })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /* 扫描智能锁附近可用wifi列表 */
            const result = await TTLockPlugin.scanWifi({
                lockData: ekeyInfo?.lockData,
            });
            if (result?.errorCode != 0) throw(result);

            wx.hideLoading();
            const newList = this.data?.wifiList;
            (newList || []).splice(0, (newList || [])?.length, ...(result?.data?.wifiList || []));
            this.setData({
                state: `扫描智能锁附近可用wifi列表成功`,
                wifiList: newList
            });
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("描智能锁附近可用wifi列表失败");
            this.setData({state: `描智能锁附近可用wifi列表失败: ${err?.errorMsg}` });
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    /* 点击配置wifi信息 */
    toConfigWifiInfo(event) {
        const index = Number(event?.currentTarget?.dataset?.index) || 0;
        const wifiItem = JSON.parse(JSON.stringify((this.data?.wifiList || [])[index]));
        const list = this.data?.wifiList;
        (list || []).splice(0, (list || [])?.length);
        this.setData({
            wifiList: list,
            currentWifi: wifiItem,
            password: "",
        });
    },

    /* 点击提交配置信息 */
    handleSubmit(event) {
        const value = event?.detail?.value;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleConfigWifi(value);
    },


    /* 配置wifi信息 */
    async handleConfigWifi(value: FormStatus) {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        const wifiInfo = this.data?.currentWifi as TTLock.WiFiInfo;
        wx.showLoading({ title: "" });
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /* 配置wifi信息 */
            this.setData({ state: `正在配置wifi信息` })
            const configWifiResult = await TTLockPlugin.configWifi({
                config: {
                    SSID: wifiInfo?.SSID,
                    password: value?.password
                },
                lockData: ekeyInfo?.lockData,
            });
            if (configWifiResult?.errorCode != 0) throw(configWifiResult);

            /* 配置远程服务器信息 */
            this.setData({ state: `正在配置远程服务器信息` })
            const configServerResult = await TTLockPlugin.configServer({
                config: {
                    server: "cnwifilock.ttlock.com",
                    port: 4999,
                },
                lockData: ekeyInfo?.lockData,
            });
            if (configServerResult?.errorCode != 0) throw(configServerResult);

            wx.showLoading({ title: "上传服务器中" });
            this.setData({ state: `远程服务器配置成功，wifi锁信息配置完成` })
            WifiLockAPI.updateNetwork({
                lockId: ekeyInfo?.lockId, // 智能锁ID
                networkName: wifiInfo?.SSID, // 连接的网络名称
                rssi: wifiInfo?.rssi, // Wifi信号强度
                // useStaticIp: false, // 是否使用静态IP
            }).then(res => {
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
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("配置wifi锁信息失败");
            this.setData({state: `配置wifi锁信息失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },
})