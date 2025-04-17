declare module IGateway {
    namespace Params {
        /** 查询网关是否初始化成功参数 */
        interface IsInitSuccess {
            gatewayNetMac: string; // 添加网关时网关MAC地址
        }

        /** 上传网关信息参数 */
        interface UploadDetail {
            gatewayId: number; // 网关初始化ID
            modelNum: string; // 产品型号（用于固件升级）
            hardwareRevision: string; // 硬件版本号（用于固件升级）
            firmwareRevision: string; // 固件版本号（用于固件升级）
            networkName: string; // 网关连接的网络名称
        }
    }

    namespace Result {
        /** 查询网关是否初始化成功参数 */
        interface IsInitSuccess extends HttpResponseResult {
            gatewayId?: number; // 网关ID
        }
    }
}