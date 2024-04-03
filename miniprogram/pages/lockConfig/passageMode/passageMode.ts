// 智能锁自动闭锁时间设置
import dayjs from "dayjs";
import debounce from "debounce";
import * as LockAPI from "../../../api/interfaces/lock";
import { HttpHandler } from "../../../api/handle/httpHandler";
import { Assert } from "../../../utils/assert";

interface FormStatus {
    passageModeSwitch?: boolean;
    isAllDays?: boolean;
    weekDays?: Array<string>;
    startDate?: number;
    endDate?: number;
}

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        passageDayList: [
            {value: 7, name: '周日', checked: false},
            {value: 1, name: '周一', checked: false},
            {value: 2, name: '周二', checked: false},
            {value: 3, name: '周三', checked: false},
            {value: 4, name: '周四', checked: false},
            {value: 5, name: '周五', checked: false},
            {value: 6, name: '周六', checked: false}
        ],
        passageModeSwitch: true, // 是否常开
        isAllDays: false, // 是否全天常开
        dateSpan: {}, // 有效期
        startDate: 0,
        endDate: 0,
    },
    onLoad() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({ keyInfo: keyInfo }, () => {
            this.handleUpdate();
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错
    handleInputStartDate(e) {
        console.log(e);
    },
    handleUpdateDateSpan(event) {
        this.data.dateSpan.startDate = event.detail.startDate;
        this.data.dateSpan.endDate = event.detail.endDate;
    },

    checkboxChange(event) {
    },

    handleUpdate: debounce(function() {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "" });
        LockAPI.getPassageModeConfig({
            lockId: ekeyInfo.lockId, // 智能锁ID
        }).then(res => {
            wx.hideLoading();
            if (HttpHandler.isResponseTrue(res)) {
                console.log(res)
                const option = {
                    passageModeSwitch: res.passageMode == 1 ? true : false, // 是否常开
                    isAllDays: res.isAllDay == 1 ? true : false, // 是否全天常开
                    startDate: res.startDate ? dayjs().startOf("day").add(res.startDate, "minute").valueOf() : dayjs().startOf("minute").valueOf(),
                    endDate: res.endDate ? dayjs().startOf("day").add(res.endDate, "minute").valueOf() :  dayjs().startOf("minute").add(1, "hour").valueOf(),
                };
                const weekDays = ((Assert.isString(res.weekDays) ? JSON.parse(res.weekDays) : res.weekDays) || []) as Array<number>;
                this.data.passageDayList.forEach((item, index) => {
                    if (weekDays.includes(parseInt(item.value))) {
                        option[`passageDayList[${index}].checked`] = true;
                    } else {
                        option[`passageDayList[${index}].checked`] = false;
                    }
                    option[`passageDayList[${index}].value`] = item.value;
                    option[`passageDayList[${index}].name`] = item.name;
                })
                this.setData(option);
            } else {
                HttpHandler.handleResponseError(res);
            }
        }).catch(err => {
            console.log(err)
            wx.hideLoading();
            HttpHandler.handleServerError(err);
        })
    }, 100),

    // 输入校验
    handleCheckInput(value: FormStatus) {
        if (!value.passageModeSwitch) return true;
        else if (!(value.weekDays.length > 0)) {
            HttpHandler.showErrorMsg(`请选择常开日`);
            return false;
        } else if (value.isAllDays) return true;
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
        const value = event.detail.value;
        console.log(value)
        const flag = this.handleCheckInput(value);
        if (!flag) return;
        this.handleChange(value);
    }, 100),

    /* 查询常开模式 */
    getPassageMode: debounce(function () {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在查询常开模式` })
        requirePlugin("myPlugin", ({ getPassageMode }: TTLockPlugin) => {
            getPassageMode({ lockData: ekeyInfo.lockData }).then(res => {
                if (res.errorCode == 0) {
                    wx.hideLoading();
                    const option = JSON.parse(JSON.stringify({
                        lockId: ekeyInfo.lockId, // 智能锁ID
                        passageMode: res.passageModeConfigList.length > 0 ? 1 : 2, // 常开模式开闭状态
                        startDate: res.passageModeConfigList.length > 0 ? res.passageModeConfigList[0].startDate : undefined,
                        endDate: res.passageModeConfigList.length > 0 ? res.passageModeConfigList[0].endDate : undefined,
                        isAllDay: res.passageModeConfigList.length > 0 ? (res.passageModeConfigList[0].startDate == 0 &&  res.passageModeConfigList[0].endDate == 1459 ? 1 : 2) : 2,
                        weekDays: res.passageModeConfigList.map(item => item.weekOrDay),
                        type: 1,
                    }));
                    this.setData({ state: `查询常开模式成功` });
                    LockAPI.configPassageMode(option).then(res => {
                        wx.hideLoading();
                        if (HttpHandler.isResponseTrue(res)) {
                            HttpHandler.showErrorMsg("已同步服务器")
                            this.handleUpdate();
                        } else {
                            HttpHandler.handleResponseError(res);
                        }
                    }).catch(err => {
                        wx.hideLoading();
                        HttpHandler.handleServerError(err);
                    })
                } else {
                    wx.hideLoading();
                    this.setData({ state: `查询常开模式失败：${res.errorMsg}` });
                }
            })
        });
    }, 100),


    handleChange: debounce(function(value: FormStatus) {
        const ekeyInfo = this.data.keyInfo as IEKeyAPI.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在清空常开模式` })
        
        requirePlugin("myPlugin", ({ clearPassageMode, configPassageMode }: TTLockPlugin) => {
            clearPassageMode({ lockData: ekeyInfo.lockData }).then(async res => {
                if (res.errorCode == 0) {
                    if (value.passageModeSwitch) {
                        this.setData({ state: `常开模式已清空，正在设置` });
                        const start = dayjs(value.startDate).hour() * 60 + dayjs(value.startDate).minute();
                        const end = dayjs(value.endDate).hour() * 60 + dayjs(value.endDate).minute();
                        const configRes = await configPassageMode({
                            config: {
                                type: 1,
                                repeatWeekOrDays: value.weekDays.map(item => parseInt(item)),
                                startDate: start,
                                endDate: end,
                            },
                            lockData: ekeyInfo.lockData
                        });
                        if (configRes.errorCode == 0) {
                            this.setData({ state: `常开模式已设置` });
                            this.getPassageMode();
                        } else {
                            wx.hideLoading();
                            this.setData({ state: `常开模式设置失败：${res.errorMsg}` });
                            return;
                        }
                    }
                } else {
                    wx.hideLoading();
                    this.setData({ state: `清空常开模式失败：${res.errorMsg}` });
                }
            })
        });
    }, 100)
})