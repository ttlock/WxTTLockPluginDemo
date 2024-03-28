/// <reference path="./keyboardPwd.d.ts" />
import { HttpRequestUtil } from "../tools/httpRequest";

/** 添加键盘密码 */
export function add(params) {
    return HttpRequestUtil.post("/v3/keyboardPwd/add", params);
}

/** 修改键盘密码 */
export function change(params) {
    return HttpRequestUtil.post("/v3/keyboardPwd/change", params);
}

/** 删除键盘密码 */
export function Delete(params) {
    return HttpRequestUtil.post("/v3/keyboardPwd/delete", params);
}