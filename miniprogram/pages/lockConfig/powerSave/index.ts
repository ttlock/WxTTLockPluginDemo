// 智能锁省电模式开启时间设置
import dayjs from "dayjs";
import debounce from "debounce";
import * as LockAPI from "../../../api/interfaces/lock";
import * as HttpHandler from "../../../api/handle/httpHandler";
import * as Assert from "../../../utils/assert";

interface FormStatus {
    powerSavingSwitch?: boolean;
    isAllDays?: boolean;
    weekDays?: Array<string>;
    startDate?: number;
    endDate?: number;
}

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        powerSaveDayList: [
            {value: 7, name: '周日', checked: false},
            {value: 1, name: '周一', checked: false},
            {value: 2, name: '周二', checked: false},
            {value: 3, name: '周三', checked: false},
            {value: 4, name: '周四', checked: false},
            {value: 5, name: '周五', checked: false},
            {value: 6, name: '周六', checked: false}
        ],
        powerSavingSwitch: true, // 是否开启
        isAllDays: false, // 是否全天
        dateSpan: {}, // 有效期
        startDate: 0,
        endDate: 0,
    },
    onLoad() {
        const keyInfo: IEKey.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({ keyInfo: keyInfo }, () => {
            this.handleUpdate();
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错

    handleUpdate: debounce(function() {
        const ekeyInfo = this.data.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        LockAPI.getWifiConfig({
            lockId: ekeyInfo.lockId, // 智能锁ID
        }).then(res => {
            wx.hideLoading();
            if (HttpHandler.isResponseTrue(res)) {
                console.log(res)
                const option = {
                    powerSavingSwitch: res?.powerSavingMode == 1 ? true : false, // 是否常开
                    isAllDays: res.isAllDay == 1 ? true : false, // 是否全天常开
                    startDate: res.startDate ? dayjs().startOf("day").add(res.startDate, "minute").valueOf() : dayjs().startOf("minute").valueOf(),
                    endDate: res.endDate ? dayjs().startOf("day").add(res.endDate, "minute").valueOf() :  dayjs().startOf("minute").add(1, "hour").valueOf(),
                };
                const weekDays = ((Assert.isString(res.weekDays) ? JSON.parse(res.weekDays) : res.weekDays) || []) as Array<number>;
                this.data.powerSaveDayList.forEach((item, index) => {
                    if (weekDays.includes(parseInt(item.value))) {
                        option[`powerSaveDayList[${index}].checked`] = true;
                    } else {
                        option[`powerSaveDayList[${index}].checked`] = false;
                    }
                    option[`powerSaveDayList[${index}].value`] = item.value;
                    option[`powerSaveDayList[${index}].name`] = item.name;
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
        if (!value.powerSavingSwitch) return true;
        else if (!(value.weekDays.length > 0)) {
            HttpHandler.showErrorMsg(`请选择开启日`);
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

    /* 查询省电模式 */
    getPowerSavingMode: debounce(function () {
        const ekeyInfo = this.data.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在查询省电模式开启状态` })
        requirePlugin("myPlugin", ({ getWifiPowerSavingTime }: TTLockPlugin) => {
            getWifiPowerSavingTime({ lockData: ekeyInfo.lockData }).then(res => {
                if (res.errorCode == 0) {
                    wx.hideLoading();
                    this.setData({ state: `查询省电模式成功` });
                    LockAPI.updateSetting({
                        lockId: ekeyInfo.lockId, // 智能锁ID
                        type: 10, // 要修改的项
                        value: res?.configs?.length > 0 ? 1 : 2, // 设置值: 1-开启、2-关闭;
                        changeType: 1,
                         // 修改方式
                    }).then(res => {
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
        const ekeyInfo = this.data.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在清空常开模式` })
        
        requirePlugin("myPlugin", ({ clearWifiPowerSavingTime, configWifiPowerSavingTime }: TTLockPlugin) => {
            clearWifiPowerSavingTime({ lockData: ekeyInfo.lockData }).then(async res => {
                if (res.errorCode == 0) {
                    if (value.powerSavingSwitch) {
                        this.setData({ state: `模式已清空，正在设置` });
                        const start = dayjs(value.startDate).hour() * 60 + dayjs(value.startDate).minute();
                        const end = dayjs(value.endDate).hour() * 60 + dayjs(value.endDate).minute();
                        const configRes = await configWifiPowerSavingTime({
                            config: {
                                type: 1,
                                weekDays: value.weekDays.map(item => parseInt(item)),
                                startDate: this.data.isAllDays ? 0 : start,
                                endDate: this.data.isAllDays ? 0 : end,
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
                    } else {
                        this.setData({ state: `常开模式已设置` });
                        this.getPassageMode();
                    }
                } else {
                    wx.hideLoading();
                    this.setData({ state: `清空常开模式失败：${res.errorMsg}` });
                }
            })
        });
    }, 100)
})