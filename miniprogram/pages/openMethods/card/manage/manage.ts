// 管理IC卡
import API from "../../../../api/API";
const dayjs = require("dayjs");
const plugin = requirePlugin("myPlugin");
let deviceId: string = ""; // 当前智能锁ID

Page({
    data: {
        keyInfo: {}, // 钥匙数据
        cardInfo: {}, // IC卡数据
        permanent: true, // 永久开关
        dateSpan: {}, // 有效期
    },
    // 设置初始化参数
    onLoad() {
        deviceId = "";
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        const cardInfo = JSON.parse(wx.getStorageSync('cardInfo'));
        const startDate = dayjs().startOf("hour");
        const permanent = cardInfo.startDate === 0 && cardInfo.endDate === 0;
        this.setData({
            keyInfo: keyInfo,
            cardInfo: cardInfo,
            permanent: permanent,
            dateSpan: {
                startDate: permanent ? startDate.valueOf() : cardInfo.startDate,
                endDate: permanent ? startDate.add(1, "hour").endOf("minute").valueOf() : cardInfo.endDate
            },
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错
    handleUpdateDateSpan(event) {
        this.data.dateSpan.startDate = event.detail.startDate;
        this.data.dateSpan.endDate = event.detail.endDate;
    },

    // 输入校验
    handleCheckInput(event) {
        if (this.data.permanent) return true;
        else {
            const btnEl = this.selectComponent("#dateSpan");
            const errorMsg = btnEl.toCheckDateSpan();
            if (errorMsg) {
                wx.showToast({ icon: "none", title: errorMsg });
                return false;
            } else return true;
        }
    },

    handleSubmit(event) {
        const value = event.detail.value;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleModifyCard();
    },

    // 点击修改IC卡
    handleModifyCard() {
        const cardNo = this.data.cardInfo.cardNumber;
        const startDate = this.data.permanent ? 0 : this.data.dateSpan.startDate;
        const endDate = this.data.permanent ? 0 : this.data.dateSpan.endDate;
        const lockData = this.data.keyInfo.lockData;
        const lockId = this.data.keyInfo.lockId;
        const start = Date.now();
        wx.showLoading({ title: "正在修改IC卡有效期" });
        // 修改IC卡有效期
        plugin.modifyICCardValidityPeriod(startDate, endDate, cardNo, lockData, res => {
            console.log("修改IC卡连接已断开", res)
        }, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                this.setData({ state: `IC卡已修改, 正在上传, 操作时间: ${Date.now() - start}ms.` });
                API.modifyICCard({
                    lockId: lockId,
                    cardId: this.data.cardInfo.cardId,
                    startDate: startDate,
                    endDate: endDate
                }).then(res1 => {
                    console.log(res1);
                    if (res1) {
                        wx.showToast({
                            icon: "success",
                            title: 'IC卡已修改',
                            mask: true,
                            complete: () => {
                                setTimeout(wx.navigateBack, 2000);
                            }
                        });
                    } else {
                        wx.showToast({ icon: "error", title: "上传失败, IC卡已修改" });
                        this.setData({ state: `上传失败, IC卡已修改` });
                    }
                })
            } else {
                wx.showToast({ icon: "error", title: "修改失败" });
                this.setData({ state: `IC卡有效期修改失败, 错误信息: ${res.errorMsg}` });
            }
        })
    },


    // 删除IC卡
    handleDelete() {
        const cardNo = this.data.cardInfo.cardNumber;
        const lockData = this.data.keyInfo.lockData;
        const lockId = this.data.keyInfo.lockId;
        const start = Date.now();
        wx.showLoading({ title: "正在删除IC卡" });
        // 删除IC卡
        plugin.deleteICCard(cardNo, lockData, res => {
            console.log("删除IC卡连接已断开", res)
        }, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                this.setData({ state: `IC卡已删除, 正在上传, 操作时间: ${Date.now() - start}ms.` });
                API.deleteICCard({
                    lockId: lockId,
                    cardId: this.data.cardInfo.cardId
                }).then(res1 => {
                    console.log(res1);
                    if (res1) {
                        wx.showToast({
                            icon: "success",
                            title: 'IC卡已删除',
                            mask: true,
                            complete: () => {
                                setTimeout(wx.navigateBack, 2000);
                            }
                        });
                    } else {
                        wx.showToast({ icon: "error", title: "上传失败, IC卡已删除" });
                        this.setData({ state: `上传失败, IC卡已删除` });
                    }
                })
            } else {
                wx.showToast({ icon: "error", title: "删除失败" });
                this.setData({ state: `IC卡删除失败, 错误信息: ${res.errorMsg}` });
            }
        });
    },
})