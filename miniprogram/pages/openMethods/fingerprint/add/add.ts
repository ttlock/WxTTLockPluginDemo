// 添加指纹
import API from "../../../../api/API";
const dayjs = require("dayjs");
const plugin = requirePlugin("myPlugin");
let deviceId: string = ""; // 当前智能锁ID

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        name: "", // 指纹名称
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
    handleCheckInput(event) {
        console.log(event)
        if (!event.name) { wx.showToast({ icon: "none", title: "请输入指纹名称" }); return false; }
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
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleInitFinterprint();
    },

    // 添加指纹
    handleInitFinterprint() {
        const startDate = this.data.permanent ? 0 : this.data.dateSpan.startDate;
        const endDate = this.data.permanent ? 0 : this.data.dateSpan.endDate;
        const lockData = this.data.keyInfo.lockData;
        const lockId = this.data.keyInfo.lockId;
        const start = Date.now();
        wx.showLoading({ title: "正在添加指纹" });
        let totalCount = 0;
        // 添加指纹
        plugin.addFingerprint(startDate, endDate, lockData, res => {
            console.log("step", res);
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            } else if (res.errorCode === 0) {
                switch (res.type) {
                    case 1: break;
                    case 2:{
                        totalCount = res.totalCount;
                        wx.showLoading({ title: `请录入指纹, 0/${res.totalCount}` });
                        this.setData({ state: `${res.description}, 请录入指纹, 进度 0/${res.totalCount}` });
                    }; break;
                    case 3: {
                        wx.showLoading({ title: `请再录入指纹, ${res.currentCount}/${totalCount}` });
                        this.setData({ state: `${res.description}, 请录入指纹, 进度 ${res.currentCount}/${totalCount}` });
                    }; break;
                    case 4: {
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
                this.setData({ state: `在奇偶位已添加, 正在上传, 操作时间: ${Date.now() - start}ms.`});
                API.addFingerprint({
                    lockId: lockId,
                    fingerprintName: this.data.name,
                    fingerprintNumber: res.fingerprintNum,
                    fingerprintType: 1,
                    startDate: startDate,
                    endDate: endDate
                }).then(res1 => {
                    console.log(res1);
                    if (res1) {
                        wx.showToast({
                            icon: "success",
                            title: '指纹已添加',
                            mask: true,
                            complete: () => {
                                setTimeout(wx.navigateBack, 2000);
                            }
                        });
                    } else {
                        wx.showToast({ icon: "error", title: "上传失败, 指纹已添加" });
                        this.setData({ state: "上传失败, 指纹已添加" });
                    }
                })
            } else {
                wx.showToast({ icon: "error", title: "指纹添加失败" });
                this.setData({ state: `指纹添加失败, 错误信息: ${res.errorMsg}`});
            }
        })
    },
})