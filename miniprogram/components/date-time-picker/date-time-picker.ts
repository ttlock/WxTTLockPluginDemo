// 日期时间选择器
const dayjs = require("dayjs");

const now = dayjs();
const getYearList = () => {
    const list: Array<{value: number, text: string}> = [];
    new Array(100).fill(0).forEach((item, index) => {
        list.push({ value: index + 2000, text: `${index + 2000}年`});
    });
    return list;
};
const getMonthList = () => {
    const list: Array<{value: number, text: string}> = [];
    new Array(12).fill(0).forEach((item, index) => {
        list.push({ value: index, text: `${index + 1}月`});
    });
    return list;
};
const getDateList = (year: number = 2000, month: number = 0) => {
    const date = dayjs(`${year}/${month + 1}/01`).endOf("month").date();
    const list: Array<{value: number, text: string}> = [];
    new Array(date).fill(0).forEach((item, index) => {
        list.push({ value: index + 1, text: `${index + 1}日`});
    });
    return list;
};
const getHourList = () => {
    const list: Array<{value: number, text: string}> = [];
    new Array(24).fill(0).forEach((item, index) => {
        list.push({ value: index, text: `${index}时`});
    });
    return list;
};
const getMinuteList = (useMinute: boolean = true) => {
    const list: Array<{value: number, text: string}> = [];
    if (useMinute) {
        new Array(60).fill(0).forEach((item, index) => {
            list.push({ value: index, text: `${index}分`});
        });
    } else {
        list.push({ value: 0, text: `0分`});
    }
    return list;
};

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        value: Number, // 默认时间
        class: String, // 类名
        label: String, // 标题
        placeholder: String, // 提示语
        format: {
            type: String,
            value: "YYYY-MM-DD HH:mm"
        },
        useMinute: {
            type: Boolean,
            value: true
        }, // 是否需要分钟数
        endMinute: Boolean, // 是否使用最后一秒
    },

    /**
     * 组件的初始数据
     */
    data: {
        dateTime: [],
        dateRange: [],
        dateTimeStr: "",
        currentValue: null,
    },

    attached: function () {
        const value = this.data.value;
        const useMinute = this.data.useMinute;
        const format = this.data.format;
        this._setDefaultValue(value, useMinute, format);
    },

    observers: {
        value: function (newVal, oldVal) {
            if (newVal !== this.data.currentValue) {
                if (!newVal && !this.data.currentValue) return;
                const newValStr = newVal ? dayjs(newVal).format("YYYY/MM/DD HH:mm") : "";
                const currentValueStr = this.data.currentValue ? dayjs(this.data.currentValue).format("YYYY/MM/DD HH:mm") : "";
                if (newValStr === currentValueStr) return;
                const useMinute = this.data.useMinute;
                const format = this.data.format;
                this._setDefaultValue(newVal, useMinute, format);
            }
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 设置默认值及下拉菜单
        _setDefaultValue(value?: number, useMinute?: boolean, format?: string) {
            if (value && value > 0) {
                const dateTime = dayjs(value);
                const dateTimeIndexList = [
                    dateTime.year() - 2000,
                    dateTime.month(),
                    dateTime.date() - 1,
                    dateTime.hour(),
                    useMinute ? dateTime.minute() : 0
                ];
                const dateRange = [
                    getYearList(),
                    getMonthList(),
                    getDateList(dateTime.year(), dateTime.month()),
                    getHourList(),
                    getMinuteList(useMinute)
                ];
                const dateTimeStr = dateTime.format(format);
                this.setData({
                    dateTime: dateTimeIndexList,
                    dateTimeStr: dateTimeStr,
                    dateRange: dateRange,
                    currentValue: dateTime.valueOf(),
                });
            } else {
                const dateRange = [
                    getYearList(),
                    getMonthList(),
                    getDateList(),
                    getHourList(),
                    getMinuteList(useMinute)
                ];
                this.setData({
                    dateTime: [],
                    dateTimeStr: "",
                    dateRange: dateRange,
                    currentValue: null,
                });
            }
        },
        // 更新日期选择器
        _handleColumnChange(event) {
            const column = event.detail.column;
            const value = event.detail.value;
            this.setData({ [`dateTime[${column}]`]: value }, () => {
                if (column === 0 || column === 1) {
                    this.setData({
                        [`dateRange[2]`]: getDateList((this.data.dateTime[0] || 0) + 2000, this.data.dateTime[1] || 0)
                    });
                }
            });
        },
        // 更新时间戳
        _handleDateChange(event) {
            const value = event.detail.value;
            const dateStr = `${2000 + (value[0]|| 0)}/${(value[1] || 0) + 1}/${(value[2] || 0) + 1} ${value[3] || 0}:${value[4]||0}`;
            const dateValue = this.data.endMinute ? dayjs(dateStr).endOf("minute") : dayjs(dateStr);
            this.setData({
                currentValue: dateValue.valueOf(),
                dateTimeStr: dateValue.format(this.data.format),
            });
            this.triggerEvent("input", dateValue.valueOf());
        }
    }
})
