/// <reference path="./http-request.d.ts" />

/** API返回列表数据 */
interface ResultListData<T> {
    pageNo: number; // 页码，从1开始
    pageSize: number; // 单页数量
    pages: number; // 总页数
    total: number; // 总条数
    list: Array<T>; // 记录列表
}