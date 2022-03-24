interface RequestTool {
    $request (url:string, method: "GET" | "POST", params: string | Record<string, any> | ArrayBuffer | undefined):Promise<Record<string, any>|null>;
}

interface RequestRes {
    [key:string]: any;      // 其余参数
    type: 0 | 1 | 2 | 3;       // 0 -返回成功, 1 -正常返回, 2 -响应失败, 3 -请求失败
    errorCode: number;          // 错误码
    errorMsg: string;           // 错误提示
}

class RequestToolImpl implements RequestTool {
    private static baseServer:string = "https://api.ttlock.com";
    public static getResponseData (response: RequestRes):Record<string, any>|null {
        switch (response.type) {
            case 0: return response["data"];        // 操作成功
            default: {
                wx.showToast({
                    icon: "none",
                    title: response.errorMsg,
                });
                return null;
            }
        }
    }
    $request (url:string, method: "GET" | "POST", params: string | Record<string, any> | ArrayBuffer | undefined):Promise<Record<string, any>|null> {
        return new Promise((resolve, reject) => {
            wx.showLoading({
                title: "网络请求中，请稍候...",
                complete: () => {
                    wx.request({
                        url: `${RequestToolImpl.baseServer}${url}`,
                        header: {
                            "content-type": "application/x-www-form-urlencoded"
                        },
                        data: params,
                        method: method,
                        success: (response) => {
                            wx.hideLoading({
                                complete: () => {
                                    let ret:Record<string, any>|null;
                                    switch (response.statusCode) {
                                        case 200: {
                                            if (!!response.data && typeof response.data["errcode"] === 'undefined') {
                                                ret = RequestToolImpl.getResponseData({
                                                    data: response.data,
                                                    errorCode: -2,
                                                    errorMsg: "操作成功",
                                                    type: 0
                                                })
                                            } else {
                                                switch (response.data["errcode"]) {
                                                    case 0: {
                                                        ret = RequestToolImpl.getResponseData({
                                                            data: response.data,
                                                            errorCode: -2,
                                                            errorMsg: "操作成功",
                                                            type: 0
                                                        })
                                                    }; break;
                                                    default: {
                                                        ret = RequestToolImpl.getResponseData({
                                                            data: response.data,
                                                            errorCode: -2,
                                                            errorMsg: response.data["errmsg"],
                                                            type: 1
                                                        })
                                                    }; break;
                                                }
                                            }
                                        }; break;
                                        default: {
                                            ret = RequestToolImpl.getResponseData({
                                                errorCode: -2,
                                                errorMsg: `服务器请求失败，状态码：${response.statusCode}`,
                                                type: 2
                                            })
                                        }; break;
                                    }
                                    resolve(ret);
                                }
                            })
                        },
                        fail: (err) => {
                            wx.hideLoading({
                                complete: () => {
                                    let ret = RequestToolImpl.getResponseData({
                                        errorCode: -1,
                                        errorMsg: "服务器请求失败，请检查服务器域名是否已被列入白名单",
                                        type: 3
                                    });
                                    resolve(ret);
                                }
                            })
                        }
                    })
                }
            });
        })
    }

    
}

export {
    RequestRes
}


export default new RequestToolImpl();