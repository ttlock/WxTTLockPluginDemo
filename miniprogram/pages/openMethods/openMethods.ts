Page({
    data: {
        keyInfo: {}, // 钥匙数据
        specialValueObj: {}, // 智能锁特征值
    },
    onLoad() {
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        const specialValueObj = TTLockPlugin.parseSpecialValues(keyInfo?.featureValue);
        this.setData({ keyInfo, specialValueObj });
        wx.setNavigationBarTitle({ title: keyInfo.lockAlias });
    }
})