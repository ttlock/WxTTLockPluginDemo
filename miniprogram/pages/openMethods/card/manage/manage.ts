// 管理IC卡
import debounce from "debounce";
import * as IdentityCardAPI from "../../../../api/interfaces/identityCard";
import * as HttpHandler from "../../../../api/handle/httpHandler";
const dayjs = require("dayjs");

interface FormStatus {
    permanent?: boolean; // 是否为永久IC卡
    startDate?: number;
    endDate?: number;
}

Page({
    data: {
        keyInfo: {}, // 钥匙数据
        cardInfo: {}, // IC卡数据
        permanent: true, // 永久开关
        startDate: 0,
        endDate: 0,
        state: "",
    },
    onLoad() {
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        const cardInfo = JSON.parse(wx.getStorageSync('cardInfo') || "{}") as ICard.List.CardInfo;
        const startDate = dayjs().startOf("minute");
        const permanent = cardInfo?.startDate === 0 && cardInfo?.endDate === 0;
        this.setData({
            keyInfo: keyInfo,
            cardInfo: cardInfo,
            permanent: permanent,
            startDate: permanent ? startDate.valueOf() : cardInfo?.startDate,
            endDate: permanent ? startDate.add(1, "hour").endOf("minute").startOf("second").valueOf() : cardInfo?.endDate
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
    handleSubmit(event) {
        const value = event?.detail?.value as FormStatus;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleModifyCard(value);
    },

    /** 修改IC卡 */
    async handleModifyCard(value: FormStatus) {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        const cardInfo = this.data?.cardInfo as ICard.List.CardInfo;
        const start = Date.now();
        wx.showLoading({ title: "" });
        this.setData({ state: `正在修改IC卡有效期` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /** 修改IC卡有效期 */
            const result = await TTLockPlugin.modifyICCardValidityPeriod({
                cardNum: String(cardInfo?.cardNumber), // 3.1.0弱化参数类型限制, 3.0.8及其之前传入number
                startDate: value?.permanent ? 0 : value?.startDate,
                endDate: value?.permanent ? 0 : value?.endDate,
                lockData: ekeyInfo?.lockData
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);

            wx.showLoading({ title: "同步服务器中" });
            this.setData({ state: `IC卡有效期已修改, 正在上传, 操作时间: ${end - start}ms.` });
            IdentityCardAPI.changePeriod({
                lockId: ekeyInfo?.lockId,
                cardId: cardInfo?.cardId,
                startDate: value?.permanent ? 0 : value?.startDate,
                endDate: value?.permanent ? 0 : value?.endDate,
            }).then(res => {
                wx.hideLoading();
                if (HttpHandler.isResponseTrue(res)) {
                    this.setData({ state: `IC卡有效期修改成功, 操作时间: ${end - start}ms.` });
                    HttpHandler.showErrorMsg("IC卡有效期已修改成功");
                    setTimeout(wx.navigateBack, 2000);
                } else {
                    this.setData({ state: `IC卡有效期修改成功, 服务器同步失败, 操作时间: ${end - start}ms.` });
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                wx.hideLoading();
                this.setData({ state: `IC卡有效期修改成功, 服务器同步失败, 操作时间: ${end - start}ms.` });
                HttpHandler.handleServerError(err);
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("修改IC卡有效期失败");
            this.setData({state: `修改IC卡有效期失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },


    /** 删除IC卡 */
    async handleDelete() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        const cardInfo = this.data?.cardInfo as ICard.List.CardInfo;
        const start = Date.now();
        wx.showLoading({ title: "" });
        this.setData({ state: `正在删除IC卡` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /** 删除IC卡 */
            const result = await TTLockPlugin.deleteICCard({
                cardNum: String(cardInfo?.cardNumber), // 3.1.0弱化参数类型限制, 3.0.8及其之前传入number
                lockData: ekeyInfo?.lockData
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);

            wx.showLoading({ title: "同步服务器中" });
            this.setData({ state: `IC卡已删除, 正在上传, 操作时间: ${end - start}ms.` });
            IdentityCardAPI.Delete({
                lockId: ekeyInfo?.lockId,
                cardId: cardInfo?.cardId
            }).then(res => {
                wx.hideLoading();
                if (HttpHandler.isResponseTrue(res)) {
                    this.setData({ state: `IC卡已删除, 操作时间: ${end - start}ms.` });
                    HttpHandler.showErrorMsg("IC卡删除成功");
                    setTimeout(wx.navigateBack, 2000);
                } else {
                    this.setData({ state: `IC卡已删除, 服务器同步失败, 操作时间: ${end - start}ms.` });
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                wx.hideLoading();
                this.setData({ state: `IC卡已删除, 服务器同步失败, 操作时间: ${end - start}ms.` });
                HttpHandler.handleServerError(err);
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("删除IC卡失败");
            this.setData({state: `删除IC卡失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },
})