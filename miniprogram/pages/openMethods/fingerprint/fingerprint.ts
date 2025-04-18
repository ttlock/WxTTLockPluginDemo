import * as FingerprintAPI from "../../../api/interfaces/fingerprint";
import * as HttpHandler from "../../../api/handle/httpHandler";

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        fingerprintList: [], // 指纹列表
        currentPageIndex: 0
    },
    onShow() {
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        wx.setNavigationBarTitle({ title: keyInfo?.lockAlias });
        this.setData({ keyInfo }, () => {
            this.modifyFingerprintList();
        });
    },
    onPullDownRefresh() {
        this.modifyFingerprintList();
        wx.stopPullDownRefresh();
    },
    /** 查询指纹列表 */
    modifyFingerprintList() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        FingerprintAPI.list({
            lockId: ekeyInfo?.lockId,
            pageNo: 1,
            pageSize: 20,
        }).then(res => {
            wx.hideLoading();
            if (HttpHandler.isResponseTrue(res)) {
                const resultList = (res?.list || []).filter(item => (item?.fingerprintType == 1));
                const list = this.data?.fingerprintList || [];
                list.splice(0, list?.length, ...resultList);
                this.setData({
                    fingerprintList: list
                });
            } else {
                HttpHandler.handleResponseError(res);
            }
        }).catch(err => {
            HttpHandler.handleServerError(err);
        })
    },

    /** 查询锁内有效指纹列表 */
    async handleGetAll() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在查询锁内有效指纹列表` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /** 查询锁内有效指纹列表 */
            const result = await TTLockPlugin.getAllValidFingerprint({
                lockData: ekeyInfo?.lockData
            });
            if (result?.errorCode != 0) throw(result);

            wx.hideLoading();
            this.setData({ state: `操作成功，共读取到 ${result?.fingerprintList?.length} 条指纹记录` });
            HttpHandler.showErrorMsg("操作成功");
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("查询锁内有效指纹列表失败");
            this.setData({state: `查询锁内有效指纹列表失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    // 进入指纹管理页
    toDetail(event) {
        const fingerprintItem = JSON.stringify(event?.target?.dataset?.value);
        wx.setStorageSync("fingerprintInfo", fingerprintItem);
        wx.navigateTo({
            url: "./manage/manage"
        })
    }
})