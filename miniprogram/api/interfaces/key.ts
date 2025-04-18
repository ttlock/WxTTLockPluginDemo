import { $post } from "../tools/httpRequest";

/** 获取电子钥匙列表 */
export const list = (params: IEKey.Params.List) => {
    return $post<IEKey.Result.List>("/v3/key/list", params);
}