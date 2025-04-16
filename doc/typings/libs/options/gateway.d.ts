/// <reference path="./device.d.ts" />

declare namespace TTGateway {
    /**
	 * 蓝牙扫描网关信息
	 * @since 2.6.0
	 */
	interface DeviceModel extends TTDevice.DeviceModel {
        /**
		 * @description 网关类型
		 * @since 2.6.0
         * @see TTGATEWAY_TYPE
		 */
        type: number;
		/**
		 * @description 设备是否为网关
		 * @since 2.6.0
         * @deprecated 3.1.0
		 */
		isGateway?: boolean;
	}
}

/**
 * 蓝牙扫描到的网关设备
 * @since 2.7.0
 */
declare type TTGatewayFromScan = TTGateway.DeviceModel;