// 添加指纹
import debounce from "debounce";
import * as FingerprintAPI from "../../../../api/interfaces/fingerprint";
import { HttpHandler } from "../../../../api/handle/httpHandler";
const dayjs = require("dayjs");

interface FormStatus {
    cardNo?: string; // IC卡号
    name?: string; // IC卡名称
    permanent?: boolean; // 是否为永久IC卡
    startDate?: number;
    endDate?: number;
}

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        name: "", // 指纹名称
        permanent: true, // 永久开关
        startDate: 0,
        endDate: 0,
    },
    // 设置初始化参数
    onLoad() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        const startDate = dayjs().startOf("minute");
        this.setData({
            keyInfo: keyInfo,
            startDate: startDate.valueOf(),
            endDate: startDate.add(1, "hour").endOf("minute").startOf("second").valueOf()
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错

    // 输入校验
    handleCheckInput(event: FormStatus) {
        console.log(event)
        if (!event.name) { HttpHandler.showErrorMsg("请输入指纹名称"); return false; }
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
        this.handleInitFinterprint(value);
    }, 100),

    // 添加指纹
    handleInitFinterprint(value: FormStatus) {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "正在添加指纹" });
        let totalCount = 0;
        requirePlugin("myPlugin", ({ addFingerprint }: TTLockPlugin) => {
            // addFingerprint(!value.permanent ? value.startDate : 0,
            //     !value.permanent ? value.endDate : 0,
            //     // lockData: ekeyInfo.lockData,
            //     "HgMkt4qAR1jun7os7iOrs8VQE20V+IRqD+2xX1edxF2Sww2ZZdjCUqli64YhlvWOJieTU3EpVdU0/6a2UfrzsY/QyCDwNQEddOBpMR25wVUmztdo75pLEhXDAgXFNQYFXGCdQ1a8IH35AF5YJpzcX+M6riFN0P9yQPp6m3YTZwdSgwubfTYE4jwHTQIR13YyxjvirCQ6qq6ET7IswRNtFMmQlSowV6EsdOc/W/2kcsaW1Zx6KGTAC0SXS0OO53hEZNLGb10JzPHT64rJ1y/fYydMk8EJdsM3tMbMqws/6/nTBtg23ZJ6x+gw9TdKv3vdoQWH+iuCbNM4wgWRirRwH6PSKjjYA/3omd2/4iKz/GcNQWERyEy5ZP3ZHZfguFkrqE+fq6nefjX9zbFBz14g+jXxKHO2AmyggoOPOZ8BVDUT0d3IWFqKxdByohhMAeSjPYpZ5lR0LcuxmKtlw2D0EwMrPojSlgBTQSKYJOVEYayMqPy/wGC4fvL/YWTL5mlpPngsdCfCE4er/p5Ho0+IRRHRzPJdobzqcTaymVzF5S679lwraHsNjZRlJkjamFosZaCYCfOE0I+2KLsaX7TwlSNbYAAZL+v8dl3kOh4XEPtAwUxt3QJe0Ac4K1O4RuSt/+fY74cyZz9i92QxdNo8lItBvn/bikH/frK9gc1S/GOrLE3XCb9tuOPM20AdqVySKqNnbdtLxRm8oG2wiHBW0U3PcBeZySOqWeazvbfNWYkwIv8fpxt+Qg2sraxD66pA19kxtXtA",
            // )
            // 添加指纹
            addFingerprint({
                startDate: !value.permanent ? value.startDate : 0,
                endDate: !value.permanent ? value.endDate : 0,
                // lockData: ekeyInfo.lockData,
                lockData: "HgMkt4qAR1jun7os7iOrs8VQE20V+IRqD+2xX1edxF2Sww2ZZdjCUqli64YhlvWOJieTU3EpVdU0/6a2UfrzsY/QyCDwNQEddOBpMR25wVUmztdo75pLEhXDAgXFNQYFXGCdQ1a8IH35AF5YJpzcX+M6riFN0P9yQPp6m3YTZwdSgwubfTYE4jwHTQIR13YyxjvirCQ6qq6ET7IswRNtFMmQlSowV6EsdOc/W/2kcsaW1Zx6KGTAC0SXS0OO53hEZNLGb10JzPHT64rJ1y/fYydMk8EJdsM3tMbMqws/6/nTBtg23ZJ6x+gw9TdKv3vdoQWH+iuCbNM4wgWRirRwH6PSKjjYA/3omd2/4iKz/GcNQWERyEy5ZP3ZHZfguFkrqE+fq6nefjX9zbFBz14g+jXxKHO2AmyggoOPOZ8BVDUT0d3IWFqKxdByohhMAeSjPYpZ5lR0LcuxmKtlw2D0EwMrPojSlgBTQSKYJOVEYayMqPy/wGC4fvL/YWTL5mlpPngsdCfCE4er/p5Ho0+IRRHRzPJdobzqcTaymVzF5S679lwraHsNjZRlJkjamFosZaCYCfOE0I+2KLsaX7TwlSNbYAAZL+v8dl3kOh4XEPtAwUxt3QJe0Ac4K1O4RuSt/+fY74cyZz9i92QxdNo8lItBvn/bikH/frK9gc1S/GOrLE3XCb9tuOPM20AdqVySKqNnbdtLxRm8oG2wiHBW0U3PcBeZySOqWeazvbfNWYkwIv8fpxt+Qg2sraxD66pA19kxtXtA",
                callback: (result) => {
                    console.log(result, "中间步骤")
                    switch (result.type) {
                    case 1: {
                        wx.showLoading({ title: `添加成功，正在上传` });
                        this.setData({ state: "指纹添加成功" });
                    }; break;
                    case 2:{
                        totalCount = result.totalCount;
                        wx.showLoading({ title: `请录入指纹, 0/${result.totalCount}` });
                        this.setData({ state: `${result.description}, 请录入指纹, 进度 0/${result.totalCount}` });
                    }; break;
                    case 3: {
                        wx.showLoading({ title: `请再录入指纹, ${result.currentCount}/${totalCount}` });
                        this.setData({ state: `${result.description}, 请录入指纹, 进度 ${result.currentCount}/${totalCount}` });
                    }; break;
                    case 4: {
                        wx.showLoading({ title: result.description });
                        this.setData({ state: result.description });
                    }; break;
                    default: {
                        wx.hideLoading();
                        HttpHandler.showErrorMsg(result.errorMsg);
                    }; break;
                    }
                },
            }).then(res => {
                if (res.errorCode === 0) {
                    wx.showLoading({ title: "添加成功，正在上传" });
                    console.log(`指纹已添加, 正在上传`);
                    FingerprintAPI.add({
                        lockId: ekeyInfo.lockId,
                        fingerprintName: value.name,
                        fingerprintNumber: res.fingerprintNum,
                        fingerprintType: 1,
                        startDate: !value.permanent ? value.startDate : 0,
                        endDate: !value.permanent ? value.endDate : 0,
                    }).then(res => {
                        console.log(res);
                        if (HttpHandler.isResponseTrue(res)) {
                            wx.hideLoading();
                            HttpHandler.showErrorMsg("指纹已添加成功");
                            setTimeout(wx.navigateBack, 2000);
                        } else {
                            HttpHandler.handleResponseError(res);
                            wx.hideLoading();
                            console.log(`上传失败, 指纹已添加`);
                        }
                    }).catch(err => {
                        HttpHandler.handleServerError(err);
                        wx.hideLoading();
                    })
                } else {
                    wx.hideLoading();
                    HttpHandler.showErrorMsg(`指纹添加失败：${res.errorMsg}`);
                }
            })
        });
    },
})