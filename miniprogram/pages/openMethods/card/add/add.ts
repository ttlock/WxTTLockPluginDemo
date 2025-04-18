// 添加自定义密码
import debounce from "debounce";
import * as IdentityCardAPI from "../../../../api/interfaces/identityCard";
import * as HttpHandler from "../../../../api/handle/httpHandler";
const dayjs = require("dayjs");

interface FormStatus {
    cardNo?: string; // IC卡卡号
    name?: string; // IC卡名称
    permanent?: boolean; // 是否为永久IC卡
    startDate?: number;
    endDate?: number;
}

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        cardNo: "", // IC卡卡号
        name: "", // IC卡名称
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
    handleCheckInput(event: FormStatus, type: "RECOVER" | "INIT") {
        if (type === "RECOVER" && !event?.cardNo) { HttpHandler.showErrorMsg("请输入IC卡卡号"); return false; }
        else if (!event?.name) { HttpHandler.showErrorMsg("请输入IC卡名称"); return false; }
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
        const type = event?.detail?.target?.dataset?.type;
        const flag = this.handleCheckInput(value, type);
        if (!flag) return;
        switch(type) {
        case "INIT": this.handleInitCard(value); break;
        case "RECOVER": this.handleRecoverCard(value); break;
        }
    },

    /** 录入IC卡 */
    async handleInitCard(value: FormStatus) {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        const start = Date.now();
        wx.showLoading({ title: "" });
        this.setData({ state: `正在录入IC卡` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /**录入IC卡 */
            const result = await TTLockPlugin.addICCard({
                startDate: value?.permanent ? 0 : value?.startDate,
                endDate: value?.permanent ? 0 : value?.endDate,
                lockData: ekeyInfo?.lockData,
                callback: (result) => {
                    switch (result?.type) {
                    case 1: {
                        wx.showLoading({ title: `IC卡已录入, 正在上传` });
                        this.setData({ state: "IC卡已录入, 正在上传" });
                    }; break;
                    case 2:{
                        wx.showLoading({ title: `${result?.description}, 请录入IC卡` });
                        this.setData({ state: `${result?.description}, 请录入IC卡` });
                    }; break;
                    case 3: {
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
            this.setData({ state: `IC卡已录入, 正在上传, 操作时间: ${end - start}ms.` });
            IdentityCardAPI.add({
                lockId: ekeyInfo?.lockId,
                cardName: value?.name,
                cardNumber: String(result?.cardNum),
                startDate: !value?.permanent ? value?.startDate : 0,
                endDate: !value?.permanent ? value?.endDate : 0
            }).then(res => {
                wx.hideLoading();
                if (HttpHandler.isResponseTrue(res)) {
                    this.setData({ state: `IC卡已录入, 操作时间: ${end - start}ms.` });
                    HttpHandler.showErrorMsg("IC卡已录入");
                    setTimeout(wx.navigateBack, 2000);
                } else {
                    this.setData({ state: `IC卡已录入, 服务器同步失败, 操作时间: ${end - start}ms.` });
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                wx.hideLoading();
                this.setData({ state: `IC卡已录入, 服务器同步失败, 操作时间: ${end - start}ms.` });
                HttpHandler.handleServerError(err);
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("录入IC卡失败");
            this.setData({state: `录入IC卡失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    /** 通过卡号恢复/添加IC卡 */
    async handleRecoverCard(value: FormStatus) {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        const start = Date.now();
        wx.showLoading({ title: "" });
        this.setData({ state: `正在通过IC卡卡号添加IC卡` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /** 通过卡号恢复/添加IC卡 */
            const result = await TTLockPlugin.recoverICCardNumber({
                cardNum: String(value?.cardNo), // 3.1.0弱化参数类型限制, 3.0.8及其之前传入number
                startDate: value?.permanent ? 0 : value?.startDate,
                endDate: value?.permanent ? 0 : value?.endDate,
                lockData: ekeyInfo?.lockData
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);

            wx.showLoading({ title: "同步服务器中" });
            this.setData({ state: `IC卡已添加, 正在上传, 操作时间: ${end - start}ms.` });
            IdentityCardAPI.add({
                lockId: ekeyInfo?.lockId,
                cardName: value?.name,
                cardNumber: String(value?.cardNo),
                startDate: value?.permanent ? 0 : value?.startDate,
                endDate: value?.permanent ? 0 : value?.endDate
            }).then(res => {
                wx.hideLoading();
                if (HttpHandler.isResponseTrue(res)) {
                    this.setData({ state: `IC卡已添加, 操作时间: ${end - start}ms.` });
                    HttpHandler.showErrorMsg("IC卡已添加成功");
                    setTimeout(wx.navigateBack, 2000);
                } else {
                    this.setData({ state: `IC卡已添加成功, 服务器同步失败, 操作时间: ${end - start}ms.` });
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                wx.hideLoading();
                this.setData({ state: `IC卡已添加成功, 服务器同步失败, 操作时间: ${end - start}ms.` });
                HttpHandler.handleServerError(err);
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("通过IC卡卡号添加IC卡失败");
            this.setData({state: `通过IC卡卡号添加IC卡失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },
})