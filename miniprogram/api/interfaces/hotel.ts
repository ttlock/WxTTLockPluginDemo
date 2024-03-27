import { HttpRequestUtil } from "../tools/httpRequest";

/** 获取酒店锁信息 */
export function getInfo(params) {
    return HttpRequestUtil.post("/v3/hotel/getInfo", params);
}