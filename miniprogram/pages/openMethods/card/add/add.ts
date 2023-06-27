// 添加自定义密码
import API from "../../../../api/API";
const dayjs = require("dayjs");
const plugin = requirePlugin("myPlugin");
let deviceId: string = ""; // 当前智能锁ID

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        cardNo: "", // IC卡卡号
        name: "", // IC卡名称
        permanent: true, // 永久开关
        dateSpan: {}, // 有效期
    },
    // 设置初始化参数
    onLoad() {
        deviceId = "";
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        const startDate = dayjs().startOf("hour");
        this.setData({
            keyInfo: keyInfo,
            dateSpan: {
                startDate: startDate.valueOf(),
                endDate: startDate.add(1, "hour").endOf("minute").valueOf()
            },
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错
    handleUpdateDateSpan(event) {
        this.data.dateSpan.startDate = event.detail.startDate;
        this.data.dateSpan.endDate = event.detail.endDate;
    },

    // 输入校验
    handleCheckInput(event, type: "RECOVER" | "INIT") {
        console.log(event)
        if (type === "RECOVER" && !event.cardNo) { wx.showToast({ icon: "none", title: "请输入IC卡卡号" }); return false; }
        else if (!event.name) { wx.showToast({ icon: "none", title: "请输入IC卡名称" }); return false; }
        else if (this.data.permanent) return true;
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
        const type = event.detail.target.dataset.type;
        const flag = this.handleCheckInput(value, type);
        if (!flag) return;
        switch(type) {
        case "INIT": this.handleInitCard(); break;
        case "RECOVER": this.handleRecoverCard(); break;
        }
    },

    // 添加IC卡
    handleInitCard() {
        const startDate = this.data.permanent ? 0 : this.data.dateSpan.startDate;
        const endDate = this.data.permanent ? 0 : this.data.dateSpan.endDate;
        const lockData = this.data.keyInfo.lockData;
        const lockId = this.data.keyInfo.lockId;
        const start = Date.now();
        wx.showLoading({ title: "正在添加IC卡" });
        plugin.addICCard(startDate, endDate, lockData, res => {
            console.log("step", res);
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            } else if (res.errorCode === 0) {
                switch (res.type) {
                    case 1: break;
                    case 2:{
                        wx.showLoading({ title: `${res.description}, 请录入IC卡` });
                        this.setData({ state: `${res.description}, 请录入IC卡` });
                    }; break;
                    case 3: {
                        wx.showLoading({ title: res.description });
                        this.setData({ state: res.description });
                    }; break;
                    default: {
                        wx.showLoading({ title: '未知错误' });
                        this.setData({ state: '未知错误' });
                    }; break;
                }
            }
        }, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                this.setData({ state: `IC卡已添加, 正在上传, 操作时间: ${Date.now() - start}ms.`})
                API.addICCard({
                    lockId: lockId,
                    cardName: this.data.name,
                    cardNumber: res.cardNum,
                    startDate: startDate,
                    endDate: endDate
                }).then(res1 => {
                    console.log(res1);
                    if (res1) {
                        wx.showToast({
                            icon: "success",
                            title: 'IC卡已添加',
                            mask: true,
                            complete: () => {
                                setTimeout(wx.navigateBack, 2000);
                            }
                        });
                    } else {
                        wx.showToast({ icon: "error", title: "上传失败, IC卡已添加" });
                        this.setData({ state: "上传失败, IC卡已添加" });
                    }
                })
            } else {
                wx.showToast({ icon: "error", title: "IC卡添加失败" });
                this.setData({ state: `IC卡添加失败, 错误信息: ${res.errorMsg}`});
            }
        })
    },

    // 通过卡号恢复IC卡
    handleRecoverCard() {
        const startDate = this.data.permanent ? 0 : this.data.dateSpan.startDate;
        const endDate = this.data.permanent ? 0 : this.data.dateSpan.endDate;
        const lockData = this.data.keyInfo.lockData;
        const lockId = this.data.keyInfo.lockId;
        const cardNo = parseInt(this.data.cardNo);
        const start = Date.now();
        wx.showLoading({ title: "正在恢复IC卡" });
        // 恢复IC卡
        plugin.recoverICCardNumber(cardNo, startDate, endDate, lockData, res => {
            console.log("恢复IC卡连接已断开", res)
        }, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                this.setData({ state: `IC卡已恢复, 正在上传, 操作时间: ${Date.now() - start}ms.`});
                API.addICCard({
                    lockId: lockId,
                    cardName: this.data.name,
                    cardNumber: cardNo,
                    startDate: startDate,
                    endDate: endDate
                }).then(res1 => {
                    console.log(res1);
                    if (res1) {
                        wx.showToast({
                            icon: "success",
                            title: 'IC卡已恢复',
                            mask: true,
                            complete: () => {
                                setTimeout(wx.navigateBack, 2000);
                            }
                        });
                    } else {
                        wx.showToast({ icon: "error", title: "上传失败, IC卡已恢复" });
                        this.setData({ state: "上传失败, IC卡已恢复" });
                    }
                })
            } else {
                wx.showToast({ icon: "error", title: "IC卡恢复失败" });
                this.setData({ state: `IC卡恢复失败, 错误信息: ${res.errorMsg}`});
            }
        })
    },
})