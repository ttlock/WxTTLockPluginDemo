// components/datespan-picker/datespan-picker.ts
Component({
    behaviors: ['wx://form-field'],
    /**
     * 组件的属性列表
     */
    properties: {
        value: Object, // 默认时间
        label: String, // 标题
        startPlaceholder: String, // 开始时间提示语
        endPlaceholder: String, // 结束提示语
        format: {
            type: String,
            value: "YYYY-MM-DD HH:mm"
        },
        useMinute: {
            type: Boolean,
            value: true
        }, // 是否需要分钟数
    },

    attached: function () {
        const value = this.data.value || {};
        this.setData({ startDate: value.startDate, endDate: value.endDate });
    },

    /**
     * 组件的初始数据
     */
    data: {
        startDate: undefined,
        endDate: undefined,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 修改开始时间
        _handleUpdateStartDate(event) {
            const startDate = event.detail;
            const endDate = this.data.endDate;
            this.setData({ startDate: startDate }, () => {
                this._handleChangeDateSpan(startDate, endDate);
            });
        },
        // 修改结束时间
        _handleUpdateEndDate(event) {
            const startDate = this.data.startDate;
            const endDate = event.detail;
            this.setData({ endDate: endDate }, () => {
                this._handleChangeDateSpan(startDate, endDate);
            });
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
            else if (endDate <= Date.now()) return "结束时间不能早于当前时间";
            else if (endDate <= startDate) return "开始时间不能晚于结束时间";
            else return "";
        }
    }
})
