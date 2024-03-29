// 设置管理员密码
import debounce from "debounce";
import * as LockAPI from "../../../api/interfaces/lock";
import { HttpHandler } from "../../../api/handle/httpHandler";

interface FormStatus {
    passcode?: string; // 管理员密码
}

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        passcode: "", // 管理员密码
    },
    // 设置初始化参数
    onLoad() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({
            keyInfo: keyInfo,
            passcode: keyInfo.noKeyPwd
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错

    // 输入校验
    handleCheckInput(value: FormStatus) {
        if (!value.passcode) { HttpHandler.showErrorMsg("请输入4-9位长度数字密码"); return false; }
        else return true;
    },

    handleSubmit: debounce(function (event) {
        const value = event.detail.value as FormStatus;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleChange(value);
    }, 100),

    // 修改管理员密码
    handleChange(value: FormStatus) {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在设置管理员密码：${value.passcode}` })
        requirePlugin("myPlugin", ({ modifyAdminPasscode }: TTLockPlugin) => {
            // 设置管理员密码
            modifyAdminPasscode({
                newPasscode: value.passcode,
                lockData: ekeyInfo.lockData
            }).then(res => {
                if (res.errorCode === 0) {
                    wx.showLoading({ title: "上传服务器中" });
                    this.setData({ state: `设置成功` })
                    LockAPI.changeAdminKeyboardPwd({
                        lockId: ekeyInfo.lockId, // 智能锁ID
                        password: value.passcode, // 管理员密码
                    }).then(res => {
                        if (HttpHandler.isResponseTrue(res)) {
                            this.data.keyInfo.noKeyPwd = value.passcode;
                            this.setData({ "keyInfo.noKeyPwd": value.passcode });
                            wx.setStorageSync("keyInfo", JSON.stringify(this.data.keyInfo));
                            wx.hideLoading();
                            HttpHandler.showErrorMsg("服务器上传成功");
                            setTimeout(wx.navigateBack, 2000);
                        } else {
                            HttpHandler.handleResponseError(res);
                            wx.hideLoading();
                        }
                    }).catch(err => {
                        HttpHandler.handleServerError(err);
                        wx.hideLoading();
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg(`管理员密码设置失败：${res.errorMsg}`);
                }
            })
        });
    },
})