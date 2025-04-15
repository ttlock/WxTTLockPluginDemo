/** 服务器请求返回结果类型 */
declare const enum HTTP_RES_TYPE {
    REQUEST_ERROR = 3, // 请求失败
    RESPONSE_ERROR = 4, // 服务器响应失败
    RETURN_ERROR = 2, // 服务器处理后返回错误码
    SUCCESS = 1, // 服务器处理后返回成功
}

/** HTTP请求服务器失败返回数据(reject) */
interface HttpRequestError {
    httpResult: HTTP_RES_TYPE; // 网络强求错误类型
    errcode?: number; // 对应结果错误码 (HTTP状态码或wx.request错误码)
    errmsg?: string; // 错误提示语
    description?: string; // 补充描述
}

declare interface HttpResponseError {
    errcode?: number; // 对应结果错误码 
    errmsg?: string; // 错误提示语
    description?: string; // 补充描述
}