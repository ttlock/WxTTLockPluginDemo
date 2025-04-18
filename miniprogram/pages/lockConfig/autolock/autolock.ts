// 智能锁自动闭锁时间设置
import * as LockAPI from "../../../api/interfaces/lock";
import * as HttpHandler from "../../../api/handle/httpHandler";

interface FormStatus {
    enable?: boolean;
    autolockTime?: number; // 自动闭锁时间设置
}

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        enable: undefined,
        autolockTime: 0, // 自动闭锁时间设置
        max: 0,
        min: 0,
        placeholder: ""
    },
    onLoad() {
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        this.setData({ keyInfo });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错
    handleCheckInput(value: FormStatus) {
        if (this.data?.enable && (!value?.autolockTime || value?.autolockTime < this.data?.min || value?.autolockTime > this.data?.max)) {
            HttpHandler.showErrorMsg(`请输入${this.data?.min} - ${this.data?.max}之间的数字`);
            return false;
        }
        else return true;
    },
    handleSubmit(event) {
        const value = event?.detail?.value as FormStatus;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleChange(value);
    },

    /* 查询自动闭锁时间 */
    async getAutoLockTime() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在查询自动闭锁时间` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /* 查询自动闭锁时间 */
            const result = await TTLockPlugin.getAutomaticLockingPeriod({
                lockData: ekeyInfo?.lockData,
            });
            if (result?.errorCode != 0) throw(result);

            wx.hideLoading();
            this.setData({
                state: `查询自动闭锁时间成功`,
                enable: result?.autoLockInfo?.enable,
                autolockTime: result?.autoLockInfo?.autoLockTime,
                max: result?.autoLockInfo?.maxAutoLockTime,
                min: result?.autoLockInfo?.minAutoLockTime,
                placeholder: `请输入${result?.autoLockInfo?.minAutoLockTime} - ${result?.autoLockInfo?.maxAutoLockTime}之间的数字`
            });
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("查询自动闭锁时间失败");
            this.setData({state: `查询自动闭锁时间失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },


    /* 修改自动闭锁时间 */
    async handleChange(value: FormStatus) {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在修改自动闭锁时间` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /* 修改自动闭锁时间 */
            const result = await TTLockPlugin.setAutomaticLockingPeriod({
                seconds: value?.enable ? value?.autolockTime : 0,
                lockData: ekeyInfo?.lockData,
            });
            if (result?.errorCode != 0) throw(result);

            wx.showLoading({ title: "上传服务器中" });
            this.setData({ state: `自动闭锁时间设置成功` })
            LockAPI.setAutoLockTime({
                lockId: ekeyInfo?.lockId, // 智能锁ID
                seconds: value?.enable ? value?.autolockTime : 0,
                type: 1,
            }).then(res => {
                wx.hideLoading();
                if (HttpHandler.isResponseTrue(res)) {
                    HttpHandler.showErrorMsg("已同步服务器")
                } else {
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                wx.hideLoading();
                HttpHandler.handleServerError(err);
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("查询自动闭锁时间失败");
            this.setData({state: `查询自动闭锁时间失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    }
})