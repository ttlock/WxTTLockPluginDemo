namespace ILockAPI.Params {
    /** 智能锁初始化参数 */
    interface Initialize {
        lockData: string; // 智能锁初始化数据
        lockAlias?: string; // 锁别名
        groupId?: number; // 分组ID
        nbInitSuccess?: 1 | 0; // NB-IoT锁是否初始化成功，1-是、0-否，只有NB-IoT锁需要传
    }
}

namespace ILockAPI.List {
    /** 电子钥匙信息 */
    interface EKeyInfo {
        lockId?: number; // 智能锁ID
        keyId?: number; // 电子钥匙ID
        lockData?: string; // 电子钥匙数据，可用于蓝牙操作智能锁
        userType?: string; // 钥匙用户类型：110301-管理员钥匙，110302-普通用户钥匙。
        keyStatus?: string; // 电子钥匙状态
        lockName?: string; // 智能锁蓝牙名称
        lockAlias?: string; // 智能锁别名
        lockMac?: string; // 智能锁mac地址
        noKeyPwd?: string; // 管理员开锁密码，管理员钥匙返回
        electricQuantity?: number; // 锁电量
        startDate?: number; // 有效期开始时间（时间戳，单位毫秒）
        endDate?: number; // 有效期结束时间（时间戳，单位毫秒）
        remarks?: number; // 备注，留言
        keyRight?: 0 | 1; // 钥匙是否被授权：0-否，1-是
        featureValue?: string; // 锁特征值，用于表示锁支持的功能
        remoteEnable?: 1 | 2; // 是否支持远程开锁：1-是、2-否
        passageMode?: 1 | 2; // 常开模式：1-开启、2-关闭
        groupId?: number; // 分组ID
        groupName?: string; // 分组名称
    }
}

namespace ILockAPI.Result {
    /** 智能锁初始化参数 */
    interface Initialize extends HttpResponseError {
        lockId?: number; // 智能锁ID
        keyId?: number; // 电子钥匙ID
    }
}