// 添加自定义密码
import debounce from "debounce";
import * as KeyboardPwdAPI from "../../../../api/interfaces/keyboardPwd";
import * as HttpHandler from "../../../../api/handle/httpHandler";
const dayjs = require("dayjs");

interface FormStatus {
    name?: string; // 密码名称
    passcode?: string; // 密码值
    permanent?: boolean; // 是否为永久密码
    startDate?: number;
    endDate?: number;
}

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据

        name: "", // 密码名称
        passcode: "", // 密码值
        permanent: true, // 永久开关
        startDate: 0,
        endDate: 0,
    },
    onLoad() {
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        const startDate = dayjs().startOf("hour");
        this.setData({
            keyInfo: keyInfo,
            startDate: startDate.valueOf(),
            endDate: startDate.add(1, "hour").valueOf()
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错
    handleCheckInput(event: FormStatus) {
        if (!event?.name) { HttpHandler.showErrorMsg("请输入密码名称"); return false; }
        else if (!event?.passcode) { HttpHandler.showErrorMsg("请输入自定义密码"); return false; }
        else if (event?.permanent) return true;
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
        this.handleAddPasscode(value);
    },

    /** 添加自定义密码 */
    async handleAddPasscode(value: FormStatus) {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        const start = Date.now();
        wx.showLoading({ title: "" });
        this.setData({ state: `正在添加自定义密码` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /** 添加自定义密码 */
            const result = await TTLockPlugin.createCustomPasscode({
                passcode: value?.passcode,
                startDate: value?.permanent ? 0 : value?.startDate,
                endDate: value?.permanent ? 0 : value?.endDate,
                lockData: ekeyInfo?.lockData
            });
            const end = Date.now();
            if (result?.errorCode != 0) throw(result);

            wx.showLoading({ title: "同步服务器中" });
            this.setData({ state: `自定义密码已添加, 正在上传, 操作时间: ${end - start}ms.` });
            KeyboardPwdAPI.add({
                lockId: ekeyInfo?.lockId,
                keyboardPwd: result?.passcode,
                keyboardPwdName: value?.name,
                keyboardPwdType: value?.permanent ? 2 : 3,
                startDate: value?.permanent ? dayjs().startOf("hour").valueOf() : value?.startDate,
                endDate: value?.permanent ? 0 : value?.endDate
            }).then(res => {
                wx.hideLoading();
                if (HttpHandler.isResponseTrue(res)) {
                    this.setData({ state: `自定义密码已添加, 操作时间: ${end - start}ms.` });
                    HttpHandler.showErrorMsg("自定义密码已添加");
                    setTimeout(wx.navigateBack, 2000);
                } else {
                    this.setData({ state: `自定义密码已添加, 服务器同步失败, 操作时间: ${end - start}ms.` });
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                wx.hideLoading();
                this.setData({ state: `自定义密码已添加, 服务器同步失败, 操作时间: ${end - start}ms.` });
                HttpHandler.handleServerError(err);
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("自定义密码添加失败");
            this.setData({state: `自定义密码添加失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },
})