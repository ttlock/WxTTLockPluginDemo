import { $post } from "../tools/httpRequest";

/** 更新wifi信息 */
export const updateNetwork = (params: IWifiLock.Params.UpdateNetwork) => {
    return $post("/v3/wifiLock/updateNetwork", params);
}

/** 查询wifi信息 */
export const detail = (params: IWifiLock.Params.Detail) => {
    return $post<IWifiLock.Result.Detail>("/v3/wifiLock/detail", params);
}