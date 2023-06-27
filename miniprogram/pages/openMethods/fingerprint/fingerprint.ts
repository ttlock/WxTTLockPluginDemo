import API from "../../../api/API";

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        fingerprintList: [], // 指纹列表
        currentPageIndex: 0,
    },
    // 设置初始化参数
    onShow() {
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({ keyInfo: keyInfo }, () => {
            this.modifyFingerprintList();
        });
    },

    onPullDownRefresh() {
        this.modifyFingerprintList();
    },

    onReachBottom() {
        this.modifyFingerprintList(this.data.currentPageIndex + 1);
    },

    // 更新指纹列表
    modifyFingerprintList(pageIndex: number = 1) {
        API.listFingerprint({
            lockId: this.data.keyInfo.lockId,
            pageNo: pageIndex,
            pageSize: 20,
        }).then(res => {
            console.log(res);
            if (res) {
                const resultList = res.list.filter(item => item.fingerprintType === 1);
                if (pageIndex === 1) {
                    this.setData({
                        fingerprintList: resultList,
                        currentPageIndex: 1
                    });
                } else {
                    const list = this.data.fingerprintList;
                    resultList.forEach(item => list.push(item));
                    this.setData({
                        fingerprintList: list,
                        currentPageIndex: pageIndex
                    });
                }
                wx.stopPullDownRefresh();
            } else {
                wx.stopPullDownRefresh();
            }
        })
    },

    // 进入指纹管理页
    toDetail(event) {
        const fingerprintItem = JSON.stringify(event.target.dataset.value);
        wx.setStorageSync("fingerprintInfo", fingerprintItem);
        wx.navigateTo({
            url: "./manage/manage"
        })
    }
})