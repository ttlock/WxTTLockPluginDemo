declare module IOauth {
    namespace Params {
        interface GetToken {
            username: string; // 科技侠或通通锁APP的登录账号，也可以是注册用户接口返回的账号。不可使用开发者账号。
            password: string; // 密码
        }
    }

    namespace Result {
        interface Token extends HttpResponseResult {
            access_token?: string; // 访问令牌
            uid?: number; // 用户主键id
            expires_in?: string; // 访问令牌过期时间，默认90天，单位秒
            refresh_token?: string; // 刷新令牌
            openid?: number;
            scope?: string;
            token_type?: string;
        }
    }
}

