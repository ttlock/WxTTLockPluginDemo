import { $get, $post } from "../tools/httpRequest";

/** 获取指纹列表 */
export const list = (params: IFingerprint.Params.List) => {
    return $get<IFingerprint.Result.FingerprintList>("/v3/fingerprint/list", params);
}

/** 添加指纹 */
export const add = (params: IFingerprint.Params.Add) => {
    return $post<IFingerprint.Result.Add>("/v3/fingerprint/add", params);
}

/** 修改指纹有效期 */
export const changePeriod = (params: IFingerprint.Params.ChangePeriod) => {
    return $post("/v3/fingerprint/changePeriod", params);
}

/** 删除指纹 */
export const Delete = (params: IFingerprint.Params.Delete) => {
    return $post("/v3/fingerprint/delete", params);
}