declare module ILock {
    namespace Params {
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

        /** 查询智能锁详情参数 */
        interface Detail {
            lockId: number; // 智能锁ID
        }

        /** 更新智能锁数据参数 */
        interface UpdateLockData {
            lockId: number; // 智能锁ID
            lockData: string; // 更新数据
        }

        /** 修改锁管理员开锁密码参数 */
        interface ChangeAdminKeyboardPwd {
            lockId: number; // 智能锁ID
            password: string; // 管理员密码
            changeType?: 1 | 2 | 3; // 修改方式
        }

        /** 修改智能锁设置项 */
        interface UpdateSetting {
            lockId: number; // 智能锁ID
            type: number; // 要修改的项
            value: number; // 设置值: 1-开启、2-关闭;
            changeType?: 1 | 2; // 修改方式
        }

        /** 修改智能锁自动闭锁时间 */
        interface SetAutoLockTime {
            lockId: number; // 智能锁ID
            seconds: number; // 自动闭锁时间
            type?: 1 | 2; // 修改方式
        }

        /** 获取常开模式设置 */
        interface GetPassageModeConfig {
            lockId: number; // 智能锁ID
        }

        /** 修改常开模式设置 */
        interface ConfigPassageMode {
            lockId: number; // 智能锁ID
            passageMode: 1 | 2; // 常开模式开闭状态
            startDate?: number;
            endDate?: number;
            isAllDay?: 1 | 2;
            weekDays?: Array<number>;
            autoUnlock?: 1 | 2;
            type?: 1 | 2; // 修改方式
        }
    }

    namespace List {
        /** 键盘密码信息 */
        interface KeyboardPwdInfo {
            keyboardPwdId?: number; // 键盘密码ID
            lockId?: number; // 锁ID，由锁初始化接口生成
            keyboardPwd?: string; // 键盘密码
            keyboardPwdName?: string; // 键盘密码名称
            keyboardPwdType?: number; // 键盘密码类型
            keyboardPwdVersion?: number; // 密码类型
            startDate?: number; // 有效期开始时间（时间戳，单位毫秒）
            endDate?: number; // 有效期结束时间（时间戳，单位毫秒）
            sendDate?: number; // 发送时间（时间戳，单位毫秒）
            isCustom?: 1 | 0; // 是否自定义密码: 1-是, 0-否
            senderUsername?: string; // 发送者用户名
        }
    }
    
    namespace Result {
        /** 智能锁初始化参数 */
        interface Initialize extends HttpResponseResult {
            lockId?: number; // 智能锁ID
            keyId?: number; // 电子钥匙ID
        }
    
        /** 密码列表返回数据 */
        interface KeyboardPwdList extends ResultListData<List.KeyboardPwdInfo>, HttpResponseResult {}
    
        /** 智能锁详情 */
        interface Detail extends HttpResponseResult {
            lockId?: number; // 智能锁ID
            lockName?: string; // 智能锁蓝牙名称
            lockAlias?: string; // 智能锁别名
            lockMac?: string; // 智能锁mac地址
            noKeyPwd?: string; // 管理员开锁密码，管理员钥匙返回
            featureValue?: string; // 锁特征值，用于表示锁支持的功能
            timezoneRawOffset?: number; // 时区便宜量
            modelNum?: string;
            hardwareRevision?: string;
            firmwareRevision?: string;
            date?: number;
        }
    
        /** 获取常开模式设置 */
        interface GetPassageModeConfig extends HttpResponseResult {
            passageMode: 1 | 2; // 常开模式开闭状态
            startDate?: number;
            endDate?: number;
            isAllDay?: 1 | 2;
            weekDays?: Array<number>;
            autoUnlock?: 1 | 2;
        }
    }
}

