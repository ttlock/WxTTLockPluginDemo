// 智能锁自动闭锁时间设置
import dayjs from "dayjs";
import debounce from "debounce";
import * as LockAPI from "../../../api/interfaces/lock";
import * as HttpHandler from "../../../api/handle/httpHandler";
import * as Assert from "../../../utils/assert";

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
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        this.setData({ keyInfo }, () => {
            this.handleUpdate();
        });
    },
    handleInputEmpty() {}, // 解决绑定数据输入报错
    handleCheckInput(value: FormStatus) {
        if (!value?.passageModeSwitch) return true;
        else if (!(value?.weekDays?.length > 0)) {
            HttpHandler.showErrorMsg(`请选择常开日`);
            return false;
        } else if (value?.isAllDays) return true;
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
        this.handleChange(value);
    },
    /** 查询服务器设置状态 */
    handleUpdate() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        LockAPI.getPassageModeConfig({
            lockId: ekeyInfo?.lockId, // 智能锁ID
        }).then(res => {
            wx.hideLoading();
            if (HttpHandler.isResponseTrue(res)) {
                const option = {
                    passageModeSwitch: res?.passageMode == 1 ? true : false, // 是否常开
                    isAllDays: res?.isAllDay == 1 ? true : false, // 是否全天常开
                    startDate: res?.startDate ? dayjs().startOf("day").add(res?.startDate, "minute").valueOf() : dayjs().startOf("minute").valueOf(),
                    endDate: res?.endDate ? dayjs().startOf("day").add(res?.endDate, "minute").valueOf() :  dayjs().startOf("minute").add(1, "hour").valueOf(),
                };
                const weekDays = ((Assert.isString(res?.weekDays) ? JSON.parse(res?.weekDays) : res?.weekDays) || []) as Array<number>;
                const list = this.data?.passageDayList || [];
                list.forEach((item, index) => {
                    if (weekDays.includes(parseInt(item?.value))) {
                        option[`passageDayList[${index}].checked`] = true;
                    } else {
                        option[`passageDayList[${index}].checked`] = false;
                    }
                    option[`passageDayList[${index}].value`] = item?.value;
                    option[`passageDayList[${index}].name`] = item?.name;
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
    },

    /* 查询锁内常开模式设置状态 */
    async getPassageMode() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        this.setData({ state: `正在查询智能锁常开模式设置` })
        wx.showLoading({ title: "" });
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /* 查询智能锁常开模式设置 */
            const result = await TTLockPlugin.getPassageMode({
                lockData: ekeyInfo?.lockData,
            });
            if (result?.errorCode != 0) throw(result);

            wx.showLoading({ title: "上传服务器中" });
            this.setData({ state: `查询智能锁常开模式设置成功` })
            const option = JSON.parse(JSON.stringify({
                lockId: ekeyInfo.lockId, // 智能锁ID
                passageMode: result?.passageModeConfigList?.length > 0 ? 1 : 2, // 常开模式开闭状态
                startDate: result?.passageModeConfigList?.length > 0 ? result?.passageModeConfigList[0].startDate : undefined,
                endDate: result?.passageModeConfigList?.length > 0 ? result?.passageModeConfigList[0].endDate : undefined,
                isAllDay: result?.passageModeConfigList?.length > 0 ? ((result?.passageModeConfigList[0]?.startDate == 0 && result?.passageModeConfigList[0]?.endDate == 0) ? 1 : 2) : 2,
                weekDays: result?.passageModeConfigList?.map(item => item?.weekOrDay),
                type: 1,
            }));
            LockAPI.configPassageMode(option).then(res => {
                if (HttpHandler.isResponseTrue(res)) {
                    HttpHandler.showErrorMsg("已同步服务器")
                    this.handleUpdate();
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
            HttpHandler.showErrorMsg("查询智能锁常开模式设置失败");
            this.setData({state: `查询智能锁常开模式设置失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },


    /* 修改常开模式设置状态 */
    async handleChange(value: FormStatus) {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        const start = value?.isAllDays ? 0 : (dayjs(value?.startDate).hour() * 60 + dayjs(value?.startDate).minute()); // 3.1.0开始，全天设置传入0
        const end = value?.isAllDays ? 0 : (dayjs(value?.endDate).hour() * 60 + dayjs(value?.endDate).minute()); // 3.1.0开始，全天设置传入0
        wx.showLoading({ title: "" });
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;
        
        try {
            /* 清空常开模式设置 */
            this.setData({ state: `正在清空常开模式设置` })
            const clearResult = await TTLockPlugin.clearPassageMode({
                lockData: ekeyInfo?.lockData,
            });
            if (clearResult?.errorCode != 0) throw(clearResult);

            /* 设置常开模式设置 */
            this.setData({ state: `常开模式已清空，正在设置` })
            const configResult = await TTLockPlugin.configPassageMode({
                config: {
                    type: 1,
                    repeatWeekOrDays: (value?.weekDays || []).map(item => parseInt(item)),
                    startDate: start,
                    endDate: end,
                },
                lockData: ekeyInfo?.lockData,
            });
            if (configResult?.errorCode != 0) throw(configResult);

            this.setData({ state: `常开模式设置成功` })
            this.getPassageMode();
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("修改智能锁常开模式设置失败");
            this.setData({state: `修改智能锁常开模式设置失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    }
})