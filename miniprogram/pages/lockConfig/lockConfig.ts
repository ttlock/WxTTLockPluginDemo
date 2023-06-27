import API from "../../api/API";
const plugin = requirePlugin("myPlugin");
let deviceId: string = ""; // 当前智能锁ID

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        specialValueObj: {}, // 智能锁特征值
    },
    // 设置初始化参数
    onLoad() {
        deviceId = "";
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        const specialValueObj = plugin.parseSpecialValues(keyInfo.featureValue || keyInfo.specialValue);
        this.setData({
            keyInfo: keyInfo,
            specialValueObj: specialValueObj
        });
    },
})