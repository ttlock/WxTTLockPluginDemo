import wxp from "../../utils/promise";
import { CLIENT_ID } from "./config";
import * as Assert from "../../utils/assert";
import * as Crypto from "../../utils/crypto";
import { G as GenerateDefaultError, E as ErrCode } from "../../utils/error";

const _BASE_SERVER_ = "https://api.ttlock.com";  // 网络接口请求域名地址

function _generate(params?: any) {
    for (let key of Object.keys(params || {})) {
        if (Assert.isFunction(params[key])) delete params[key];
        else if (params[key] === null) delete params[key];
        else if (Assert.isObject(params[key])) params[key] = JSON.stringify(params[key]);
    }
    return JSON.parse(JSON.stringify(params || {}));
};

function _generateDefaultParams(params: any) {
    const token = Crypto.AES_Decrypt(wx.getStorageSync<string>("access_token"));
    return _generate({ 
        date: Date.now(),
        clientId: CLIENT_ID,
        accessToken: token || undefined,
        ...(params || {}),
    })
}

function _generateDefaultHeader(header: any) {
    return _generate({
        "content-type": "application/x-www-form-urlencoded",
        ...(header || {})
    });
}

async function _requestAPI<T>(
    url: string,
    method: "GET" | "POST" = "GET",
    params: Record<string, any> = {},
    header: Record<string, string> = {}
): Promise<T> {
    try {
        console.log("[Request]请求参数", params);
        const result: WechatMiniprogram.RequestSuccessCallbackResult<T> = await wxp.request<T>({
			url,
			method,
			dataType: "json",
			data: _generateDefaultParams(params),
			header: _generateDefaultHeader(header)
		}) as any;
        switch(result?.statusCode) {
        case 200: {
            console.log("[Request]网络请求结果", result?.data);
            return result?.data;
        };
        default: {
            console.log("[Request]请求失败", result);
            throw(GenerateDefaultError(ErrCode.REQUEST_API_FAILED, null, null, null, result?.statusCode));
        };
        }
    } catch (err) {
        console.log("[Request]请求报错", err);
        throw(GenerateDefaultError(ErrCode.FAIL));
    }
};

export function $post<T = HttpResponseResult>(url: string, params?: any, headers?: any, host?: string) {
    return _requestAPI<T>(`${host || _BASE_SERVER_ }${url}`, "POST", params, headers);
};

export function $get<T = HttpResponseResult>(url: string, params?: any, headers?: any, host?: string) {
    return _requestAPI<T>(`${host || _BASE_SERVER_ }${url}`, "GET", params, headers);
};