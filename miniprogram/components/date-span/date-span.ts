import debounce from "debounce";

// components/datespan-picker/datespan-picker.ts
Component({
    behaviors: ['wx://form-field-group'],
    properties: {
        startDate: Number, // 有效期开始时间
        endDate: Number, // 有效期结束时间
        startName: {
            type: String,
            value: "startDate"
        }, // 开始时间名称
        endName: {
            type: String,
            value: "endDate"
        }, // 结束时间名称
        value: Object, // 默认时间
        label: String, // 标题
        startPlaceholder: String, // 开始时间提示语
        endPlaceholder: String, // 结束提示语
        format: {
            type: String,
            value: "YYYY-MM-DD HH:mm"
        }, // 日期显示格式
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
        startSubmitFormat: {
            type: String,
            value: "YYYY/MM/DD HH:mm:00"
        }, // 提交日期
        endSubmitFormat: {
            type: String,
            value: "YYYY/MM/DD HH:mm:59"
        }, // 提交日期
    },

    lifetimes: {
        attached: function() {
            this._setDefaultValue = debounce(this._setDefaultValue, 100);
            this._handleChangeDateSpan = debounce(this._handleChangeDateSpan, 100);
            this._setDefaultValue(this.data.startDate, this.data.endDate);
            // this.setData({ startDate: value.startDate, endDate: value.endDate });
        }
    },

    attached: function () {
        this._setDefaultValue = debounce(this._setDefaultValue, 100);
        this._handleChangeDateSpan = debounce(this._handleChangeDateSpan, 100);
        this._setDefaultValue(this.data.startDate, this.data.endDate);
        // const value = this.data.value || {};
        // this.setData({ startDate: value.startDate, endDate: value.endDate });
    },

    data: {
        currentStartDate: 0,
        currentEndDate: 0,
    },

    observers: {
        startDate: function (newVal, oldVal) { // value值修改
            this._setDefaultValue(newVal, this.data.endDate, "setStartDate");
        },
        endDate: function (newVal, oldVal) { // value值修改
            this._setDefaultValue(this.data.endDate, newVal, "setEndDate");
        }
    },

    methods: {
        // 设置默认有效期attached
        _setDefaultValue(startDate?: number, endDate?: number, flag?: string) {
        },
        // 修改开始时间
        _handleUpdateStartDate(event) {
            const startDate = event.detail;
            const endDate = this.data.endDate;
            this._handleChangeDateSpan(startDate, endDate);
            // this.setData({ startDate: startDate }, () => {
            //     this._handleChangeDateSpan(startDate, endDate);
            // });
        },
        // 修改结束时间
        _handleUpdateEndDate(event) {
            const startDate = this.data.startDate;
            const endDate = event.detail;
            this._handleChangeDateSpan(startDate, endDate);
        },
        // 修改结果
        _handleChangeDateSpan(startDate?: number, endDate?: number) {
            this.triggerEvent("update", {
                startDate: startDate,
                endDate: endDate,
            });
        },
        // 验证参数是否符合要求
        toCheckDateSpan() {
            const startDate = this.data.startDate;
            const endDate = this.data.endDate;
            if (!startDate) return "请选择开始时间";
            else if (!endDate) return "请选择结束时间";
            // else if (endDate <= Date.now()) return "结束时间不能早于当前时间";
            else if (endDate <= startDate) return "开始时间不能晚于结束时间";
            else return "";
        }
    }
})
