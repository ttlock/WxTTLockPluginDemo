import { HttpRequestUtil } from "../tools/httpRequest";

/** 上传操作记录 */
export function uploadOperation(params) {
    return HttpRequestUtil.post("/v3/lockRecord/upload", params);
}
