/// <reference path="./key.d.ts" />
import { HttpRequestUtil } from "../tools/httpRequest";

/** 获取电子钥匙列表 */
export function list(params: IEKeyAPI.Params.List) {
    return HttpRequestUtil.post<IEKeyAPI.Result.List>("/v3/key/list", params);
}