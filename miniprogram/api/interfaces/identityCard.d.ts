declare module ICard {
    namespace Params {
        /** IC卡列表请求参数 */
        interface List {
            lockId: number; // 智能锁ID
            searchStr?: number; // 搜索条件
            pageNo: number; // 页码，从1开始
            pageSize: number; // 单页数量
        }

        /** 添加IC卡参数 */
        interface Add {
            lockId: number; // 智能锁ID
            cardNumber: string; // IC卡号
            cardName?: string; // IC卡名称
            startDate: number; // 有效期开始时间（时间戳，单位毫秒）
            endDate: number; // 有效期结束时间（时间戳，单位毫秒）
            cardType?: number; // 卡类型：1-普通卡、4-循环
            cyclicConfig?: Array<ICardAPI.Value.CyclicConfigInfo>; // 循环时间设置
            addType?: 1 | 2 | 3; //  添加方式: 1-通过APP走蓝牙修改 2-通过网关或WiFi锁修改 3-NB-IoT
        }

        /** 修改IC卡参数 */
        interface ChangePeriod {
            lockId: number; // 智能锁ID
            cardId: number; // IC卡ID
            startDate: number; // 有效期开始时间（时间戳，单位毫秒）
            endDate: number; // 有效期结束时间（时间戳，单位毫秒）
            cyclicConfig?: Array<ICardAPI.Value.CyclicConfigInfo>; // 循环时间设置
            changeType?: 1 | 2 | 3; //  修改方式: 1-通过APP走蓝牙修改 2-通过网关或WiFi锁修改 3-NB-IoT
        }

        /** 删除IC卡 */
        interface Delete {
            lockId: number; // 智能锁ID
            cardId: number; // IC卡ID
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
        /** IC卡信息 */
        interface CardInfo{
            cardId?: number; // IC卡ID
            lockId?: number; // 锁ID
            cardNumber?: string; // IC卡号
            cardName?: string; // IC卡名称
            startDate?: number; // 有效期开始时间（时间戳，单位毫秒）
            endDate?: number; // 有效期结束时间（时间戳，单位毫秒）
            createDate?: number; // 创建时间（时间戳，单位毫秒）
            senderUsername?: string; // 发送者用户名
            cardType?: number; // 卡类型：1-普通卡、4-循环
            cyclicConfig?: Array<Value.CyclicConfigInfo>; // 循环时间设置
        }
    }

    namespace Result {
        /** IC卡列表返回数据 */
        interface CardList extends ResultListData<List.CardInfo>, HttpResponseResult {}
    
        /** 添加IC卡参数 */
        interface Add extends HttpResponseResult {
            cardId?: number; // IC卡ID
        }
    }
}




