/// <reference path="./identityCard.d.ts" />
import { HttpRequestUtil } from "../tools/httpRequest";

/** 获取IC卡列表 */
export function list(params: ICardAPI.Params.List) {
    return HttpRequestUtil.get<ICardAPI.Result.CardList>("/v3/identityCard/list", params);
}

/** 添加IC卡 */
export function add(params: ICardAPI.Params.Add) {
    return HttpRequestUtil.post<ICardAPI.Result.Add>("/v3/identityCard/add", params);
}

/** 修改IC卡有效期 */
export function changePeriod(params: ICardAPI.Params.ChangePeriod) {
    return HttpRequestUtil.post("/v3/identityCard/changePeriod", params);
}

/** 删除IC卡 */
export function Delete(params: ICardAPI.Params.Delete) {
    return HttpRequestUtil.post("/v3/identityCard/delete", params);
}