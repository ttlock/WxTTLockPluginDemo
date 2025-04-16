/// <reference path="../options/index.d.ts" />
/// <reference path="../result/index.d.ts" />

declare namespace TTGateway {
    /**
	 * @description 连接智能网关参数
	 * @since 2.6.0
	 */
	interface ConnectGateway {
		/**
		 * @description 蓝牙扫描到到的网关信息
		 * @since 2.6.0
		 */
		deviceFromScan: TTGateway.DeviceModel;
		/**
		 * @description 设备断连回调 
		 * @since 2.6.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description 扫描网关附近的wifi列表
	 * @since 2.6.0
	 */
	interface ScanWiFi {
		/**
		 * @description 蓝牙扫描到到的网关信息
		 * @since 2.6.0
		 */
		deviceFromScan: TTGateway.DeviceModel;
		/**
		 * @description 设备断连回调 
		 * @since 2.6.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description 网关配置信息
	 * @since 2.6.0
	 */
	interface Configuration {
		/**
		 * @description 网关类型
		 * @since 2.6.0
		 * @see TTGATEWAY_TYPE
		 */
		type: number;
		/**
		 * @description 用户ID
		 * @since 2.6.0
		 */
		uid: number;
		/**
		 * @description 用户账户密码，MD5加密 
		 * @since 2.6.0
		 */
		password: string;
		/**
		 * @description 公司ID, 没有则填0 
		 * @since 2.6.0
		 */
		companyId: number;
		/**
		 * @description 分店ID, 没有则填0
		 * @since 2.6.0
		 */
		branchId: number;
		/**
		 * @description 自定义网关名称, 限50个字符
		 * @since 2.6.0
		 */
		plugName: string;
		/**
         * wifi名称
		 * @description G2网关必填
		 * @since 2.6.0
		 */
		SSID?: string;
		/**
         * wifi密码
		 * @description G2网关必填 
		 * @since 2.6.0
		 */
        wifiPwd?: string;
        /**
         * @description 远程服务器域名地址，server与serverIPAddress二选一，优先生效
		 * @default 常规填写: "plug.sciener.cn"
		 * @since 2.6.0
		 */
		server?: string;
		/**
         * @description 远程服务器IP地址，server与serverIPAddress二选一，优先级次于server
		 * @since 2.6.0
		 */
		serverIPAddress?: string;
		/**
		 * @description 远程服务器端口号
         * @default 常规填写: 2999
		 * @since 2.6.0
		 */
		port: number;
		/**
		 * @description 是否需要配置本地IP地址信息
		 * @since 2.6.0
		 */
		useLocalIPAddress: boolean;
		/**
         * 是否使用DHCP动态配置本地IP地址
		 * @description useLocalIPAddress = true时生效
		 * @since 2.6.0
		 */
		useDHCP?: boolean;
		/**
         * 固定本地IP地址
		 * @description useLocalIPAddress = true 且 useDHCP = false时生效
		 * @since 2.6.0
		 */
		ipAddress?: string;
		/**
         * 子网掩码
		 * @description useLocalIPAddress = true 且 useDHCP = false时生效
		 * @since 2.6.0
		 */
		subnetMask?: string;
		/**
         * 默认网关
		 * @description useLocalIPAddress = true 且 useDHCP = false时生效
		 * @since 2.6.0
		 */
		router?: string;
		/**
         * 首选DNS
		 * @description useLocalIPAddress = true 且 useDHCP = false时生效
		 * @since 2.6.0
		 */
		dns1?: string;
		/**
         * 备用DNS
		 * @description useLocalIPAddress = true 且 useDHCP = false时生效
		 * @since 2.6.0
		 */
		dns2?: string;
	}

	/**
	 * @description 初始化蓝牙网关参数
	 * @since 2.6.0
	 */
	interface InitGateway {
		/**
		 * @description 蓝牙扫描到到的网关信息
		 * @since 2.6.0
		 */
		deviceFromScan: TTGateway.DeviceModel;
		/**
		 * @description 设备断连回调 
		 * @since 2.6.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
		/**
		 * @description 网关配置信息
		 * @since 2.6.0
		 */
		configuration: Configuration;
	}
}

/**
 * 连接网关设备参数
 * @since 2.6.0
 */
declare type TTLockConnectGateway = TTGateway.ConnectGateway;

/**
 * 扫描网关附近可连接的wifi列表参数
 * @since 2.6.0
 */
declare type TTLockScanWifiByGateway = TTGateway.ScanWiFi;

/**
 * 初始化蓝牙网关参数
 * @since 2.6.0
 */
declare type TTLockInitGateway = TTGateway.InitGateway;