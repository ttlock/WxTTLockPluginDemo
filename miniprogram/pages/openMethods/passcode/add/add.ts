// 添加自定义密码
import API from "../../../../api/API";
const dayjs = require("dayjs");
const plugin = requirePlugin("myPlugin");
let deviceId: string = ""; // 当前智能锁ID

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        specialValueObj: {}, // 智能锁特征值

        name: "", // 密码名称
        passcode: "", // 密码值
        permanent: true, // 永久开关
        dateSpan: {}, // 有效期
    },
    // 设置初始化参数
    onLoad() {
        deviceId = "";
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        const specialValueObj = plugin.parseSpecialValues(keyInfo.featureValue || keyInfo.specialValue);
        const startDate = dayjs().startOf("hour");
        this.setData({
            keyInfo: keyInfo,
            specialValueObj: specialValueObj,
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
        if (!event.name) { wx.showToast({ icon: "none", title: "请输入密码名称" }); return false; }
        else if (!event.passcode) { wx.showToast({ icon: "none", title: "请输入自定义密码" }); return false; }
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
        
        this.handleAddPasscode();
    },

    // 点击添加自定义密码
    handleAddPasscode() {
        const passcode = this.data.passcode;
        const startDate = this.data.permanent ? 0 : this.data.dateSpan.startDate;
        const endDate = this.data.permanent ? 0 : this.data.dateSpan.endDate;
        const lockData = this.data.keyInfo.lockData;
        const lockId = this.data.keyInfo.lockId;
        const start = Date.now();
        wx.showLoading({ title: "正在设置自定义密码" });
        // 添加自定义密码
        plugin.createCustomPasscode(passcode, startDate, endDate, lockData, res => {
            console.log("添加自定义密码连接已断开", res)
        }, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                console.log(`自定义密码已添加, 正在上传, 操作时间: ${Date.now() - start}ms.`);
                API.addKeyboardPwd({
                    lockId: lockId,
                    keyboardPwd: res.passcode,
                    keyboardPwdName: this.data.name,
                    keyboardPwdType: this.data.permanent ? 2 : 3,
                    startDate: !this.data.permanent ? startDate : undefined,
                    endDate: !this.data.permanent ? endDate : undefined,
                }).then(res => {
                    if (res) {
                        console.log(res);
                        wx.showToast({
                            icon: "success",
                            title: '密码已添加',
                            mask: true,
                            complete: () => {
                                setTimeout(wx.navigateBack, 2000);
                            }
                        });
                    } else {
                        wx.showToast({ icon: "error", title: "上传失败, 密码已添加" });
                        console.log(`自定义密码上传失败, 密码已添加`);
                    }
                })
            } else {
                wx.showToast({ icon: "error", title: "添加失败" });
                console.log(`自定义密码添加失败, 错误信息: ${res.errorMsg}`);
            }
        })
    },
})