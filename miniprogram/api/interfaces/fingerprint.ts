/// <reference path="./fingerprint.d.ts" />
import { HttpRequestUtil } from "../tools/httpRequest";

/** 获取指纹列表 */
export function list(params: IFingerprintAPI.Params.List) {
    return HttpRequestUtil.get<IFingerprintAPI.Result.FingerprintList>("/v3/fingerprint/list", params);
}

/** 添加指纹 */
export function add(params: IFingerprintAPI.Params.Add) {
    return HttpRequestUtil.post<IFingerprintAPI.Result.Add>("/v3/fingerprint/add", params);
}

/** 修改指纹有效期 */
export function changePeriod(params: IFingerprintAPI.Params.ChangePeriod) {
    return HttpRequestUtil.post("/v3/fingerprint/changePeriod", params);
}

/** 删除指纹 */
export function Delete(params: IFingerprintAPI.Params.Delete) {
    return HttpRequestUtil.post("/v3/fingerprint/delete", params);
}