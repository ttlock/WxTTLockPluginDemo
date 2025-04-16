/// <reference path="../options/index.d.ts" />
/// <reference path="../result/index.d.ts" />

declare namespace TTGateway {
    /**
	 * @description Gateway information scanned by Bluetooth
	 * @since 2.6.0
	 */
	interface ConnectGateway {
		/**
		 * @description Gateway information scanned by Bluetooth
		 * @since 2.6.0
		 */
		deviceFromScan: DeviceModel;
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Gateway information scanned by Bluetooth
	 * @since 2.6.0
	 */
	interface ScanWiFi {
		/**
		 * @description Gateway information scanned by Bluetooth
		 * @since 2.6.0
		 */
		deviceFromScan: DeviceModel;
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Gateway information scanned by Bluetooth
	 * @since 2.6.0
	 */
	interface Configuration {
		/**
		 * @description Gateway information scanned by Bluetooth
		 * @since 2.6.0
		 * @see TTGATEWAY_TYPE
		 */
		type: number; // 网关类型
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		uid: number; // 用户ID
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		password: string; // 用户密码
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		companyId: number; // 公司ID, 没有则填0
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		branchId: number; // 分店ID, 没有则填0
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		plugName: string; // 网关名称
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		SSID?: string; // SSID
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		wifiPwd?: string; // 密码
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		serverIPAddress?: string; // 服务器IP地址
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		port: number; // 服务器端口地址
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		server?: string; // 服务器地址
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		useLocalIPAddress: boolean; // 是否使用本地IP地址
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		useDHCP?: boolean; // 是否使用DHCP获取IP地址
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		ipAddress?: string; // 固定IP地址
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		subnetMask?: string; // 子网掩码
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		router?: string; // 默认网关
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		dns1?: string; // 首选DNS
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		dns2?: string; // 备用DNS
	}

	/**
	 * @description Gateway information scanned by Bluetooth
	 * @since 2.6.0
	 */
	interface InitGateway {
		/**
		 * @description Gateway information scanned by Bluetooth
		 * @since 2.6.0
		 */
		deviceFromScan: DeviceModel;
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		configuration: Configuration;
	}
}

// /**
//  * @description Gateway information scanned by Bluetooth
//  * @since 2.6.0
//  */
// declare type TTGatewayScanModel = TTGateway.DeviceModel;

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

// /**
//  * 网关配置信息
//  * @since 2.6.0
//  */
// declare type TTLockGatewayConfiguration = TTGateway.Configuration;