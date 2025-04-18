import * as IdentityCardAPI from "../../../api/interfaces/identityCard";
import * as HttpHandler from "../../../api/handle/httpHandler";

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        cardList: [], // IC卡列表
        currentPageIndex: 0
    },
    onShow() {
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        wx.setNavigationBarTitle({ title: keyInfo?.lockAlias });
        this.setData({ keyInfo }, () => {
            this.modifyCardList();
        });
    },
    onPullDownRefresh() {
        this.modifyCardList();
        wx.stopPullDownRefresh();
    },
    /** 查询IC卡列表 */
    modifyCardList() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        IdentityCardAPI.list({
            lockId: ekeyInfo?.lockId,
            pageNo: 1,
            pageSize: 20,
        }).then(res => {
            wx.hideLoading();
            if (HttpHandler.isResponseTrue(res)) {
                const resultList = (res?.list || []).filter(item => (item?.cardType == 1));
                const list = this.data?.cardList || [];
                list.splice(0, list?.length, ...resultList);
                this.setData({
                    cardList: list
                });
            } else {
                HttpHandler.handleResponseError(res);
            }
        }).catch(err => {
            wx.hideLoading();
            HttpHandler.handleServerError(err);
        })
    },

    /** 查询锁内有效IC卡列表 */
    async handleGetAll() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在查询锁内有效IC卡列表` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /** 查询锁内有效IC卡列表 */
            const result = await TTLockPlugin.getAllValidICCard({
                lockData: ekeyInfo?.lockData
            });
            if (result?.errorCode != 0) throw(result);

            wx.hideLoading();
            this.setData({ state: `操作成功，共读取到 ${result?.cardList?.length} 条IC卡记录` });
            HttpHandler.showErrorMsg("操作成功");
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("查询锁内有效IC卡列表失败");
            this.setData({state: `查询锁内有效IC卡列表失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    // 进入IC卡管理页
    toDetail(event) {
        const cardItem = JSON.stringify(event?.target?.dataset?.value);
        wx.setStorageSync("cardInfo", cardItem);
        wx.navigateTo({
            url: "./manage/manage"
        })
    }
})