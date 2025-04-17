import { $get, $post } from "../tools/httpRequest";

/** 上传初始化智能锁参数 */
export const initialize = (params: ILock.Params.Initialize) => {
    return $post<ILock.Result.Initialize>("/v3/lock/initialize", params);
}

/** 删除智能锁 */
export const Delete = (params: ILock.Params.Delete) => {
    return $post("/v3/lock/delete", params);
}

/** 获取键盘密码列表 */
export const listKeyboardPwd = (params: ILock.Params.KeyboardPwdList) => {
    return $get<ILock.Result.KeyboardPwdList>("/v3/lock/listKeyboardPwd", params);
}

/** 获取智能锁详情参数 */
export const detail = (params: ILock.Params.Detail) => {
    return $get<ILock.Result.Detail>("/v3/lock/detail", params);
}

/** 更新智能锁信息 */
export const updateLockData = (params: ILock.Params.UpdateLockData) => {
    return $post("/v3/lock/updateLockData", params);
}

/** 修改管理员密码 */
export const changeAdminKeyboardPwd = (params: ILock.Params.ChangeAdminKeyboardPwd) => {
    return $post("/v3/lock/changeAdminKeyboardPwd", params);
}

/** 修改智能锁设置项 */
export const updateSetting = (params: ILock.Params.UpdateSetting) => {
    return $post("/v3/lock/updateSetting", params);
}

/** 修改自动闭锁时间 */
export const setAutoLockTime = (params: ILock.Params.SetAutoLockTime) => {
    return $post("/v3/lock/setAutoLockTime", params);
}

/** 查询常开模式设置 */
export const getPassageModeConfig = (params: ILock.Params.GetPassageModeConfig) => {
    return $post<ILock.Result.GetPassageModeConfig>("/v3/lock/getPassageModeConfig", params);
}

/** 修改常开模式设置 */
export const configPassageMode = (params: ILock.Params.ConfigPassageMode) => {
    return $post("/v3/lock/configPassageMode", params);
}

/** 查询省电模式设置 */
export const getWifiConfig = (params: ILock.Params.GetPassageModeConfig) => {
    return $post<ILock.Result.GetPassageModeConfig>("/v3/wifiLock/detail", params);
}

/** 修改常开模式设置 */
export const configPowerSaveMode = (params: ILock.Params.ConfigPassageMode) => {
    return $post("/v3/lock/configPassageMode", params);
}