// 管理密码
import * as KeyboardPwdAPI from "../../../../api/interfaces/keyboardPwd";
import * as HttpHandler from "../../../../api/handle/httpHandler";
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
        state: "",
    },
    onLoad() {
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        const passcodeInfo = JSON.parse(wx.getStorageSync('passcodeInfo') || "{}") as ILock.List.KeyboardPwdInfo;
        const startDate = dayjs().startOf("hour");
        this.setData({
            keyInfo: keyInfo,
            passcodeInfo: passcodeInfo,
            passcode: passcodeInfo?.keyboardPwd,
            permanent: passcodeInfo?.keyboardPwdType == 2,
            startDate: passcodeInfo?.keyboardPwdType === 2 ? startDate.valueOf() : passcodeInfo?.startDate,
            endDate: passcodeInfo?.keyboardPwdType === 2 ? startDate.add(1, "hour").valueOf() : passcodeInfo?.endDate
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错
    handleCheckInput(value: FormStatus) {
        if (!value?.passcode) { HttpHandler.showErrorMsg("请输入密码"); return false; }
        else if (value?.permanent) return true;
        else {
            const btnEl = this.selectComponent("#dateSpan");
            const errorMsg = btnEl.toCheckDateSpan();
            if (errorMsg) {
                HttpHandler.showErrorMsg(errorMsg)
                return false;
            } else return true;
        }
    },
    handleSubmit(event) {
        const value = event?.detail?.value as FormStatus;
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleModifyPasscode(value);
    },

    /** 修改密码 */
    async handleModifyPasscode(value: FormStatus) {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        const keyboardPwdInfo = this.data?.passcodeInfo as ILock.List.KeyboardPwdInfo;
        const start = Date.now();
        wx.showLoading({ title: "" });
        this.setData({ state: `正在修改密码及其有效期` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /** 修改密码及其有效期 */
            const result = await TTLockPlugin.modifyPasscode({
                originalPasscode: keyboardPwdInfo?.keyboardPwd,
                passcode: value?.passcode,
                startDate: value?.permanent ? 0 : value?.startDate,
                endDate: value?.permanent ? 0 : value?.endDate,
                lockData: ekeyInfo?.lockData
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);

            wx.showLoading({ title: "同步服务器中" });
            this.setData({ state: `密码及其有效期已修改, 正在上传, 操作时间: ${end - start}ms.` });
            KeyboardPwdAPI.change({
                lockId: ekeyInfo?.lockId,
                keyboardPwdId: keyboardPwdInfo?.keyboardPwdId,
                newKeyboardPwd: value?.passcode,
                keyboardPwdType: value?.permanent ? 2 : 3,
                startDate: value?.permanent ? 0 : value?.startDate,
                endDate: value?.permanent ? 0 : value?.endDate,
            }).then(res => {
                wx.hideLoading();
                if (HttpHandler.isResponseTrue(res)) {
                    this.setData({ state: `密码及其有效期修改成功, 操作时间: ${end - start}ms.` });
                    HttpHandler.showErrorMsg("密码及其有效期已修改成功");
                    setTimeout(wx.navigateBack, 2000);
                } else {
                    this.setData({ state: `密码及其有效期修改成功, 服务器同步失败, 操作时间: ${end - start}ms.` });
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                wx.hideLoading();
                this.setData({ state: `密码及其有效期修改成功, 服务器同步失败, 操作时间: ${end - start}ms.` });
                HttpHandler.handleServerError(err);
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("修改密码及其有效期失败");
            this.setData({state: `修改密码及其有效期失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },


    /** 删除密码 */
    async handleDelete() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        const keyboardPwdInfo = this.data?.passcodeInfo as ILock.List.KeyboardPwdInfo;
        const start = Date.now();
        wx.showLoading({ title: "" });
        this.setData({ state: `正在删除密码` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /** 删除密码 */
            const result = await TTLockPlugin.deletePasscode({
                passcode: keyboardPwdInfo?.keyboardPwd,
                lockData: ekeyInfo?.lockData
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);

            wx.showLoading({ title: "同步服务器中" });
            this.setData({ state: `密码已删除, 正在上传, 操作时间: ${end - start}ms.` });
            KeyboardPwdAPI.Delete({
                lockId: ekeyInfo?.lockId,
                keyboardPwdId: keyboardPwdInfo?.keyboardPwdId
            }).then(res => {
                wx.hideLoading();
                if (HttpHandler.isResponseTrue(res)) {
                    this.setData({ state: `密码已删除, 操作时间: ${end - start}ms.` });
                    HttpHandler.showErrorMsg("密码删除成功");
                    setTimeout(wx.navigateBack, 2000);
                } else {
                    this.setData({ state: `密码已删除, 服务器同步失败, 操作时间: ${end - start}ms.` });
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                wx.hideLoading();
                this.setData({ state: `密码已删除, 服务器同步失败, 操作时间: ${end - start}ms.` });
                HttpHandler.handleServerError(err);
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("删除密码失败");
            this.setData({state: `删除密码失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },
})