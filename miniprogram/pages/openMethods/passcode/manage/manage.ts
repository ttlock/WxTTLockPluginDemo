// 管理密码
import debounce from "debounce";
import * as KeyboardPwdAPI from "../../../../api/interfaces/keyboardPwd";
import { HttpHandler } from "../../../../api/handle/httpHandler";
const dayjs = require("dayjs");

interface FormStatus {
    passcode?: string; // 密码值
    permanent?: boolean; // 是否为永久密码
    startDate?: number;
    endDate?: number;
}

Page({
    data: {
        keyInfo: {}, // 钥匙数据
        passcodeInfo: {}, // 密码数据

        passcode: "", // 密码值
        permanent: true, // 永久开关
        startDate: 0,
        endDate: 0,
    },
    // 设置初始化参数
    onLoad() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        const passcodeInfo: ILockAPI.List.KeyboardPwdInfo = JSON.parse(wx.getStorageSync('passcodeInfo'));
        const startDate = dayjs().startOf("hour");
        this.setData({
            keyInfo: keyInfo,
            passcodeInfo: passcodeInfo,
            passcode: passcodeInfo.keyboardPwd,
            permanent: passcodeInfo.keyboardPwdType == 2,
            startDate: passcodeInfo.keyboardPwdType === 2 ? startDate.valueOf() : passcodeInfo.startDate,
            endDate: passcodeInfo.keyboardPwdType === 2 ? startDate.add(1, "hour").valueOf() : passcodeInfo.endDate
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错

    // 输入校验
    handleCheckInput(value: FormStatus) {
        if (!value.passcode) { HttpHandler.showErrorMsg("请输入密码"); return false; }
        else if (value.permanent) return true;
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
        this.handleModifyPasscode(value);
    }, 100),

    // 点击修改密码
    handleModifyPasscode(value: FormStatus) {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        const keyboardPwdInfo = this.data.passcodeInfo as ILockAPI.List.KeyboardPwdInfo;
        const start = Date.now();
        wx.showLoading({ title: "正在修改密码" });
        requirePlugin("myPlugin", ({ modifyPasscode }: TTLockPlugin) => {
            // 修改密码
            modifyPasscode({
                originalPasscode: keyboardPwdInfo.keyboardPwd,
                passcode: value.passcode,
                startDate: value.permanent ? 0 : value.startDate,
                endDate: value.permanent ? 0 : value.endDate,
                lockData: ekeyInfo.lockData
            }).then(res => {
                if (res.errorCode == 0) {
                    wx.showLoading({ title: "修改成功，正在上传" });
                    console.log(`密码已修改, 正在上传, 操作时间: ${Date.now() - start}ms.`);
                    KeyboardPwdAPI.change({
                        lockId: ekeyInfo.lockId,
                        keyboardPwdId: keyboardPwdInfo.keyboardPwdId,
                        newKeyboardPwd: value.passcode,
                        keyboardPwdType: value.permanent ? 2 : 3,
                        startDate: value.permanent ? 0 : value.startDate,
                        endDate: value.permanent ? 0 : value.endDate,
                    }).then(res => {
                        console.log(res);
                        if (HttpHandler.isResponseTrue(res)) {
                            wx.hideLoading();
                            HttpHandler.showErrorMsg("密码已修改成功");
                            setTimeout(wx.navigateBack, 2000);
                        } else {
                            HttpHandler.handleResponseError(res);
                            wx.hideLoading();
                            console.log(`上传失败, 密码已修改`);
                        }
                    }).catch(err => {
                        HttpHandler.handleServerError(err);
                        wx.hideLoading();
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg(`密码修改失败：${res.errorMsg}`);
                }
            })
        });
    },


    // 删除密码
    handleDelete() {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        const keyboardPwdInfo = this.data.passcodeInfo as ILockAPI.List.KeyboardPwdInfo;
        const start = Date.now();
        wx.showLoading({ title: "正在删除密码" });
        requirePlugin("myPlugin", ({ deletePasscode }: TTLockPlugin) => {
            // 删除密码
            deletePasscode({
                passcode: keyboardPwdInfo.keyboardPwd,
                lockData: ekeyInfo.lockData
            }).then(res => {
                if (res.errorCode == 0) {
                    wx.showLoading({ title: "删除成功，正在上传" });
                    console.log(`密码已删除, 正在上传, 操作时间: ${Date.now() - start}ms.`);
                    KeyboardPwdAPI.Delete({
                        lockId: ekeyInfo.lockId,
                        keyboardPwdId: keyboardPwdInfo.keyboardPwdId
                    }).then(res => {
                        console.log(res);
                        if (HttpHandler.isResponseTrue(res)) {
                            wx.hideLoading();
                            HttpHandler.showErrorMsg("密码已删除");
                            setTimeout(wx.navigateBack, 2000);
                        } else {
                            HttpHandler.handleResponseError(res);
                            wx.hideLoading();
                            console.log(`上传失败, 密码已删除`);
                        }
                    }).catch(err => {
                        HttpHandler.handleServerError(err);
                        wx.hideLoading();
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg(`密码删除失败：${res.errorMsg}`);
                }
            });
        });
    },
})