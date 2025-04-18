import debounce from "debounce";

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
// const getMinuteList = (useMinute: boolean = true) => {
const getMinuteList = () => {
    const list: Array<{value: number, text: string}> = [];
    // if (useMinute) {
        new Array(60).fill(0).forEach((item, index) => {
            list.push({ value: index, text: `${index}分`});
        });
    // } else {
    //     list.push({ value: 0, text: `0分`});
    // }
    return list;
};

Component({
    behaviors: ['wx://form-field'],
    properties: {
        name: String, // 参数名称
        value: Number, // 默认时间
        class: String, // 类名
        label: String, // 标题
        placeholder: String, // 提示语
        format: {
            type: String,
            value: "YYYY-MM-DD HH:mm"
        },
        useDatePicker: {
            type: Boolean,
            value: true,
        }, // 是否使用日期选择器
        useTimePicker: {
            type: Boolean,
            value: true,
        }, // 是否使用时间选择器
        useMinute: {
            type: Boolean,
            value: true
        }, // 是否需要分钟选择
        submitFormat: {
            type: String,
            value: "YYYY/MM/DD HH:mm:ss"
        }, // 提交日期
    },
    data: {
        dateTime: [],
        dateRange: [],
        dateTimeStr: "",
        currentValue: null,
    },

    lifetimes: {
        attached: function() {
            const value = this.data.value;
            const format = this.data.format;
            this._setValue = debounce(this._setValue, 100);
            this._setDefaultValue(value, format, "lifetimes");
        }
    },

    attached: function () {
        const value = this.data.value;
        const format = this.data.format;
        this._setValue = debounce(this._setValue, 100);
        this._setDefaultValue(value, format, "attached");
    },

    observers: {
        value: function (newVal, oldVal) { // value值修改
            this._setDefaultValue(newVal, this.data.format, "attached");
            // const dateTimeList = this._getDateIndex(newVal);
            // const dateRange = this._getDateRange(newVal);
            // const dateTimeStr = newVal > 0 ? dayjs(newVal).format(this.data.format) : "";
            // this.data.dateTime = dateTimeList;
            // this.data.dateTimeStr = dateTimeStr;
            // this.data.dateRange = dateRange;
            // this._setValue(dateTimeList, dateTimeStr, dateRange);
            // this.setData({ dateTime: dateTimeList, dateTimeStr: dateTimeStr, dateRange: dateRange });
        }
    },

    methods: {
        // 返回滚轮列表
        _getDateRange(time?: number) {
            const dateRange = [];
            if (this.data.useDatePicker) {
                dateRange.push(getYearList());
                dateRange.push(getMonthList());
                dateRange.push(getDateList(time > 0 ? dayjs(time).year() : undefined, time > 0 ? dayjs(time).month() : undefined));
            }
            if (this.data.useTimePicker) {
                dateRange.push(getHourList());
                if (this.data.useMinute) dateRange.push(getMinuteList());
            }
            return dateRange;
        },
        // 返回滚轮列表
        _getDateIndex(time?: number) {
            const dateTimeIndexList = [];
            if (!(time > 0)) return dateTimeIndexList;
            const dateTime = dayjs(time);
            if (this.data.useDatePicker) {
                dateTimeIndexList.push(dateTime.year() - 2000);
                dateTimeIndexList.push(dateTime.month());
                dateTimeIndexList.push(dateTime.date() - 1);
            }
            if (this.data.useTimePicker) {
                dateTimeIndexList.push(dateTime.hour());
                if (this.data.useMinute) dateTimeIndexList.push(dateTime.minute());
            }
            return dateTimeIndexList;
        },
        // 设置输入框输入值
        _setValue: function(dateTime, dateTimeStr, dateRange) {
            this.setData({ dateTime: dateTime, dateTimeStr: dateTimeStr, dateRange: dateRange });
        },
        // 设置默认值及下拉菜单
        _setDefaultValue: function (value?: number, format?: string, flag?: string) {
            const dateTimeList = this._getDateIndex(value);
            const dateRange = this._getDateRange(value);
            const dateTimeStr = value > 0 ? dayjs(value).format(format) : "";
            this._setValue(dateTimeList, dateTimeStr, dateRange);
        },
        // 更新日期选择器
        _handleColumnChange(event) {
            const column = event.detail.column as number;
            const value = event.detail.value as number;
            this.setData({ [`dateTime[${column}]`]: value }, () => {
                if (this.data.useDatePicker && (column === 0 || column === 1)) { // 修改年份或月份
                    this.setData({ [`dateRange[2]`]: getDateList((this.data.dateTime[0] || 0) + 2000, this.data.dateTime[1] || 0) });
                }
            });
        },
        // 更新时间戳
        _handleDateChange(event) {
            const value = event.detail.value;
            const now = dayjs();
            const dateStr = `${
                this.data.useDatePicker ? (2000 + (value[0]|| 0)) : now.year() }/${
                this.data.useDatePicker ? ((value[1] || 0) + 1) : now.month() }/${
                this.data.useDatePicker ? ((value[2] || 0) + 1) : (now.month() + 1)} ${
                this.data.useTimePicker ? (value[this.data.useDatePicker ? 3 : 0] || 0) : "00" }:${
                (this.data.useTimePicker && this.data.useMinute) ? (value[this.data.useDatePicker ? 4 : 1] || 0) : "00" }`;
            const dateValue = dayjs(dayjs(dateStr).format(this.data.submitFormat)).valueOf(); // 更新后时间戳
            this.setData({ value: dateValue, dateTimeStr: dayjs(dateValue).format(this.data.format)});
            this.triggerEvent("input", dateValue);
        }
    }
})
