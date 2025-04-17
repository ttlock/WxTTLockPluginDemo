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
    },
    // 设置初始化参数
    onLoad() {
        const keyInfo: IEKey.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        const cardInfo: ICard.List.CardInfo = JSON.parse(wx.getStorageSync('cardInfo'));
        const startDate = dayjs().startOf("minute");
        const permanent = cardInfo.startDate === 0 && cardInfo.endDate === 0;
        this.setData({
            keyInfo: keyInfo,
            cardInfo: cardInfo,
            permanent: permanent,
            startDate: permanent ? startDate.valueOf() : cardInfo.startDate,
            endDate: permanent ? startDate.add(1, "hour").endOf("minute").startOf("second").valueOf() : cardInfo.endDate
        }, () =>{
            console.log(this.data.dateSpan)
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错

    // 输入校验
    handleCheckInput(value: FormStatus) {
        if (value.permanent) return true;
        else {
            const btnEl = this.selectComponent("#dateSpan");
            const errorMsg = btnEl.toCheckDateSpan();
            if (errorMsg) {
                HttpHandler.showErrorMsg(errorMsg)
                return false;
            } else return true;
        }
    },

    handleSubmit: debounce(function (event) {
        const value = event.detail.value as FormStatus;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleModifyCard(value);
    }, 100),

    // 点击修改IC卡
    handleModifyCard(value: FormStatus) {
        const ekeyInfo = this.data.keyInfo as IEKey.List.EKeyInfo;
        const cardInfo = this.data.cardInfo as ICard.List.CardInfo;
        const start = Date.now();
        wx.showLoading({ title: "正在修改IC卡有效期" });
        requirePlugin("myPlugin", ({ modifyICCardValidityPeriod }: TTLockPlugin) => {
            // 修改IC卡有效期
            modifyICCardValidityPeriod({
                startDate: value.permanent ? 0 : value.startDate,
                endDate: value.permanent ? 0 : value.endDate,
                cardNum: parseInt(cardInfo.cardNumber),
                lockData: ekeyInfo.lockData
            }).then(res => {
                if (res.errorCode == 0) {
                    wx.showLoading({ title: "修改成功，正在上传" });
                    console.log(`IC卡已修改, 正在上传, 操作时间: ${Date.now() - start}ms.`);
                    IdentityCardAPI.changePeriod({
                        lockId: ekeyInfo.lockId,
                        cardId: cardInfo.cardId,
                        startDate: value.permanent ? 0 : value.startDate,
                        endDate: value.permanent ? 0 : value.endDate,
                    }).then(res => {
                        console.log(res);
                        if (HttpHandler.isResponseTrue(res)) {
                            wx.hideLoading();
                            HttpHandler.showErrorMsg("IC卡已修改成功");
                            setTimeout(wx.navigateBack, 2000);
                        } else {
                            HttpHandler.handleResponseError(res);
                            wx.hideLoading();
                            console.log(`上传失败, IC卡已修改`);
                        }
                    }).catch(err => {
                        HttpHandler.handleServerError(err);
                        wx.hideLoading();
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg(`IC卡有效期修改失败：${res.errorMsg}`);
                }
            })
        })
    },


    // 删除IC卡
    handleDelete() {
        const ekeyInfo = this.data.keyInfo as IEKey.List.EKeyInfo;
        const cardInfo = this.data.cardInfo as ICard.List.CardInfo;
        const start = Date.now();
        wx.showLoading({ title: "正在删除IC卡" });
        requirePlugin("myPlugin", ({ deleteICCard }: TTLockPlugin) => {
            // 删除IC卡
            deleteICCard({
                cardNum: parseInt(cardInfo.cardNumber),
                lockData: ekeyInfo.lockData
            }).then(res => {
                console.log(res)
                if (res.errorCode == 0) {
                    wx.showLoading({ title: "删除成功，正在上传" });
                    console.log(`IC卡已删除, 正在上传, 操作时间: ${Date.now() - start}ms.`);
                    IdentityCardAPI.Delete({
                        lockId: ekeyInfo.lockId,
                        cardId: cardInfo.cardId
                    }).then(res => {
                        console.log(res);
                        if (HttpHandler.isResponseTrue(res)) {
                            wx.hideLoading();
                            HttpHandler.showErrorMsg("IC卡已删除");
                            setTimeout(wx.navigateBack, 2000);
                        } else {
                            HttpHandler.handleResponseError(res);
                            wx.hideLoading();
                            console.log(`上传失败, IC卡已删除`);
                        }
                    }).catch(err => {
                        HttpHandler.handleServerError(err);
                        wx.hideLoading();
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg(`IC卡删除失败：${res.errorMsg}`);
                }
            });
        });
    },
})