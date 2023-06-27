// 管理密码
import API from "../../../../api/API";
const dayjs = require("dayjs");
const plugin = requirePlugin("myPlugin");
let deviceId: string = ""; // 当前智能锁ID

Page({
    data: {
        keyInfo: {}, // 钥匙数据
        passcodeInfo: {}, // 密码数据

        passcode: "", // 密码值
        permanent: true, // 永久开关
        dateSpan: {}, // 有效期
    },
    // 设置初始化参数
    onLoad() {
        deviceId = "";
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        const passcodeInfo = JSON.parse(wx.getStorageSync('passcodeInfo'));
        const startDate = dayjs().startOf("hour");
        this.setData({
            keyInfo: keyInfo,
            passcodeInfo: passcodeInfo,
            passcode: passcodeInfo.keyboardPwd,
            permanent: passcodeInfo.keyboardPwdType === 2,
            dateSpan: {
                startDate: passcodeInfo.keyboardPwdType === 2 ? startDate.valueOf() : passcodeInfo.startDate,
                endDate: passcodeInfo.keyboardPwdType === 2 ? startDate.add(1, "hour").endOf("minute").valueOf() : passcodeInfo.endDate
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
        if (!event.passcode) { wx.showToast({ icon: "none", title: "请输入密码" }); return false; }
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
        this.handleModifyPasscode();
    },

    // 点击修改密码
    handleModifyPasscode() {
        const passcode = this.data.passcodeInfo.keyboardPwd;
        const newPasscode = this.data.passcode;
        const startDate = this.data.permanent ? 0 : this.data.dateSpan.startDate;
        const endDate = this.data.permanent ? 0 : this.data.dateSpan.endDate;
        const lockData = this.data.keyInfo.lockData;
        const lockId = this.data.keyInfo.lockId;
        const start = Date.now();
        wx.showLoading({ title: "正在修改密码" });
        // 修改密码
        plugin.modifyPasscode(passcode, newPasscode, startDate, endDate, lockData, res => {
            console.log("修改密码连接已断开", res)
        }, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                console.log(`密码已修改, 正在上传, 操作时间: ${Date.now() - start}ms.`);
                API.modifyKeyboardPwd({
                    lockId: lockId,
                    keyboardPwdId: this.data.passcodeInfo.keyboardPwdId,
                    newKeyboardPwd: newPasscode,
                    keyboardPwdType: this.data.permanent ? 2 : 3,
                    startDate: this.data.permanent ? undefined : startDate,
                    endDate: this.data.permanent ? undefined : endDate,
                }).then(res => {
                    if (res) {
                        wx.showToast({
                            icon: "success",
                            title: '密码已修改',
                            mask: true,
                            complete: () => {
                                setTimeout(wx.navigateBack, 2000);
                            }
                        });
                    } else {
                        wx.showToast({ icon: "error", title: "上传失败, 密码已修改" });
                        console.log(`上传失败, 密码已修改`);
                    }
                })
            } else {
                wx.showToast({ icon: "error", title: "修改失败" });
                console.log(`密码修改失败, 错误信息: ${res.errorMsg}`);
            }
        })
    },


    // 删除密码
    handleDelete() {
        const passcode = this.data.passcodeInfo.keyboardPwd;
        const lockData = this.data.keyInfo.lockData;
        const lockId = this.data.keyInfo.lockId;
        const start = Date.now();
        wx.showLoading({ title: "正在删除密码" });
        // 删除密码
        plugin.deletePasscode(passcode, lockData, res => {
            console.log("删除密码连接已断开", res)
        }, deviceId).then(res => {
            console.log(res)
            if (res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                console.log(`密码已删除, 正在上传, 操作时间: ${Date.now() - start}ms.`);
                API.deleteKeyboardPwd({
                    lockId: lockId,
                    keyboardPwdId: this.data.passcodeInfo.keyboardPwdId
                }).then(res => {
                    console.log(res);
                    if (res) {
                        wx.showToast({
                            icon: "success",
                            title: '密码已删除',
                            mask: true,
                            complete: () => {
                                setTimeout(wx.navigateBack, 2000);
                            }
                        });
                    } else {
                        wx.showToast({ icon: "error", title: "上传失败, 密码已删除" });
                        console.log(`上传失败, 密码已删除`);
                        this.setData({
                            state: `密码删除失败`
                        })
                    }
                })
            } else {
                wx.showToast({ icon: "error", title: "删除失败" });
                console.log(`密码删除失败, 错误信息: ${res.errorMsg}`);
            }
        });
    },
})