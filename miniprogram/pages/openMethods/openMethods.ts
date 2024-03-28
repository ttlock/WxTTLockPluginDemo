Page({
    data: {
        keyInfo: {}, // 钥匙数据
        specialValueObj: {}, // 智能锁特征值
    },
    // 设置初始化参数
    onLoad() {
        const keyInfo: IEKeyAPI.List.EKeyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({ keyInfo: keyInfo });
        requirePlugin("myPlugin", ({ parseSpecialValues }: TTLockPlugin) => {
            const specialValueObj = parseSpecialValues(keyInfo.featureValue);
            this.setData({ specialValueObj: specialValueObj });
        })
        wx.setNavigationBarTitle({ title: keyInfo.lockAlias });
    },
})