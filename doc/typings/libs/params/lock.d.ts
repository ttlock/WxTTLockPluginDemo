/// <reference path="../options/index.d.ts" />
/// <reference path="../result/index.d.ts" />

declare namespace TTLock {
    /**
	 * 查询智能锁版本信息参数
	 */
    interface GetLockVersion {
        /**
         * @description 扫描到的智能锁信息或lockData
         */
        deviceFromScan: TTLock.DeviceModel | string;
        /**
         * @description 设备断连回调
         */
        disconnectCallback?: TTDevice.DefaultCallback;
    }

    /**
	 * 初始化智能锁
	 * @since 1.0.0
	 */
	interface InitLock {
		/**
		 * @description 扫描到的智能锁信息
		 */
		deviceFromScan: TTLock.DeviceModel;
		/**
		 * @description 设备断连回调 
		 * @since 1.0.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
		/**
		 * @description 智能锁约定字符串(定制锁板必传)
		 * @since 1.0.0
		 */
		vendor?: string;
		/**
		 * @description 服务器时间戳
		 * @since 1.0.0
		 */
		serverTime?: number;
	}
	
	/**
	 * 重置智能锁
	 * @since 1.0.0
	 */
	interface ResetLock {
		/**
		 * @description 智能锁初始化数据或管理员电子钥匙数据 
		 */
		lockData: string;
		/**
		 * @description 设备断连回调 
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * 设置智能锁时间
	 */
	interface SetLockTime {
		/**
		 * @description 智能锁初始化数据或电子钥匙数据
		 */
		lockData: string;
		/**
		 * @description 设备断连回调 
		 */
		disconnectCallback?: (result: TTLockError) => void;
		/**
		 * @description 服务器时间戳
		 */
		serverTime?: number;
	}
	
	/**
	 * 控制智能锁(智能锁开锁/闭锁)
	 */
	interface ControlLock {
		/**
		 * @description 控制智能锁方式 3 -开锁, 6 -闭锁
		 * @see TTLOCK_CONTROL_TYPE
		 */
		controlAction: number;
		/**
		 * @description 智能锁初始化数据或电子钥匙数据 
		 */
		lockData: string;
		/**
		 * @description 设备断连回调 
		 * @since 1.0.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
		/**
		 * @description 梯控开启楼层列表(梯控传入)
		 * @since 1.0.0
		 */
		floorList?: Array<number>;
		/**
		 * @description 服务器时间戳，用于校准服务器时间，不传则默认从服务器获取时间戳，获取失败后取本地时间
		 * @since 1.0.0
		 */
        serverTime?: number;
	}
	
	/**
	 * 读取智能锁操作记录
	 * @since 1.0.0
	 */
	interface GetOperationRecord {
		/**
		 * @description 读取操作记录方式
		 * @see TTLOCK_READ_RECORD_TYPE
		 */
		logType: number;
		/**
		 * @description 智能锁初始化数据或管理员电子钥匙数据 
		 */
		lockData: string;
		/**
		 * @description 设备断连回调 
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 1.0.0
	 */
	interface CreateCustomPasscode {
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		passcode: string;
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		startDate: number;
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		endDate: number;
		/**
		 * @description eKey/lock data 
		 * @since 1.0.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 1.0.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 1.0.0
	 */
	interface ModifyPasscode {
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		originalPasscode: string;
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		passcode: string;
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		startDate: number;
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		endDate: number;
		/**
		 * @description eKey/lock data 
		 * @since 1.0.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 1.0.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 1.0.0
	 */
	interface DeletePasscode {
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		passcode: string;
		/**
		 * @description eKey/lock data 
		 * @since 1.0.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 1.0.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 3.1.0
	 */
	interface ResetPasscode {
		/**
		 * @description eKey/lock data 
		 * @since 3.1.0
		 */
		serverTime?: number;
		/**
		 * @description eKey/lock data 
		 * @since 3.1.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 3.1.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 1.0.0
	 */
	interface GetValidPasscode {
		/**
		 * @description eKey/lock data 
		 * @since 1.0.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 1.0.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.6.0
	 */
	interface GetAdminPasscode {
		/**
		 * @description eKey/lock data 
		 * @since 2.6.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.6.0
	 */
	interface ModifyAdminPasscode {
		/**
		 * @description eKey/lock data 
		 * @since 2.6.0
		 */
		newPasscode: string;
		/**
		 * @description eKey/lock data 
		 * @since 2.6.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 1.0.0
	 */
	interface AddICCard {
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		startDate: number;
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		endDate: number;
		/**
		 * @description eKey/lock data 
		 * @since 1.0.0
		 */
		lockData: string;
		/**
		 * @description eKey/lock data 
		 * @since 1.0.0
		 */
		callback?: (result: TTLockError) => void;
		/**
		 * @description Callback on disconnect 
		 * @since 1.0.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.6.3
	 */
	interface RecoverICCard {
		/**
		 * @description Action type for control lock
		 * @since 2.6.3
		 */
		cardNum: string | number;
		/**
		 * @description Action type for control lock
		 * @since 2.6.3
		 */
		startDate: number;
		/**
		 * @description Action type for control lock
		 * @since 2.6.3
		 */
		endDate: number;
		/**
		 * @description eKey/lock data 
		 * @since 2.6.3
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.6.3
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 1.0.0
	 */
	interface ModifyICCard {
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		cardNum: string | number;
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		startDate: number;
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		endDate: number;
		/**
		 * @description eKey/lock data 
		 * @since 1.0.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 1.0.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 1.0.0
	 */
	interface DeleteICCard {
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		cardNum: string | number;
		/**
		 * @description eKey/lock data 
		 * @since 1.0.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 1.0.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.8.2
	 */
	interface GetValidICCard {
		/**
		 * @description eKey/lock data 
		 * @since 1.0.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 1.0.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 1.0.0
	 */
	interface AddFingerprint {
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		startDate: number;
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		endDate: number;
		/**
		 * @description eKey/lock data 
		 * @since 1.0.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 1.0.0
		 */
		callback?: (result: TTLockError) => void;
		/**
		 * @description Callback on disconnect 
		 * @since 1.0.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 1.0.0
	 */
	interface ModifyFingerprint {
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		fingerprintNum: string | number;
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		startDate: number;
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		endDate: number;
		/**
		 * @description eKey/lock data 
		 * @since 1.0.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 1.0.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 1.0.0
	 */
	interface DeleteFingerprint {
		/**
		 * @description Action type for control lock
		 * @since 1.0.0
		 */
		fingerprintNum: string | number;
		/**
		 * @description eKey/lock data 
		 * @since 1.0.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 1.0.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.8.2
	 */
	interface GetValidFingerprint {
		/**
		 * @description eKey/lock data 
		 * @since 1.0.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 1.0.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 3.1.0
	 */
	interface DeleteFace {
		/**
		 * @description Action type for control lock
		 * @since 3.1.0
		 */
		faceNumber: string;
		/**
		 * @description eKey/lock data 
		 * @since 3.1.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 3.1.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.7.3
	 */
	interface GetLockStatus {
		/**
		 * @description eKey/lock data 
		 * @since 2.7.3
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.7.3
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.3.0
	 */
	interface SetRemoteUnlockSwitch {
		/**
		 * @description eKey/lock data 
		 * @since 2.3.0
		 */
		enable: boolean;
		/**
		 * @description eKey/lock data 
		 * @since 2.3.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.3.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.3.0
	 */
	interface GetRemoteUnlockSwitch {
		/**
		 * @description eKey/lock data 
		 * @since 2.3.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.3.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/** @description 设备开关状态配置信息 */
	interface SwitchConfigs {
		tamperAlert?: boolean; // 是否打开防撬警报
		resetButton?: boolean; // 使能/禁用重置按键
		privacyLock?: boolean; // 使能/禁用反锁开关
		unlockDirection?: boolean; // 左右开门设置（true为左开门，false为右开门)
		pasageModeAutoUnlockSetting?: boolean; // 使能/禁用常开模式自动开锁
		wifiPowerSavingMode?: boolean; // 是否开启WiFi省电模式(3.1.0)
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.5.0
	 */
	interface SetLockSwitch {
		/**
		 * @description eKey/lock data 
		 * @since 2.5.0
		 */
		configType: number;
		/**
		 * @description eKey/lock data 
		 * @since 2.5.0
		 */
		switchOn: boolean;
		/**
		 * @description eKey/lock data 
		 * @since 2.5.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.5.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.5.0
	 */
	interface GetLockSwitch {
		/**
		 * @description eKey/lock data 
		 * @since 2.5.0
		 */
		configType: number;
		/**
		 * @description eKey/lock data 
		 * @since 2.5.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.5.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.4.0
	 */
	interface HotelData {
		/**
		 * @description 通过开放平台接口或相关jar包获取的酒店信息串, 必传
		 * @since 2.4.0
		 */
		hotelInfo: string;
		/**
		 * @description 楼栋号，[0, 254]的正整数，必传
		 * @since 2.4.0
		 */
		buildingNumber: number;
		/**
		 * @description 楼层号，[0, 255]的正整数，普通酒店锁传入
		 * @since 2.4.0
		 */
		floorNumber?: number;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.4.0
	 */
	interface SetHotelData {
		/**
		 * @description eKey/lock data 
		 * @since 2.4.0
		 */
		hotelData: HotelData;
		/**
		 * @description eKey/lock data 
		 * @since 2.4.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.4.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.4.0
	 */
	interface SetHotelSector {
		/**
		 * @description eKey/lock data 
		 * @since 2.4.0
		 */
		sectors: Array<number>;
		/**
		 * @description eKey/lock data 
		 * @since 2.4.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.4.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.7.0
	 */
	interface SetLiftWorkMode {
		/**
		 * @description eKey/lock data 
		 * @since 2.7.0
		 */
		workMode: number;
		/**
		 * @description eKey/lock data 
		 * @since 2.7.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.7.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.7.0
	 */
	interface SetLiftControlableFloors {
		/**
		 * @description eKey/lock data 
		 * @since 2.7.0
		 */
		floors: Array<number>;
		/**
		 * @description eKey/lock data 
		 * @since 2.7.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.7.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.8.5
	 */
	interface SetPowerSaverWorkMode {
		/**
		 * @description eKey/lock data 
		 * @since 2.8.5
		 */
		powerSaverWorkMode: number;
		/**
		 * @description eKey/lock data 
		 * @since 2.8.5
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.8.5
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.8.5
	 */
	interface SetPowerSaverControlableLock {
		/**
		 * @description eKey/lock data 
		 * @since 2.8.5
		 */
		lockMac: string;
		/**
		 * @description eKey/lock data 
		 * @since 2.8.5
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.8.5
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.7.6
	 */
	interface ScanWiFi {
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.7.6
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.7.6
	 */
	interface WiFiConfig {
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		SSID: string;
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		password: string;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.7.6
	 */
	interface ConfigWiFi {
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		config: WiFiConfig;
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.7.6
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.7.6
	 */
	interface ServerInfo {
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		server?: string;
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		ipAddress?: string;
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		port: number;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.7.6
	 */
	interface ConfigServer {
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		config: ServerInfo;
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.7.6
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.7.6
	 */
	interface StaticIPAddress {
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		ipAddress: string;
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		subnetMask: string;
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		router: string;
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		dns1: string;
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		dns2: string;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.7.6
	 */
	interface IPSetting {
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		useDHCP: boolean;
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		ipAddress?: StaticIPAddress;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.7.6
	 */
	interface ConfigIP {
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		ipSetting: IPSetting;
		/**
		 * @description eKey/lock data 
		 * @since 2.7.6
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.7.6
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 3.1.0
	 */
	interface SavePowerConfig {
		/**
		 * @description 常开模式类型
		 * @since 3.1.0
		 */
		type?: number;
		/**
		 * @description 常开日，周模式传入[1,7]的数组，表示周一-周日, 月模式传入[1,31]的数组，表示常开日期
		 * @since 3.1.0
		 */
		weekDays?: number[];
		/**
		 * @description 常开开始分钟数
		 * @since 3.1.0
		 */
		startDate: number;
		/**
		 * @description 常开开始分钟数
		 * @since 3.1.0
		 */
		endDate: number;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 3.1.0
	 */
	interface ConfigSavePower {
		/**
		 * @description eKey/lock data 
		 * @since 3.1.0
		 */
		config: SavePowerConfig;
		/**
		 * @description eKey/lock data 
		 * @since 3.1.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 3.1.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 3.1.0
	 */
	interface GetSavePower {
		/**
		 * @description eKey/lock data 
		 * @since 3.1.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 3.1.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 3.1.0
	 */
	interface ClearSavePower {
		/**
		 * @description eKey/lock data 
		 * @since 3.1.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 3.1.0
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.8.2
	 */
	interface PassageModeConfig {
		/**
		 * @description 常开模式类型
		 * @since 2.8.2
		 */
		type: number;
		/**
		 * @description 常开日，周模式传入[1,7]的数组，表示周一-周日, 月模式传入[1,31]的数组，表示常开日期
		 * @since 2.8.2
		 */
		 repeatWeekOrDays?: number[];
		/**
		 * @description 常开开始分钟数
		 * @since 2.8.2
		 */
		startDate: number;
		/**
		 * @description 常开开始分钟数
		 * @since 2.8.2
		 */
		endDate: number;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.8.2
	 */
	interface ConfigPassageMode {
		/**
		 * @description eKey/lock data 
		 * @since 2.8.2
		 */
		config: PassageModeConfig;
		/**
		 * @description eKey/lock data 
		 * @since 2.8.2
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.8.2
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.8.2
	 */
	interface GetPassageMode {
		/**
		 * @description eKey/lock data 
		 * @since 2.8.2
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.8.2
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.8.2
	 */
	interface ClearPassageMode {
		/**
		 * @description eKey/lock data 
		 * @since 2.8.2
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.8.2
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.8.2
	 */
	interface SetAutoLock {
		/**
		 * @description eKey/lock data 
		 * @since 2.8.2
		 */
		seconds: number;
		/**
		 * @description eKey/lock data 
		 * @since 2.8.2
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.8.2
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.8.2
	 */
	interface GetAutoLock {
		/**
		 * @description eKey/lock data 
		 * @since 2.8.2
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.8.2
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.8.4
	 */
	interface SetSoundVolume {
		/**
		 * @description eKey/lock data 
		 * @since 2.8.4
		 */
		soundVolume: number;
		/**
		 * @description eKey/lock data 
		 * @since 2.8.4
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.8.4
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.8.4
	 */
	interface GetSoundVolume {
		/**
		 * @description eKey/lock data 
		 * @since 2.8.4
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 2.8.4
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.9.0
	 */
	interface DfuPackageInfo {
		/**
		 * @description Action type for control lock
		 * @since 2.9.0
		 */
		clientId: string;
		/**
		 * @description Action type for control lock
		 * @since 2.9.0
		 */
		accessToken: string;
		/**
		 * @description Action type for control lock
		 * @since 2.9.0
		 */
		lockId: number;
	}
	
	/**
	 * @description Params for control smart lock
	 * @since 2.9.0
	 */
	interface EnterDfuMode {
		/**
		 * @description Action type for control lock
		 * @since 2.9.0
		 */
		dfuPackageInfo: DfuPackageInfo;
		/**
		 * @description eKey/lock data 
		 * @since 1.0.0
		 */
		lockData: string;
		/**
		 * @description Callback on disconnect 
		 * @since 1.0.0
		 */
		callback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description Result for control smart lock
	 * @since 1.0.0
	 */
	interface ControlLockCallback extends TTLockError {
		uid?: number; // 操作用户ID
		uniqueid?: number; // 唯一标识(controlLock控制智能锁)
		lockTime?: number; // 锁中当前时间的时间戳(controlLock控制智能锁)
		controlAction?: number; // 操作类型(controlLock控制智能锁)
	}
}

/**
 * 查询智能锁版本信息参数
 */
declare type TTLockGetVersion = TTLock.GetLockVersion;

/**
 * 初始化智能锁参数信息
 */
declare type TTLockInit = TTLock.InitLock;

/**
 * 重置智能锁参数信息
 */
declare type TTLockReset = TTLock.ResetLock;

/**
 * 设置锁时间参数信息
 */
declare type TTLockSetTime = TTLock.SetLockTime;

/**
 * 控制智能锁参数信息
 */
declare type TTLockControl = TTLock.ControlLock;

/**
 * 读取智能锁操作记录参数信息
 */
declare type TTLockGetOperationLog = TTLock.GetOperationRecord;

/**
 * 添加自定义密码参数信息
 */
declare type TTLockCreateCustomPasscode = TTLock.CreateCustomPasscode;

/**
 * 修改键盘密码参数信息
 */
declare type TTLockModifyPasscode = TTLock.ModifyPasscode;

/**
 * 删除密码参数信息
 */
declare type TTLockDeletePasscode = TTLock.DeletePasscode;

/**
 * 重置普通键盘密码参数信息
 * @since 3.1.0
 */
declare type TTLockResetPasscode = TTLock.ResetPasscode;

/**
 * 读取智能锁内所有有效键盘密码参数信息
 * @since 2.8.2
 */
declare type TTLockGetAllValidPasscode = TTLock.GetValidPasscode;

/**
 * 查询管理员密码参数信息
 * @since 2.6.0
 */
declare type TTLockGetAdminPasscode = TTLock.GetAdminPasscode;

/**
 * 修改管理员键盘密码参数信息
 * @since 2.6.0
 */
declare type TTLockModifyAdminPasscode = TTLock.ModifyAdminPasscode;

/**
 * 添加IC卡参数信息
 */
declare type TTLockAddICCard = TTLock.AddICCard;

/**
 * 通过卡号恢复/添加IC卡参数信息
 * @since 2.6.3
 */
declare type TTLockRecoverICCard = TTLock.RecoverICCard;

/**
 * 修改IC卡有效期参数信息
 */
declare type TTLockModifyICCardPeriod = TTLock.ModifyICCard;

/**
 * 删除IC卡参数信息
 */
declare type TTLockDeleteICCard = TTLock.DeleteICCard;

/**
 * 读取智能锁内所有有效IC卡参数信息
 * @since 2.8.2
 */
declare type TTLockGetAllValidICCard = TTLock.GetValidICCard;

/**
 * 添加指纹参数信息
 */
declare type TTLockAddFingerprint = TTLock.AddFingerprint;

/**
 * 修改指纹有效期参数信息
 */
declare type TTLockModifyFingerprintPeriod = TTLock.ModifyFingerprint;

/**
 * 删除指纹参数信息
 */
declare type TTLockDeleteFingerprint = TTLock.DeleteFingerprint;

/**
 * 读取智能锁内所有有效指纹参数信息
 * @since 2.8.2
 */
declare type TTLockGetAllValidFingerprint = TTLock.GetValidFingerprint;

/**
 * 删除人脸参数信息
 * @since 3.1.0
 */
declare type TTLockDeleteFace = TTLock.DeleteFace;

/**
 * 查询智能锁开闭状态参数信息
 * @since 2.7.3
 */
declare type TTLockGetLockStatus = TTLock.GetLockStatus;

/**
 * 设置智能锁远程开关开启状态参数
 * @since 2.3.0
 */
declare type TTLockSetRemoteUnlockSwitchState = TTLock.SetRemoteUnlockSwitch;

/**
 * 查询智能锁远程开关开启状态参数
 * @since 2.3.0
 */
declare type TTLockGetRemoteUnlockSwitchState = TTLock.GetRemoteUnlockSwitch;

/**
 * 设置智能锁开关开启状态参数
 * @since 2.5.0
 */
declare type TTLockSetLockConfig = TTLock.SetLockSwitch;

/**
 * 查询智能锁开关开启状态参数
 * @since 2.5.0
 */
declare type TTLockGetLockConfig = TTLock.GetLockSwitch;

/**
 * 配置酒店信息参数
 * @since 2.4.0
 */
declare type TTLockSetHotelData = TTLock.SetHotelData;

/**
 * 配置酒店锁卡系统使用扇区参数
 * @since 2.4.0
 */
declare type TTLockSetHotelSector = TTLock.SetHotelSector;

/**
 * 设置梯控工作模式参数
 * @since 2.7.0
 */
declare type TTLockSetLiftWorkMode = TTLock.SetLiftWorkMode;

/**
 * 设置梯控关联楼层参数
 * @since 2.7.0
 */
declare type TTLockSetLiftControlableFloors = TTLock.SetLiftControlableFloors;

/**
 * 设置取电开关工作模式参数
 * @since 2.8.5
 */
declare type TTLockSetPowerSaverWorkMode = TTLock.SetPowerSaverWorkMode;

/**
 * 设置取电开关关联的智能锁参数
 * @since 2.8.5
 */
declare type TTLockSetPowerSaverControlableLock = TTLock.SetPowerSaverControlableLock;

/**
 * 扫描智能锁附近可连接的wifi列表参数
 * @since 2.7.6
 */
declare type TTLockScanWifi = TTLock.ScanWiFi;

/**
 * 配置智能锁使用的wifi信息参数
 * @since 2.7.6
 */
declare type TTLockConfigWifi = TTLock.ConfigWiFi;

/**
 * 配置wifi锁连接的服务器信息参数
 * @since 2.7.6
 */
declare type TTLockConfigServer = TTLock.ConfigServer;

/**
 * 配置wifi锁本地IP信息参数
 * @since 2.7.6
 */
declare type TTLockConfigIP = TTLock.ConfigIP;

/**
 * 配置wifi锁省电模式时间段参数
 * @since 3.1.0
 */
declare type TTLockConfigSavePower = TTLock.ConfigSavePower;

/**
 * 查询wifi锁省电模式时间段参数
 * @since 3.1.0
 */
declare type TTLockGetSavePower = TTLock.GetSavePower;

/**
 * 清空wifi锁省电模式时间段参数
 * @since 3.1.0
 */
declare type TTLockClearSavePower = TTLock.ClearSavePower;

/**
 * 设置智能锁常开模式参数
 * @since 2.8.2
 */
declare type TTLockConfigPassageMode = TTLock.ConfigPassageMode;

/**
 * 查询智能锁常开模式设置参数
 * @since 2.8.2
 */
declare type TTLockGetPassageMode = TTLock.GetPassageMode;

/**
 * 清空常开模式设置参数
 * @since 2.8.2
 */
declare type TTLockClearPassageMode = TTLock.ClearPassageMode;

/**
 * 设置自动闭锁时间参数
 * @since 2.8.2
 */
declare type TTLockSetAutomaticLockingPeriod = TTLock.SetAutoLock;

/**
 * 查询自动闭锁时间参数
 * @since 2.8.2
 */
declare type TTLockGetAutomaticLockingPeriod = TTLock.GetAutoLock;

/**
 * 设置智能锁音量参数
 * @since 2.8.4
 */
declare type TTLockSetLockSoundWithSoundVolume = TTLock.SetSoundVolume;

/**
 * 查询智能锁音量参数
 * @since 2.8.4
 */
declare type TTLockGetLockSoundWithSoundVolume = TTLock.GetSoundVolume;

/**
 * 智能锁固件升级参数
 * @since 2.9.0
 */
declare type TTLockEnterDfuMode = TTLock.EnterDfuMode;