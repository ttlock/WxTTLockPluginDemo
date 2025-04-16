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
    
    /**
	 * 扫描到的wifi信息
	 */
    interface WiFiFromScan {
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
	 * wifi配置信息
	 */
    interface WiFiInfo {
        /**
         * @description wifi名称
         */
        SSID: string;
        /**
         * @description wifi密码
         */
        password: string;
    }

    /**
	 * 远程服务器信息
	 */
    interface ServerInfo {
        /**
         * @description 远程服务器域名地址，server与ipAddress二选一，优先生效
         * @default 常规填写: "plug.sciener.cn"
         */
        server?: string;
        /**
         * @description 远程服务器IP地址，server与ipAddress二选一，优先级次于server
         */
        ipAddress?: string;
        /**
         * @description 远程服务器端口号
         * @default 常规填写: 2999
         */
        port: number;
    }

    /**
	 * 本地固定IP地址配置信息
	 */
    interface StaticIPAddress {
        /**
         * @description 本地IP地址
         */
        ipAddress: string;
        /**
         * @description 子网掩码
         */
        subnetMask: string;
        /**
         * @description 默认网关
         */
        router: string;
        /**
         * @description 首选DNS
         */
        dns1: string;
        /**
         * @description 备用DNS
         */
        dns2: string;
    }

    /**
	 * 本地IP地址配置信息
	 */
    interface LocaleIPInfo {
        /**
         * @deprecated 是否使用DHCP动态获取本地IP地址, 设置为true时ipAddress不生效
         */
        useDHCP: boolean;
        /**
         * @deprecated 固定IP地址，useDHCP = false时必填
         */
        ipAddress?: StaticIPAddress;
    }
}

/**
 * 扫描到的wifi信息
 */
declare type TTLockWifiFromScan = TTDevice.WiFiFromScan;

/**
 * wifi配置信息
 */
declare type TTLockWifiInfo = TTDevice.WiFiInfo;

/**
 * 远程服务器信息
 */
declare type TTLockServerIPAddress = TTDevice.ServerInfo;

/**
 * 本地固定IP地址配置信息
 */
declare type TTLockStaticIPAddress = TTDevice.StaticIPAddress;

/**
 * 本地IP地址配置信息
 */
declare type TTLockLocaleIPAddress = TTDevice.LocaleIPInfo;