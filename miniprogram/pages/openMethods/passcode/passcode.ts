import API from "../../../api/API";
const plugin = requirePlugin("myPlugin");
let deviceId: string = ""; // 当前智能锁ID

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        specialValueObj: {}, // 智能锁特征值
        passcodeList: [], // 密码列表
        currentPageIndex: 0,
    },
    // 设置初始化参数
    onShow() {
        deviceId = "";
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        const specialValueObj = plugin.parseSpecialValues(keyInfo.featureValue || keyInfo.specialValue);
        this.setData({
            keyInfo: keyInfo,
            specialValueObj: specialValueObj
        }, () => {
            this.modifyPasscodeList();
        });
    },

    onPullDownRefresh() {
        this.modifyPasscodeList();
    },

    onReachBottom() {
        this.modifyPasscodeList(this.data.currentPageIndex + 1);
    },

    // 更新密码列表
    modifyPasscodeList(pageIndex: number = 1) {
        API.listKeyboardPwd({
            lockId: this.data.keyInfo.lockId,
            pageNo: pageIndex,
            pageSize: 20,
        }).then(res => {
            console.log(res);
            if (res) {
                const resultList = res.list.filter(item => item.keyboardPwdVersion === 4 && [2, 3].includes(item.keyboardPwdType));
                if (pageIndex === 1) {
                    this.setData({
                        passcodeList: resultList,
                        currentPageIndex: 1
                    });
                } else {
                    const list = this.data.passcodeList;
                    resultList.forEach(item => list.push(item));
                    this.setData({
                        passcodeList: list,
                        currentPageIndex: pageIndex
                    });
                }
                wx.stopPullDownRefresh();
            } else {
                wx.stopPullDownRefresh();
            }
        })
    },

    // 进入密码管理页
    toDetail(event) {
        const passcodeItem = JSON.stringify(event.target.dataset.value);
        wx.setStorageSync("passcodeInfo", passcodeItem);
        wx.navigateTo({
            url: "./manage/manage"
        })
    }
})