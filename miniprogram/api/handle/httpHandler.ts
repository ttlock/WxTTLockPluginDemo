import * as Enums from "../enums";
import { Assert } from "../../utils/assert";

/** @namespace 网络请求结果处理 */
export namespace HttpHandler {
    /* 处理服务器请求返回数据正确性判断 */
    export function isResponseTrue(result: HttpResponseError) {
        if (Assert.isNumber(result.errcode) && result.errcode !== 0) return false; // 服务器处理成功，但请求结果为失败
        else return true;
    };

    /* 处理服务器请求返回数据错误结果处理 */
    export function handleResponseError(result: HttpResponseError) {
        showErrorMsg(result.description || result.errmsg);
    };

    /* 处理服务器请求/响应失败错误 */
    export function handleServerError(err: HttpRequestError) {
        switch(err.httpResult) {
        case Enums.HTTP_RES_TYPE.SUCCESS: showErrorMsg("操作成功"); break;
        case Enums.HTTP_RES_TYPE.RETURN_ERROR:
        case Enums.HTTP_RES_TYPE.REQUEST_ERROR:
        case Enums.HTTP_RES_TYPE.RESPONSE_ERROR: showErrorMsg(err.description || err.errmsg); break;
        default: showErrorMsg("操作失败"); break;
        }
    };

    /** @description 提示错误 */
    export function showErrorMsg(errorMsg: string, ctx?: any) {
        if (ctx) return ctx.setData({ errorMsg: errorMsg });
        const pages = getCurrentPages();
        const page = pages[pages.length - 1];
        const iMessage = page ? page.selectComponent("#IMessage") : null;
        if (page && page.setData && Assert.isString(page.data.errorMsg)) page.setData({ errorMsg: errorMsg });
        else if (!!iMessage && Assert.isFunction(iMessage.message)) iMessage.message(errorMsg);
        else wx.showToast({ icon: "none", title: errorMsg });
    };
}