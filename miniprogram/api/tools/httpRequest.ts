import * as Enums from "../enums";
import { HttpConfigs } from "./config";
import { Assert } from "../../utils/assert";
import { AES_Decrypt } from "../../utils/crypto";
const baseServer = "https://api.ttlock.com"; // 网络接口请求域名地址

/** @namespace 接口调用 */
export namespace HttpRequestUtil {
    function _requestAPI<T extends HttpResponseError>(
        url: string,
        method: "GET" | "POST" = "GET",
        params?: Record<string, any>,
        header?: Record<string, string>
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            wx.request<T>({
                url,
                method,
                dataType: "json",
                data: params,
                header: {
                    "content-type": "application/x-www-form-urlencoded",
                    ...header,
                },
                success (response) {
                    switch(response.statusCode) {
                    case 200: {
                        return resolve(response.data); // 服务器处理成功
                        // const result = response.data;
                        // if (Assert.isNumber(result.errcode) && result.errcode !== 0) { // 服务器处理成功，但请求结果为失败
                        //     return resolve({
                        //         httpResult: Enums.HTTP_RES_TYPE.RETURN_ERROR,
                        //         errcode: response.data.errcode,
                        //         errmsg: response.data.errmsg,
                        //         description: response.data.description
                        //     });
                        // }
                        // else return resolve(response.data);
                    };
                    default: {
                        const result: HttpRequestError = { httpResult: Enums.HTTP_RES_TYPE.RESPONSE_ERROR, errcode: response.statusCode, errmsg: "服务器响应失败，请稍候再试" };
                        result.description = `服务器响应失败，状态码：${response.statusCode}`;
                        return reject(result);
                    };
                    }
                },
                fail (err) {
                    const result: HttpRequestError = JSON.parse(JSON.stringify({ httpResult: Enums.HTTP_RES_TYPE.REQUEST_ERROR, errcode: err.errno, errmsg: err.errMsg }));
                    let description = `服务器请求失败，错误描述：${err.errMsg || ""}`;
                    if (Assert.isNumber(err.errno)) {
                        switch(err.errno) {
                        case 600000: description = "未知错误, 服务器请求失败"; break;
                        case 600002: description = "服务器请求失败，请检查服务器域名是否已被列入白名单"; break;
                        case 600009: description = "无效的URL地址"; break;
                        default: description = `服务器请求失败，错误码: ${err.errno}`; break;
                        }
                    }
                    result.description = description;
                    reject(result);
                }
            })
        });
    };

    function _generateParams(params?: Record<string, any>) {
        if (!params) return {};
        for (let key of Object.keys(params)) {
            if (params[key] === null) { params[key] = undefined; continue; }
            const type = typeof params[key];
            switch(type) {
            case "function": { params[key] = undefined; } break;
            case "object": { params[key] = JSON.stringify(params[key]); }; break;
            case "number":
            case "string":
            case "boolean":
            default: break;
            }
        }
        return JSON.parse(JSON.stringify(params));
    };

    function _makeParams(params?: Record<string, any>) {
        return JSON.parse(JSON.stringify({
            ..._generateParams(params),
            "clientId": HttpConfigs.CLIENT_ID,
            "accessToken": AES_Decrypt(wx.getStorageSync<string>("access_token")),
            "date": Date.now(),
        }))
    };

    export function post<T extends HttpResponseError>(url: string, params?: Record<string, any>, useToken: boolean = true, headers?: Record<string, string>, host: string = baseServer) {
        return _requestAPI<T>(`${host || ""}${url}`, "POST", useToken ? _makeParams(params) : _generateParams(params), _generateParams(headers));
    };

    export function get<T extends HttpResponseError>(url: string, params?: Record<string, any>, useToken: boolean = true, headers?: Record<string, string>, host: string = baseServer) {
        return _requestAPI<T>(`${host}${url}`, "GET", useToken ? _makeParams(params) : _generateParams(params), _generateParams(headers));
    };
}