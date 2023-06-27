import API from "../../../api/API";

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        cardList: [], // IC卡列表
        currentPageIndex: 0,
    },
    // 设置初始化参数
    onShow() {
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        this.setData({ keyInfo: keyInfo }, () => {
            this.modifyCardList();
        });
    },

    onPullDownRefresh() {
        this.modifyCardList();
    },

    onReachBottom() {
        this.modifyCardList(this.data.currentPageIndex + 1);
    },

    // 更新IC卡列表
    modifyCardList(pageIndex: number = 1) {
        API.listIdentityCard({
            lockId: this.data.keyInfo.lockId,
            pageNo: pageIndex,
            pageSize: 20,
        }).then(res => {
            console.log(res);
            if (res) {
                const resultList = res.list.filter(item => item.cardType === 1);
                if (pageIndex === 1) {
                    this.setData({
                        cardList: resultList,
                        currentPageIndex: 1
                    });
                } else {
                    const list = this.data.cardList;
                    resultList.forEach(item => list.push(item));
                    this.setData({
                        cardList: list,
                        currentPageIndex: pageIndex
                    });
                }
                wx.stopPullDownRefresh();
            } else {
                wx.stopPullDownRefresh();
            }
        })
    },

    // 进入IC卡管理页
    toDetail(event) {
        const cardItem = JSON.stringify(event.target.dataset.value);
        wx.setStorageSync("cardInfo", cardItem);
        wx.navigateTo({
            url: "./manage/manage"
        })
    }
})