/// <reference path="./oauth.d.ts" />
import { HttpRequestUtil } from "../tools/httpRequest";
import { HttpConfigs } from "../tools/config"

/** 用户登录 */
export function token(params: IOauthAPI.Params.GetToken) {
    return HttpRequestUtil.post<IOauthAPI.Result.Token>("/oauth2/token", {
        ...params,
        "client_id": HttpConfigs.CLIENT_ID,
        "client_secret": HttpConfigs.CLIENT_SECRET,
        "grant_type": "password",
        "redirect_uri": "http://www.sciener.cn",
    }, false);
}