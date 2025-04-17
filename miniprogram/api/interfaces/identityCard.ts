import { $get, $post } from "../tools/httpRequest";

/** 获取IC卡列表 */
export const list = (params: ICard.Params.List) => {
    return $get<ICard.Result.CardList>("/v3/identityCard/list", params);
}

/** 添加IC卡 */
export const add = (params: ICard.Params.Add) => {
    return $post<ICard.Result.Add>("/v3/identityCard/add", params);
}

/** 修改IC卡有效期 */
export const changePeriod = (params: ICard.Params.ChangePeriod) => {
    return $post("/v3/identityCard/changePeriod", params);
}

/** 删除IC卡 */
export const Delete = (params: ICard.Params.Delete) => {
    return $post("/v3/identityCard/delete", params);
}