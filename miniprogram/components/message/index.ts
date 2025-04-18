// 错误提示组件
import debounce from "debounce";

interface MessageInfo {
    errMsg: string;
    id: string;
};

Component({
    properties: {
        value: String, // 提示信息(数据可能改变model:value)
        innerClass: {
            type: String,
            value: "fc-f fs-12"
        }, // 字体设置
    },
    data: {
        loaded: false, // 样式是否已加载完成
        list: []
    },
    lifetimes: {
        attached: function() {
            this._handleReady();
        },
    },
    attached: function() {
        this._handleReady();
    },
    observers: {
        value: function(newVal: string) {
            if (newVal && this.data.loaded) {
                this._message(newVal);
            }
        },
    },
    methods: {
        // 节点Mount
        _handleReady() {
            if (this.data.value) {
                this.message(this.data.value);
            } else this.setData({ loaded: true });
        },
        // 展示错误信息(内部调用)
        _message: debounce(function(message: string) {
            this.message(message);
        }, 100),
        // 展示错误信息
        message(errMsg: string) {
            const ID = `${Date.now()}-${parseInt(String(Math.random() * 1000000000))}`;
            const messageInfo: MessageInfo = {errMsg: errMsg, id: ID };
            this.data.list.push(messageInfo);
            this.setData({ list: this.data.list, loaded: true });
        },
        // 展示结束删除元素
        _animationEnd(event: WechatMiniprogram.BaseEvent<any, {index: number, id: string}>) {
            const index = event.target.dataset.index;
            this.data.list.splice(index, 1);
            this.setData({ list: this.data.list, value: "" });
        }
    }
})
