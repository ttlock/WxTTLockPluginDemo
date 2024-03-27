import { HttpRequestUtil } from "../tools/httpRequest";

/** 获取IC卡列表 */
export function list(params) {
    return HttpRequestUtil.get("/v3/identityCard/list", params);
}

/** 添加IC卡 */
export function add(params) {
    return HttpRequestUtil.post("/v3/identityCard/add", params);
}

/** 修改IC卡有效期 */
export function changePeriod(params) {
    return HttpRequestUtil.post("/v3/identityCard/changePeriod", params);
}

/** 删除IC卡 */
export function Delete(params) {
    return HttpRequestUtil.post("/v3/identityCard/delete", params);
}