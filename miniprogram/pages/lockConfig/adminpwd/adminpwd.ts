// 设置管理员密码
import * as LockAPI from "../../../api/interfaces/lock";
import * as HttpHandler from "../../../api/handle/httpHandler";

interface FormStatus {
    passcode?: string; // 管理员密码
}

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        passcode: "", // 管理员密码
    },
    onLoad() {
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        this.setData({
            keyInfo,
            passcode: keyInfo?.noKeyPwd
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错
    handleCheckInput(value: FormStatus) {
        if (!value?.passcode) {
            HttpHandler.showErrorMsg("请输入4-9位长度数字密码");
            return false;
        }
        else return true;
    },
    handleSubmit(event) {
        const value = event?.detail?.value as FormStatus;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleChange(value);
    },

    // 修改管理员密码
    async handleChange(value: FormStatus) {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在设置管理员密码：${value?.passcode}` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /* 修改管理员密码 */
            const result = await TTLockPlugin.modifyAdminPasscode({
                newPasscode: value?.passcode,
                lockData: ekeyInfo?.lockData,
            });
            if (result?.errorCode != 0) throw(result);

            wx.showLoading({ title: "上传服务器中" });
            this.setData({ state: `设置成功` })
            LockAPI.changeAdminKeyboardPwd({
                lockId: ekeyInfo?.lockId, // 智能锁ID
                password: value?.passcode, // 管理员密码
            }).then(res => {
                if (HttpHandler.isResponseTrue(res)) {
                    ekeyInfo.noKeyPwd = value?.passcode;
                    this.setData({ "keyInfo.noKeyPwd": value?.passcode });
                    wx.setStorageSync("keyInfo", JSON.stringify(ekeyInfo));
                    wx.hideLoading();
                    HttpHandler.showErrorMsg("服务器上传成功");
                    setTimeout(wx.navigateBack, 2000);
                } else {
                    wx.hideLoading();
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                wx.hideLoading();
                HttpHandler.handleServerError(err);
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("远程开关状态设置失败");
            this.setData({state: `远程开关状态设置失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },
})