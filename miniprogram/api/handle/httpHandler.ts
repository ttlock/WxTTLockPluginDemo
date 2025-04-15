import * as Assert from "../../utils/assert";

export function isResponseTrue(result: HttpResponseResult) {
    if (Assert.isNumber(result.errcode) && result.errcode !== 0) return false; // 服务器处理成功，但请求结果为失败
    else return true;
};

export function handleResponseError(result: HttpResponseResult) {
    showErrorMsg(result?.description || result?.errmsg || "操作失败");
};

export function handleServerError(err: TTLockError | Error | any) {
    showErrorMsg(err?.description || err?.errorMsg || err?.message || "操作失败");
};

export function showErrorMsg(errorMsg: string, ctx?: any) {
    if (ctx) return ctx.setData({ errorMsg: errorMsg });
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    const iMessage = page ? page.selectComponent("#IMessage") : null;
    if (page && page.setData && Assert.isString(page.data.errorMsg)) page.setData({ errorMsg: errorMsg });
    else if (!!iMessage && Assert.isFunction(iMessage.message)) iMessage.message(errorMsg);
    else wx.showToast({ icon: "none", title: errorMsg });
};