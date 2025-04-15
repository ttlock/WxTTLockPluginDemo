// 管理指纹
import debounce from "debounce";
import * as FingerprintAPI from "../../../../api/interfaces/fingerprint";
import * as HttpHandler from "../../../../api/handle/httpHandler";
const dayjs = require("dayjs");

interface FormStatus {
    permanent?: boolean; // 是否为永久指纹
    startDate?: number;
    endDate?: number;
}

Page({
    data: {
        keyInfo: {}, // 钥匙数据
        fingerprintInfo: {}, // 指纹数据
        permanent: true, // 永久开关
        startDate: 0,
        endDate: 0,
    },
    // 设置初始化参数
    onLoad() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        const fingerprintInfo: IFingerprintAPI.List.FingerprintInfo = JSON.parse(wx.getStorageSync('fingerprintInfo'));
        const startDate = dayjs().startOf("minute");
        const permanent = fingerprintInfo.startDate === 0 && fingerprintInfo.endDate === 0;
        this.setData({
            keyInfo: keyInfo,
            fingerprintInfo: fingerprintInfo,
            permanent: permanent,
            startDate: permanent ? startDate.valueOf() : fingerprintInfo.startDate,
            endDate: permanent ? startDate.add(1, "hour").endOf("minute").startOf("second").valueOf() : fingerprintInfo.endDate
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错
    handleUpdateDateSpan(event) {
        this.data.dateSpan.startDate = event.detail.startDate;
        this.data.dateSpan.endDate = event.detail.endDate;
    },

    // 输入校验
    handleCheckInput(value: FormStatus) {
        if (value.permanent) return true;
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
        this.handleModifyFinerprint(value);
    }, 100),

    // 点击修改指纹
    handleModifyFinerprint(value: FormStatus) {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        const fingerprintInfo = this.data.fingerprintInfo as IFingerprintAPI.List.FingerprintInfo;
        const start = Date.now();
        wx.showLoading({ title: "正在修改指纹有效期" });
        requirePlugin("myPlugin", ({ modifyFingerprintValidityPeriod }: TTLockPlugin) => {
            // 修改指纹
            modifyFingerprintValidityPeriod({
                fingerprintNum: parseInt(fingerprintInfo.fingerprintNumber),
                startDate: value.permanent ? 0 : value.startDate,
                endDate: value.permanent ? 0 : value.endDate,
                lockData: ekeyInfo.lockData
            }).then(res => {
                if (res.errorCode == 0) {
                    wx.showLoading({ title: "修改成功，正在上传" });
                    console.log(`指纹已修改, 正在上传, 操作时间: ${Date.now() - start}ms.`);
                    FingerprintAPI.changePeriod({
                        lockId: ekeyInfo.lockId,
                        fingerprintId: fingerprintInfo.fingerprintId,
                        startDate: value.permanent ? 0 : value.startDate,
                        endDate: value.permanent ? 0 : value.endDate,
                    }).then(res => {
                        console.log(res);
                        if (HttpHandler.isResponseTrue(res)) {
                            wx.hideLoading();
                            HttpHandler.showErrorMsg("指纹已修改成功");
                            setTimeout(wx.navigateBack, 2000);
                        } else {
                            HttpHandler.handleResponseError(res);
                            wx.hideLoading();
                            console.log(`上传失败, 指纹已修改`);
                        }
                    }).catch(err => {
                        HttpHandler.handleServerError(err);
                        wx.hideLoading();
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg(`指纹有效期修改失败：${res.errorMsg}`);
                }
            })
        })
    },


    // 删除指纹
    handleDelete() {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        const fingerprintInfo = this.data.fingerprintInfo as IFingerprintAPI.List.FingerprintInfo;
        const start = Date.now();
        wx.showLoading({ title: "正在删除指纹" });
        requirePlugin("myPlugin", ({ deleteFingerprint }: TTLockPlugin) => {
            // 删除指纹
            deleteFingerprint({
                fingerprintNum: parseInt(fingerprintInfo.fingerprintNumber),
                lockData: ekeyInfo.lockData,
            }).then(res => {
                if (res.errorCode == 0) {
                    wx.showLoading({ title: "删除成功，正在上传" });
                    console.log(`指纹已删除, 正在上传, 操作时间: ${Date.now() - start}ms.`);
                    FingerprintAPI.Delete({
                        lockId: ekeyInfo.lockId,
                        fingerprintId: fingerprintInfo.fingerprintId,
                    }).then(res => {
                        console.log(res);
                        if (HttpHandler.isResponseTrue(res)) {
                            wx.hideLoading();
                            HttpHandler.showErrorMsg("指纹已删除");
                            setTimeout(wx.navigateBack, 2000);
                        } else {
                            HttpHandler.handleResponseError(res);
                            wx.hideLoading();
                            console.log(`上传失败, 指纹已删除`);
                        }
                    }).catch(err => {
                        HttpHandler.handleServerError(err);
                        wx.hideLoading();
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg(`指纹删除失败：${res.errorMsg}`);
                }
            });
        });
    },
})