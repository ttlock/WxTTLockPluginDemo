declare module IWifiLock {
    namespace Params {
        /** 更新wifi信息 */
        interface UpdateNetwork {
            lockId: number; // 智能锁ID
            networkName?: string; // 连接的网络名称
            wifiMac?: string; // Wifi Mac地址
            rssi?: number; // Wifi信号强度
            useStaticIp?: boolean; // 是否使用静态IP
            ip?: string; // 静态IP地址
            subnetMask?: string; // 子网掩码
            defaultGateway?: string; // 默认网关
            preferredDns?: string; // 首选DNS
            alternateDns?: string; // 备用DNS
        }

        /** 查询wifi信息 */
        interface Detail {
            lockId: number; // 智能锁ID
        }
    }

    namespace Result {
        /** 查询wifi信息 */
        interface Detail extends HttpResponseResult {
            networkName?: string; // 连接的网络名称
            ip?: string; // 静态IP地址
            subnetMask?: string; // 子网掩码
            defaultGateway?: string; // 默认网关
            wifiMac?: string; // Wifi Mac地址
            rssiGrade?: number; // WIFI信号强度等级：3-强，2-中，1-差，0-未知
            isOnline?: 0 | 1; // 是否在线：0-否，1-是
            powerSavingMode?: number; // Wifi锁省电模式开关：0-未知、1-开启、2-关闭
            preferredDns?: string; // 首选DNS
            alternateDns?: string; // 备用DNS
        }
    }
}

