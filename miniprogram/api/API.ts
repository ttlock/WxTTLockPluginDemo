import RequestTool, { RequestRes } from './common';

const CLIENT_ID = "7946f0d923934a61baefb3303de4d132";
const CLIENT_SECRET = "56d9721abbc3d22a58452c24131a5554";

class API {
    // 用户登录
    login(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/oauth2/token", "POST", {
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "grant_type": "password",
            "redirect_uri": "http://www.sciener.cn",
            ...params
        });
    };

    // 钥匙列表
    keyList(): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/key/list", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "pageNo": 1,
            "pageSize": 20,
            "date": Date.now()
        });
    }

    // 上传初始化智能锁参数
    initialize(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/lock/initialize", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "date": Date.now(),
            ...params
        });
    }

    // 查询网关是否初始化成功
    isInitSuccess(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/gateway/isInitSuccess", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "date": Date.now(),
            ...params
        });
    }

    // 上传初始化网关信息
    uploadDetail(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/gateway/uploadDetail", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "date": Date.now(),
            ...params
        });
    }

    // 重置智能锁
    deleteLock(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/lock/delete", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "date": Date.now(),
            ...params
        });
    }

    // 上传操作记录
    uploadOperation(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/lockRecord/upload", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "date": Date.now(),
            ...params
        });
    }

    // 添加键盘密码
    addKeyboardPwd(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/keyboardPwd/add", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "addType": 1,
            "date": Date.now(),
            ...params
        });
    }

    // 修改键盘密码
    modifyKeyboardPwd(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/keyboardPwd/change", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "changeType": 1,
            "date": Date.now(),
            ...params
        });
    }

    // 删除键盘密码
    deleteKeyboardPwd(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/keyboardPwd/delete", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "deleteType": 1,
            "date": Date.now(),
            ...params
        });
    }

    // 添加指纹
    addFingerprint(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/fingerprint/add", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "date": Date.now(),
            ...params
        });
    }

    // 修改指纹有效期
    modifyFingerprint(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/fingerprint/changePeriod", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "changeType": 1,
            "date": Date.now(),
            ...params
        });
    }

    // 删除指纹
    deleteFingerprint(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/fingerprint/delete", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "deleteType": 1,
            "date": Date.now(),
            ...params
        });
    }

    // 添加IC卡
    addICCard(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/identityCard/add", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "addType": 1,
            "date": Date.now(),
            ...params
        });
    }

    // 修改IC卡有效期
    modifyICCard(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/identityCard/changePeriod", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "changeType": 1,
            "date": Date.now(),
            ...params
        });
    }

    // 删除IC卡
    deleteICCard(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/identityCard/delete", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "deleteType": 1,
            "date": Date.now(),
            ...params
        });
    }

    // 更新锁信息
    updateLockData(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/lock/updateLockData", "POST", {
            "clientId": CLIENT_ID,
            "accessToken": wx.getStorageSync('access_token'),
            "date": Date.now(),
            ...params
        });
    }

    // 获取酒店信息
    getHotelInfo(params: Record<string, any>): Promise<Record<string, any> | null> {
        return RequestTool.$request("/v3/hotel/getInfo", "POST", {
            "clientId": CLIENT_ID,
            "clientSecret": CLIENT_SECRET,
            "date": Date.now()
        });
    }
}

export default new API();