namespace ILockAPI.Params {
    /** 智能锁初始化参数 */
    interface Initialize {
        lockData: string; // 智能锁初始化数据
        lockAlias?: string; // 锁别名
        groupId?: number; // 分组ID
        nbInitSuccess?: 1 | 0; // NB-IoT锁是否初始化成功，1-是、0-否，只有NB-IoT锁需要传
    }

    /** 删除智能锁参数 */
    interface Delete {
        lockId: number; // 智能锁ID
    }

    /** 查询密码列表参数 */
    interface KeyboardPwdList {
        lockId: number; // 智能锁ID
        searchStr?: string; // 搜索条件
        pageNo: number; // 页码，从1开始
        pageSize: number; // 单页数量
    }

    /** 更新智能锁数据参数 */
    interface UpdateLockData {
        lockId: number; // 智能锁ID
        lockData: string; // 更新数据
    }
}

namespace ILockAPI.List {
    /** 键盘密码信息 */
    interface KeyboardPwdInfo {
        keyboardPwdId?: number; // 键盘密码ID
        lockId?: number; // 锁ID，由锁初始化接口生成
        keyboardPwd?: string; // 键盘密码
        keyboardPwdName?: string; // 键盘密码名称
        keyboardPwdType?: number; // 键盘密码类型
        startDate?: number; // 有效期开始时间（时间戳，单位毫秒）
        endDate?: number; // 有效期结束时间（时间戳，单位毫秒）
        sendDate?: number; // 发送时间（时间戳，单位毫秒）
        isCustom?: 1 | 0; // 是否自定义密码: 1-是, 0-否
        senderUsername?: string; // 发送者用户名
    }
}

namespace ILockAPI.Result {
    /** 智能锁初始化参数 */
    interface Initialize extends HttpResponseError {
        lockId?: number; // 智能锁ID
        keyId?: number; // 电子钥匙ID
    }

    /** 密码列表返回数据 */
    interface KeyboardPwdList extends ResultListData<IEKeyAPI.List.KeyboardPwdInfo>, HttpResponseError {}
}