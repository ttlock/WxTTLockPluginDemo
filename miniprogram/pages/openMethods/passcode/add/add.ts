// 添加自定义密码
import debounce from "debounce";
import * as KeyboardPwdAPI from "../../../../api/interfaces/keyboardPwd";
import { HttpHandler } from "../../../../api/handle/httpHandler";
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
        dateSpan: {}, // 有效期
    },
    // 设置初始化参数
    onLoad() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
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
    handleCheckInput(event: FormStatus) {
        if (!event.name) { HttpHandler.showErrorMsg("请输入密码名称"); return false; }
        else if (!event.passcode) { HttpHandler.showErrorMsg("请输入自定义密码"); return false; }
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
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleAddPasscode(value);
    }, 100),

    // 点击添加自定义密码
    handleAddPasscode(value: FormStatus) {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        const start = Date.now();
        wx.showLoading({ title: "正在设置自定义密码" });
        requirePlugin("myPlugin", ({ createCustomPasscode }: TTLockPlugin) => {
            // 添加自定义密码
            createCustomPasscode({
                passcode: value.passcode,
                startDate: value.permanent ? 0 : value.startDate,
                endDate: value.permanent ? 0 : value.endDate,
                lockData: ekeyInfo.lockData
            }).then(res => {
                if (res.errorCode == 0) {
                    wx.showLoading({ title: "添加成功，正在上传" });
                    console.log(`自定义密码已添加, 正在上传, 操作时间: ${Date.now() - start}ms.`);
                    KeyboardPwdAPI.add({
                        lockId: ekeyInfo.lockId,
                        keyboardPwd: res.passcode,
                        keyboardPwdName: value.name,
                        keyboardPwdType: value.permanent ? 2 : 3,
                        startDate: !value.permanent ? value.startDate : undefined,
                        endDate: !value.permanent ? value.endDate : undefined,
                    }).then(res => {
                        console.log(res);
                        if (HttpHandler.isResponseTrue(res)) {
                            wx.hideLoading();
                            HttpHandler.showErrorMsg("密码已添加成功");
                            setTimeout(wx.navigateBack, 2000);
                        } else {
                            HttpHandler.handleResponseError(res);
                            wx.hideLoading();
                            console.log(`自定义密码上传失败, 密码已添加`);
                        }
                    }).catch(err => {
                        HttpHandler.handleServerError(err);
                        wx.hideLoading();
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg(`自定义密码添加失败：${res.errorMsg}`);
                }
            })
        });
    },
})