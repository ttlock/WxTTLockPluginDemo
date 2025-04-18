import { $post } from "../tools/httpRequest";

/** 查询网关是否已添加成功 */
export const isInitSuccess = (params: IGateway.Params.IsInitSuccess) => {
    return $post<IGateway.Result.IsInitSuccess>("/v3/gateway/isInitSuccess", params);
}

/** 上传初始化网关信息 */
export const uploadDetail = (params: IGateway.Params.UploadDetail) => {
    return $post("/v3/gateway/uploadDetail", params);
}