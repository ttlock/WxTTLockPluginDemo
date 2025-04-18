declare module IFingerprint {
    namespace Params {
        /** 指纹列表请求参数 */
        interface List {
            lockId: number; // 智能锁ID
            searchStr?: number; // 搜索条件
            pageNo: number; // 页码，从1开始
            pageSize: number; // 单页数量
        }

        /** 添加指纹参数 */
        interface Add {
            lockId: number; // 智能锁ID
            fingerprintNumber: number; // 指纹号
            fingerprintType: number; // 指纹类型：1-普通、4-循环
            fingerprintName?: string; // 指纹名称
            startDate: number; // 有效期开始时间（时间戳，单位毫秒）
            endDate: number; // 有效期结束时间（时间戳，单位毫秒）
            cyclicConfig?: Array<IFingerprintAPI.Value.CyclicConfigInfo>; // 循环时间设置
        }

        /** 修改指纹参数 */
        interface ChangePeriod {
            lockId: number; // 智能锁ID
            fingerprintId: number; // 指纹ID
            startDate: number; // 有效期开始时间（时间戳，单位毫秒）
            endDate: number; // 有效期结束时间（时间戳，单位毫秒）
            cyclicConfig?: Array<IFingerprintAPI.Value.CyclicConfigInfo>; // 循环时间设置
            changeType?: 1 | 2| 3; //  修改方式: 1-通过APP走蓝牙修改 2-通过网关或WiFi锁修改 3-NB-IoT
        }

        /** 删除指纹参数 */
        interface Delete {
            lockId: number; // 智能锁ID
            fingerprintId: number; // 指纹ID
            deleteType?: 1 | 2| 3; //  删除方式: 1-通过APP走蓝牙修改 2-通过网关或WiFi锁修改 3-NB-IoT
        }
    }

    namespace Value {
        interface CyclicConfigInfo {
            weekDay: number;
            startTime: number;
            endTime: number; 
        }
    }

    namespace List {
        /** 指纹信息参数 */
        interface FingerprintInfo{
            fingerprintId?: number; // 指纹ID
            lockId?: number; // 锁ID
            fingerprintNumber?: string; // 指纹号
            fingerprintType?: number; // 指纹类型：1-普通、4-循环
            fingerprintName?: string; // 指纹名称
            startDate?: number; // 有效期开始时间（时间戳，单位毫秒）
            endDate?: number; // 有效期结束时间（时间戳，单位毫秒）
            cyclicConfig?: Array<IFingerprintAPI.Value.CyclicConfigInfo>; // 循环时间设置
            createDate?: number; // 创建时间（时间戳，单位毫秒）
            senderUsername?: string; // 发送者用户名
        }
    }

    namespace Result {
        /** 指纹列表返回数据 */
        interface FingerprintList extends ResultListData<List.FingerprintInfo>, HttpResponseResult {}
    
        /** 添加指纹参数 */
        interface Add extends HttpResponseResult {
            fingerprintId?: number; // 指纹ID
        }
    }
}