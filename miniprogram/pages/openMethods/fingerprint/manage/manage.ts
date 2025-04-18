// 管理指纹
import debounce from "debounce";
import * as FingerprintAPI from "../../../../api/interfaces/fingerprint";
import * as HttpHandler from "../../../../api/handle/httpHandler";
const dayjs = require("dayjs");

interface FormStatus {
    permanent?: boolean; // 是否为永久指纹
    startDate?: number;
    endDate?: number;
}

Page({
    data: {
        keyInfo: {}, // 钥匙数据
        fingerprintInfo: {}, // 指纹数据
        permanent: true, // 永久开关
        startDate: 0,
        endDate: 0,
        state: "",
    },
    onLoad() {
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        const fingerprintInfo = JSON.parse(wx.getStorageSync('fingerprintInfo') || "{}") as IFingerprint.List.FingerprintInfo;
        const startDate = dayjs().startOf("minute");
        const permanent = fingerprintInfo?.startDate === 0 && fingerprintInfo?.endDate === 0;
        this.setData({
            keyInfo: keyInfo,
            fingerprintInfo: fingerprintInfo,
            permanent: permanent,
            startDate: permanent ? startDate.valueOf() : fingerprintInfo?.startDate,
            endDate: permanent ? startDate.add(1, "hour").endOf("minute").startOf("second").valueOf() : fingerprintInfo?.endDate
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错
    handleCheckInput(value: FormStatus) {
        if (value?.permanent) return true;
        else {
            const btnEl = this.selectComponent("#dateSpan");
            const errorMsg = btnEl.toCheckDateSpan();
            if (errorMsg) {
                HttpHandler.showErrorMsg(errorMsg)
                return false;
            } else return true;
        }
    },
    handleUpdateDateSpan(event) {
        this.data.dateSpan.startDate = event?.detail?.startDate;
        this.data.dateSpan.endDate = event?.detail?.endDate;
    },
    handleSubmit(event) {
        const value = event?.detail?.value as FormStatus;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleModifyFinerprint(value);
    },

    /** 修改指纹 */
    async handleModifyFinerprint(value: FormStatus) {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        const fingerprintInfo = this.data?.fingerprintInfo as IFingerprint.List.FingerprintInfo;
        const start = Date.now();
        wx.showLoading({ title: "" });
        this.setData({ state: `正在修改指纹有效期` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /** 修改指纹有效期 */
            const result = await TTLockPlugin.modifyFingerprintValidityPeriod({
                fingerprintNum: String(fingerprintInfo?.fingerprintNumber), // 3.1.0弱化参数类型限制
                startDate: value?.permanent ? 0 : value?.startDate,
                endDate: value?.permanent ? 0 : value?.endDate,
                lockData: ekeyInfo?.lockData
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);

            wx.showLoading({ title: "同步服务器中" });
            this.setData({ state: `指纹有效期已修改, 正在上传, 操作时间: ${end - start}ms.` });
            FingerprintAPI.changePeriod({
                lockId: ekeyInfo?.lockId,
                fingerprintId: fingerprintInfo?.fingerprintId,
                startDate: value?.permanent ? 0 : value?.startDate,
                endDate: value?.permanent ? 0 : value?.endDate,
            }).then(res => {
                wx.hideLoading();
                if (HttpHandler.isResponseTrue(res)) {
                    this.setData({ state: `指纹有效期修改成功, 操作时间: ${end - start}ms.` });
                    HttpHandler.showErrorMsg("指纹有效期已修改成功");
                    setTimeout(wx.navigateBack, 2000);
                } else {
                    this.setData({ state: `指纹有效期修改成功, 服务器同步失败, 操作时间: ${end - start}ms.` });
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                wx.hideLoading();
                this.setData({ state: `指纹有效期修改成功, 服务器同步失败, 操作时间: ${end - start}ms.` });
                HttpHandler.handleServerError(err);
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("修改指纹有效期失败");
            this.setData({state: `修改指纹有效期失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },


    /** 删除指纹 */
    async handleDelete() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        const fingerprintInfo = this.data?.fingerprintInfo as IFingerprint.List.FingerprintInfo;
        const start = Date.now();
        wx.showLoading({ title: "" });
        this.setData({ state: `正在删除指纹` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /** 删除指纹 */
            const result = await TTLockPlugin.deleteFingerprint({
                fingerprintNum: String(fingerprintInfo?.fingerprintNumber), // 3.1.0弱化参数类型限制
                lockData: ekeyInfo?.lockData
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);

            wx.showLoading({ title: "同步服务器中" });
            this.setData({ state: `指纹已删除, 正在上传, 操作时间: ${end - start}ms.` });
            FingerprintAPI.Delete({
                lockId: ekeyInfo?.lockId,
                fingerprintId: fingerprintInfo?.fingerprintId
            }).then(res => {
                wx.hideLoading();
                if (HttpHandler.isResponseTrue(res)) {
                    this.setData({ state: `指纹已删除, 操作时间: ${end - start}ms.` });
                    HttpHandler.showErrorMsg("指纹删除成功");
                    setTimeout(wx.navigateBack, 2000);
                } else {
                    this.setData({ state: `指纹已删除, 服务器同步失败, 操作时间: ${end - start}ms.` });
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                wx.hideLoading();
                this.setData({ state: `指纹已删除, 服务器同步失败, 操作时间: ${end - start}ms.` });
                HttpHandler.handleServerError(err);
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("删除指纹失败");
            this.setData({state: `删除指纹失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },
})