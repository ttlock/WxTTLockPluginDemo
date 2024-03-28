/// <reference path="./lock.d.ts" />
import { HttpRequestUtil } from "../tools/httpRequest";

/** 上传初始化智能锁参数 */
export function initialize(params: ILockAPI.Params.Initialize) {
    return HttpRequestUtil.post<ILockAPI.Result.Initialize>("/v3/lock/initialize", params);
}

/** 删除智能锁 */
export function Delete(params: ILockAPI.Params.Delete) {
    return HttpRequestUtil.post("/v3/lock/delete", params);
}

/** 获取键盘密码列表 */
export function listKeyboardPwd(params: ILockAPI.Params.KeyboardPwdList) {
    return HttpRequestUtil.get<ILockAPI.Result.KeyboardPwdList>("/v3/lock/listKeyboardPwd", params);
}

/** 更新智能锁信息 */
export function updateLockData(params) {
    return HttpRequestUtil.post("/v3/lock/updateLockData", params);
}