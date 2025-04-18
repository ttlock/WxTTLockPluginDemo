import * as LockAPI from "../../../api/interfaces/lock";
import * as HttpHandler from "../../../api/handle/httpHandler";

Page({
    data: {
        state: '',
        keyInfo: {}, // 钥匙数据
        passcodeList: [], // 密码列表
        currentPageIndex: 0,
    },
    onShow() {
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo') || "{}") as IEKey.List.EKeyInfo;
        wx.setNavigationBarTitle({ title: keyInfo?.lockAlias });
        this.setData({ keyInfo }, () => {
            this.modifyPasscodeList();
        });
    },
    onPullDownRefresh() {
        this.modifyPasscodeList();
        wx.stopPullDownRefresh();
    },
    /** 查询密码列表 */
    modifyPasscodeList() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        LockAPI.listKeyboardPwd({
            lockId: ekeyInfo?.lockId,
            pageNo: 1,
            pageSize: 20,
        }).then(res => {
            wx.hideLoading();
            if (HttpHandler.isResponseTrue(res)) {
                const resultList = (res?.list || []).filter(item => (item?.keyboardPwdVersion == 4)); // 仅展示三代锁密码
                const list = this.data?.passcodeList || [];
                list.splice(0, list?.length, ...resultList);
                this.setData({
                    passcodeList: list
                });
            } else {
                HttpHandler.handleResponseError(res);
            }
        }).catch(err => {
            HttpHandler.handleServerError(err);
        })
    },

    /** 查询锁内有效密码列表 */
    async handleGetAll() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在查询锁内有效密码列表` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /** 查询锁内有效密码列表 */
            const result = await TTLockPlugin.getAllValidPasscode({
                lockData: ekeyInfo?.lockData
            });
            if (result?.errorCode != 0) throw(result);

            wx.hideLoading();
            this.setData({ state: `操作成功，共读取到 ${result?.keyboardPwdList?.length} 条密码` });
            HttpHandler.showErrorMsg("操作成功");
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("查询锁内有效密码列表失败");
            this.setData({state: `查询锁内有效密码列表失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    /** 重置智能锁普通键盘密码 */
    async handleReset() {
        const ekeyInfo = this.data?.keyInfo as IEKey.List.EKeyInfo;
        wx.showLoading({ title: "" });
        this.setData({ state: `正在重置智能锁普通键盘密码` })
        const TTLockPlugin = requirePlugin("myPlugin") as TTLockPlugin;

        try {
            /** 重置智能锁普通键盘密码 */
            const result = await TTLockPlugin.resetPasscode({
                lockData: ekeyInfo?.lockData
            });
            if (result?.errorCode != 0) throw(result);

            wx.showLoading({ title: "上传服务器中" });
            this.setData({ state: `键盘密码重置成功，现有密码已失效` });
            LockAPI.updateLockData({
                lockId: ekeyInfo?.lockId, // 智能锁ID
                lockData: result?.lockData // 更新数据
            }).then(res => {
                wx.hideLoading();
                if (HttpHandler.isResponseTrue(res)) {
                    HttpHandler.showErrorMsg("服务器已同步");
                    this.modifyPasscodeList();
                } else {
                    HttpHandler.handleResponseError(res);
                }
            }).catch(err => {
                console.log(err)
                wx.hideLoading();
                HttpHandler.handleServerError(err);
            })
        } catch(err) {
            console.log(err);
            wx.hideLoading();
            HttpHandler.showErrorMsg("键盘密码重置失败");
            this.setData({state: `键盘密码重置失败: ${err?.errorMsg}` });
        } finally {
            const finishRes = await TTLockPlugin.finishOperations();
            console.log("关闭蓝牙返回结果：", finishRes);
        }
    },

    // 进入密码管理页
    toDetail(event) {
        const value = event?.target?.dataset?.value as ILock.List.KeyboardPwdInfo;
        if (value?.keyboardPwdType != 2 && value?.keyboardPwdType != 3) return HttpHandler.showErrorMsg("当前仅支持限时、永久密码修改");
        wx.setStorageSync("passcodeInfo", JSON.stringify(value));
        wx.navigateTo({
            url: "./manage/manage"
        })
    }
})