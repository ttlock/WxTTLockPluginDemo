import { $post } from "../tools/httpRequest";

/** 添加键盘密码 */
export const add = (params: IKeyboardPwd.Params.Add) => {
    return $post("/v3/keyboardPwd/add", params);
}

/** 修改键盘密码 */
export const change = (params: IKeyboardPwd.Params.Change) => {
    return $post("/v3/keyboardPwd/change", params);
}

/** 删除键盘密码 */
export const Delete = (params: IKeyboardPwd.Params.Delete) => {
    return $post("/v3/keyboardPwd/delete", params);
}