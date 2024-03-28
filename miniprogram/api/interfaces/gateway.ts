/// <reference path="./gateway.d.ts" />
import { HttpRequestUtil } from "../tools/httpRequest";

/** 查询网关是否已添加成功 */
export function isInitSuccess(params: IGatewayAPI.Params.IsInitSuccess) {
    return HttpRequestUtil.post<IGatewayAPI.Result.IsInitSuccess>("/v3/gateway/isInitSuccess", params);
}

/** 上传初始化网关信息 */
export function uploadDetail(params: IGatewayAPI.Params.UploadDetail) {
    return HttpRequestUtil.post("/v3/gateway/uploadDetail", params);
}