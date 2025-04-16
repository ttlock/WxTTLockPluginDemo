/// <reference path="../options/index.d.ts" />

declare namespace TTGateway {
    /**
	 * 扫描到的wifi信息
	 */
    interface WiFiInfo {
        /**
         * @description wifi名称
         */
        SSID: string;
        /**
         * @description wifi信号值
         */
        rssi: number;
    }

    /**
     * @description 扫描网关附近可用的wifi列表数据域
     */
    interface ScanWiFiResultData {
        /**
         * @description 网关附近可用的wifi列表
         */
        wifiList?: Array<WiFiInfo>;
    }

    /**
     * @description 扫描网关附近可用的wifi列表操作结果
     */
    interface ScanWiFiResult extends TTLockError<ScanWiFiResultData> {}

    /**
     * @description 初始化蓝牙网关返回数据域
     */
    interface InitResultData {
        /**
         * @description 固件版本号
         */
        firmware: string;
        /* 硬件版本号 */
        /**
         * @description 硬件版本号
         */
        hardware: string;
        /**
         * @description 模块号
         */
        modelNum: string;
    }

    /**
     * @description 初始化蓝牙网关操作结果
     */
    interface InitResult extends TTLockError<InitResultData> {}
}

/**
 * 扫描网关附近可用的WIFI列表返回数据
 */
declare type TTLockScanWifiByGatewayResult = TTGateway.ScanWiFiResult;

/**
 * 初始化网关返回数据
 */
declare type TTLockInitGatewayResult = TTGateway.InitResult;