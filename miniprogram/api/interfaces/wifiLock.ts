/// <reference path="./wifiLock.d.ts" />
import { HttpRequestUtil } from "../tools/httpRequest";
import { HttpConfigs } from "../tools/config"

/** 更新wifi信息 */
export function updateNetwork(params: IWifiLockAPI.Params.UpdateNetwork) {
    return HttpRequestUtil.post("/v3/wifiLock/updateNetwork", params);
}

/** 查询wifi信息 */
export function detail(params: IWifiLockAPI.Params.Detail) {
    return HttpRequestUtil.post<IWifiLockAPI.Result.Detail>("/v3/wifiLock/detail", params);
}