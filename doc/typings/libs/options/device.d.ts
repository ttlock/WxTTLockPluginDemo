/// <reference path="../enums/index.d.ts" />

declare namespace TTDevice {
    /**
	 * 蓝牙扫描设备信息基础值
	 * @since 1.0.0
	 */
	interface DeviceModel {
		/**
		 * @description 设备类型
		 * @since 2.7.6
		 * @see TTDEVICE_TYPE
		 */
        deviceType: number;
        /**
		 * @description 智能锁或设备类型
		 * @since 2.7.0
		 * @see TTLOCK_TYPE
         * @see TTGATEWAY_TYPE
		 */
        type: number;
		/**
		 * @description 蓝牙广播设备ID, 安卓设备与MAC地址相同，iOS为UUID格式
		 */
		deviceId: string;
		/**
		 * @description 设备信号值, 0表示该设备已掉线
		 * @since 1.0.0
		 */
		rssi: number;
		/**
		 * @description 设备是否处于可添加状态
		 * @since 1.0.0
		 */
		isSettingMode: boolean;
		/**
		 * @description 蓝牙设备MAC地址
		 * @since 2.7.0
		 */
		MAC: string;
		/**
		 * @description 设备蓝牙名称
		 * @since 2.7.0
		 */
		deviceName: string;
		/**
		 * @description 设备扫描最后更新时间
		 * @since 1.0.0
		 */
		updatedTime?: number;
    }
}