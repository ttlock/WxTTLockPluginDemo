// 添加自定义密码
import debounce from "debounce";
import * as IdentityCardAPI from "../../../../api/interfaces/identityCard";
import { HttpHandler } from "../../../../api/handle/httpHandler";
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
    // 设置初始化参数
    onLoad() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        const startDate = dayjs().startOf("minute");
        this.setData({
            keyInfo: keyInfo,
            startDate: startDate.valueOf(),
            endDate: startDate.add(1, "hour").endOf("minute").startOf("second").valueOf()
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错

    // 输入校验
    handleCheckInput(event: FormStatus, type: "RECOVER" | "INIT") {
        if (type === "RECOVER" && !event.cardNo) { HttpHandler.showErrorMsg("请输入IC卡卡号"); return false; }
        else if (!event.name) { HttpHandler.showErrorMsg("请输入IC卡名称"); return false; }
        else if (event.permanent) return true;
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
        const type = event.detail.target.dataset.type;
        const flag = this.handleCheckInput(value, type);
        if (!flag) return;
        switch(type) {
        case "INIT": this.handleInitCard(value); break;
        case "RECOVER": this.handleRecoverCard(value); break;
        }
    }, 100),

    // 添加IC卡
    handleInitCard(value: FormStatus) {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "正在添加IC卡" });
        requirePlugin("myPlugin", ({ addICCard }: TTLockPlugin) => {
            // 添加IC卡
            addICCard({
                startDate: !value.permanent ? value.startDate : 0,
                endDate: !value.permanent ? value.endDate : 0,
                lockData: ekeyInfo.lockData,
                callback: (result) => {
                    console.log(result, "中间步骤")
                    switch (result.type) {
                    case 1: {
                        wx.showLoading({ title: `添加成功，正在上传` });
                        this.setData({ state: "IC卡添加成功" });
                    }; break;
                    case 2:{
                        wx.showLoading({ title: `${result.description}, 请录入IC卡` });
                        this.setData({ state: `${result.description}, 请录入IC卡` });
                    }; break;
                    case 3: {
                        wx.showLoading({ title: result.description });
                        this.setData({ state: result.description });
                    }; break;
                    default: {
                        wx.hideLoading();
                        HttpHandler.showErrorMsg(result.errorMsg);
                    }; break;
                    }
                }
            }).then(res => {
                if (res.errorCode === 0) {
                    wx.showLoading({ title: "添加成功，正在上传" });
                    console.log(`IC卡已添加, 正在上传`);
                    IdentityCardAPI.add({
                        lockId: ekeyInfo.lockId,
                        cardName: value.name,
                        cardNumber: String(res.cardNum),
                        startDate: !value.permanent ? value.startDate : 0,
                        endDate: !value.permanent ? value.endDate : 0,
                    }).then(res => {
                        console.log(res);
                        if (HttpHandler.isResponseTrue(res)) {
                            wx.hideLoading();
                            HttpHandler.showErrorMsg("IC卡已添加成功");
                            setTimeout(wx.navigateBack, 2000);
                        } else {
                            HttpHandler.handleResponseError(res);
                            wx.hideLoading();
                            console.log(`上传失败, IC卡已添加`);
                        }
                    }).catch(err => {
                        HttpHandler.handleServerError(err);
                        wx.hideLoading();
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg(`IC卡添加失败：${res.errorMsg}`);
                }
            })
        });
    },

    // 通过卡号恢复IC卡
    handleRecoverCard(value: FormStatus) {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "正在通过卡号添加IC卡" });
        requirePlugin("myPlugin", ({ recoverICCardNumber }: TTLockPlugin) => {
            // 恢复IC卡
            recoverICCardNumber({
                startDate: !value.permanent ? value.startDate : 0,
                endDate: !value.permanent ? value.endDate : 0,
                cardNum: parseInt(value.cardNo),
                lockData: ekeyInfo.lockData
            }).then(res => {
                if (res.errorCode === 0) {
                    wx.showLoading({ title: "添加成功，正在上传" });
                    console.log(`IC卡已恢复, 正在上传`);
                    IdentityCardAPI.add({
                        lockId: ekeyInfo.lockId,
                        cardName: value.name,
                        cardNumber: value.cardNo,
                        startDate: !value.permanent ? value.startDate : 0,
                        endDate: !value.permanent ? value.endDate : 0,
                    }).then(res => {
                        console.log(res);
                        if (HttpHandler.isResponseTrue(res)) {
                            wx.hideLoading();
                            HttpHandler.showErrorMsg("IC卡已恢复成功");
                            setTimeout(wx.navigateBack, 2000);
                        } else {
                            HttpHandler.handleResponseError(res);
                            wx.hideLoading();
                            console.log(`上传失败, 指纹已恢复`);
                        }
                    }).catch(err => {
                        HttpHandler.handleServerError(err);
                        wx.hideLoading();
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg(`IC卡恢复失败：${res.errorMsg}`);
                }
            })
        });
    },
})