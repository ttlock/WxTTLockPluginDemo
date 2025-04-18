/// <reference path="./fingerprint.d.ts" />
/// <reference path="./gateway.d.ts" />
/// <reference path="./identityCard.d.ts" />
/// <reference path="./key.d.ts" />
/// <reference path="./keyboardPwd.d.ts" />
/// <reference path="./lock.d.ts" />
/// <reference path="./lockRecord.d.ts" />
/// <reference path="./oauth.d.ts" />
/// <reference path="./wifiLock.d.ts" />

declare interface HttpResponseResult {
    errcode?: number; // 服务器错误码
    errmsg?: string; // 服务器错误信息
    description?: string; // 服务器错误描述
}

/** API返回列表数据 */
declare interface ResultListData<T> {
    pageNo: number; // 页码，从1开始
    pageSize: number; // 单页数量
    pages: number; // 总页数
    total: number; // 总条数
    list: Array<T>; // 记录列表
}