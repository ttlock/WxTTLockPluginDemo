import { $post } from "../tools/httpRequest";

/** 上传操作记录 */
export const uploadOperation = (params: ILockRecord.Params.Upload) => {
    return $post("/v3/lockRecord/upload", params);
}
