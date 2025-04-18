import { CLIENT_ID, CLIENT_SECRET } from "../tools/config";
import { $post } from "../tools/httpRequest";

/** 用户登录 */
export const token = (params: IOauth.Params.GetToken) => {
    return $post<IOauth.Result.Token>("/oauth2/token", {
        ...params,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "password",
        "redirect_uri": "http://www.sciener.cn",
        "clientId": undefined,
        "accessToken": undefined,
    })
}