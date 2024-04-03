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

/** 获取智能锁详情参数 */
export function detail(params: ILockAPI.Params.Detail) {
    return HttpRequestUtil.get<ILockAPI.Result.Detail>("/v3/lock/detail", params);
}

/** 更新智能锁信息 */
export function updateLockData(params: ILockAPI.Params.UpdateLockData) {
    return HttpRequestUtil.post("/v3/lock/updateLockData", params);
}

/** 修改管理员密码 */
export function changeAdminKeyboardPwd(params: ILockAPI.Params.ChangeAdminKeyboardPwd) {
    return HttpRequestUtil.post("/v3/lock/changeAdminKeyboardPwd", params);
}

/** 修改智能锁设置项 */
export function updateSetting(params: ILockAPI.Params.UpdateSetting) {
    return HttpRequestUtil.post("/v3/lock/updateSetting", params);
}

/** 修改自动闭锁时间 */
export function setAutoLockTime(params: ILockAPI.Params.SetAutoLockTime) {
    return HttpRequestUtil.post("/v3/lock/setAutoLockTime", params);
}

/** 查询常开模式设置 */
export function getPassageModeConfig(params: ILockAPI.Params.GetPassageModeConfig) {
    return HttpRequestUtil.post<ILockAPI.Result.GetPassageModeConfig>("/v3/lock/getPassageModeConfig", params);
}

/** 修改常开模式设置 */
export function configPassageMode(params: ILockAPI.Params.ConfigPassageMode) {
    return HttpRequestUtil.post("/v3/lock/configPassageMode", params);
}