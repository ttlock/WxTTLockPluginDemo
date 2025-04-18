// 添加指纹
import debounce from "debounce";
import * as FingerprintAPI from "../../../../api/interfaces/fingerprint";
import * as HttpHandler from "../../../../api/handle/httpHandler";
const dayjs = require("dayjs");

interface FormStatus {
    cardNo?: string; // IC卡号
    name?: string; // IC卡名称
    permanent?: boolean; // 是否为永久IC卡
    startDate?: number;
    endDate?: number;
}

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        name: "", // 指纹名称
        permanent: true, // 永久开关
        startDate: 0,
        endDate: 0,
    },
    onLoad() {
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        const startDate = dayjs().startOf("minute");
        this.setData({
            keyInfo: keyInfo,
            startDate: startDate.valueOf(),
            endDate: startDate.add(1, "hour").endOf("minute").startOf("second").valueOf()
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错
    handleCheckInput(event: FormStatus) {
        if (!event?.name) { HttpHandler.showErrorMsg("请输入指纹名称"); return false; }
        else if (event?.permanent) return true;
        else {
            const btnEl = this.selectComponent("#dateSpan");
            const errorMsg = btnEl.toCheckDateSpan();
            if (errorMsg) {
                HttpHandler.showErrorMsg(errorMsg)
                return false;
            } else return true;
        }
    },
    handleSubmit(event) {
        const value = event?.detail?.value as FormStatus;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleInitFinterprint(value);
    },

    /** 录入指纹 */
    async handleInitFinterprint(value: FormStatus) {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        const start = Date.now();
        wx.showLoading({ title: "" });
        this.setData({ state: `正在录入指纹` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /** 录入指纹 */
            let totalCount = 0;
            const result = await TTLockPlugin.addFingerprint({
                startDate: value?.permanent ? 0 : value?.startDate,
                endDate: value?.permanent ? 0 : value?.endDate,
                lockData: ekeyInfo?.lockData,
                callback: (result) => {
                    switch (result?.type) {
                    case 1: {
                        wx.showLoading({ title: `指纹已录入, 正在上传` });
                        this.setData({ state: "指纹已录入, 正在上传" });
                    }; break;
                    case 2:{
                        totalCount = result?.totalCount;
                        wx.showLoading({ title: `请录入指纹, 0/${result?.totalCount}` });
                        this.setData({ state: `${result?.description}, 请录入指纹, 进度 0/${result?.totalCount}` });
                    }; break;
                    case 3: {
                        wx.showLoading({ title: `请再录入指纹, ${result?.currentCount}/${totalCount}` });
                        this.setData({ state: `${result?.description}, 请录入指纹, 进度 ${result?.currentCount}/${totalCount}` });
                    }; break;
                    case 4: {
                        wx.showLoading({ title: result?.description });
                        this.setData({ state: result?.description });
                    }; break;
                    default: {
                        wx.hideLoading();
                        HttpHandler.showErrorMsg(result?.errorMsg);
                    }; break;
                    }
                },
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);

            wx.showLoading({ title: "同步服务器中" });
            this.setData({ state: `指纹已录入, 正在上传, 操作时间: ${end - start}ms.` });
            FingerprintAPI.add({
                lockId: ekeyInfo?.lockId,
                fingerprintName: value?.name,
                fingerprintNumber: result?.fingerprintNum,
                fingerprintType: 1,
                startDate: !value?.permanent ? value?.startDate : 0,
                endDate: !value?.permanent ? value?.endDate : 0,
            }).then(res => {
                wx.hideLoading();
                if (HttpHandler.isResponseTrue(res)) {
                    this.setData({ state: `指纹已录入, 操作时间: ${end - start}ms.` });
                    HttpHandler.showErrorMsg("指纹已录入");
                    setTimeout(wx.navigateBack, 2000);
                } else {
                    this.setData({ state: `指纹已录入, 服务器同步失败, 操作时间: ${end - start}ms.` });
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                wx.hideLoading();
                this.setData({ state: `指纹已录入, 服务器同步失败, 操作时间: ${end - start}ms.` });
                HttpHandler.handleServerError(err);
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("录入指纹失败");
            this.setData({state: `录入指纹失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },
})