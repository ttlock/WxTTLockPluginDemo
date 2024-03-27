import { HttpRequestUtil } from "../tools/httpRequest";

/** 查询网关是否已添加成功 */
export function isInitSuccess(params) {
    return HttpRequestUtil.post("/v3/gateway/isInitSuccess", params);
}

/** 上传初始化网关信息 */
export function uploadDetail(params) {
    return HttpRequestUtil.post("/v3/gateway/uploadDetail", params);
}