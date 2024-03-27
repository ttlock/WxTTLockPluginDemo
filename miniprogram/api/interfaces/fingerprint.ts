import { HttpRequestUtil } from "../tools/httpRequest";

/** 获取指纹列表 */
export function list(params) {
    return HttpRequestUtil.get("/v3/fingerprint/list", params);
}

/** 添加指纹 */
export function add(params) {
    return HttpRequestUtil.post("/v3/fingerprint/add", params);
}

/** 修改指纹有效期 */
export function changePeriod(params) {
    return HttpRequestUtil.post("/v3/fingerprint/changePeriod", params);
}

/** 删除指纹 */
export function Delete(params) {
    return HttpRequestUtil.post("/v3/fingerprint/delete", params);
}