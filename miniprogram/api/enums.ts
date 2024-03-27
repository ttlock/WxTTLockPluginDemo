/** 服务器请求返回结果类型 */
export const HTTP_RES_TYPE = {
    REQUEST_ERROR: 3, // 请求失败
    RESPONSE_ERROR: 4, // 服务器响应失败
    RETURN_ERROR: 2, // 服务器处理后返回错误码
    SUCCESS: 1, // 服务器处理后返回成功
} as const;