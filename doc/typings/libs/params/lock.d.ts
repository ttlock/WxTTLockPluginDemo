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
	 * *
	 */
	interface InitLock {
		/**
		 * @description 扫描到的智能锁信息
		 */
		deviceFromScan: TTLock.DeviceModel;
		/**
		 * @description 设备断连回调 
		 */
		disconnectCallback?: (result: TTLockError) => void;
		/**
		 * @description 智能锁约定字符串(定制锁板必传)
		 */
		vendor?: string;
		/**
		 * @description 服务器时间戳
		 */
		serverTime?: number;
	}
	
	/**
	 * 重置智能锁
	 * *
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
		 */
		disconnectCallback?: (result: TTLockError) => void;
		/**
		 * @description 梯控开启楼层列表(梯控传入)
		 */
		floorList?: Array<number>;
		/**
		 * @description 服务器时间戳，用于校准服务器时间，不传则默认从服务器获取时间戳，获取失败后取本地时间
		 */
        serverTime?: number;
	}
	
	/**
	 * 读取智能锁操作记录
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
	 * @description 添加自定义密码
	 */
	interface CreateCustomPasscode {
		/**
		 * @description 自定义密码值
		 */
		passcode: string;
		/**
		 * @description 密码有效期开始时间
		 */
		startDate: number;
		/**
		 * @description 密码有效期结束时间
		 */
		endDate: number;
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
	 * @description 修改密码及其有效期
	 */
	interface ModifyPasscode {
		/**
		 * @description 原始密码
		 */
		originalPasscode: string;
		/**
		 * @description 新密码
		 */
		passcode: string;
		/**
		 * @description 密码有效期开始时间
		 */
		startDate: number;
		/**
		 * @description 密码有效期结束时间
		 */
		endDate: number;
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
	 * @description 删除密码
	 */
	interface DeletePasscode {
		/**
		 * @description 密码值
		 */
		passcode: string;
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
	 * @description 重置普通键盘密码
	 */
	interface ResetPasscode {
		/**
		 * @description 服务器时间
		 */
		serverTime?: number;
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
	 * @description 查询智能锁内所有有效密码列表
	 */
	interface GetValidPasscode {
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
	 * @description 查询管理员密码
	 */
	interface GetAdminPasscode {
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
	 * @description 修改管理员密码
	 */
	interface ModifyAdminPasscode {
		/**
		 * @description 管理员新密码
		 */
		newPasscode: string;
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
	 * @description 录入IC卡
	 */
	interface AddICCard {
		/**
		 * @description IC卡有效期开始时间
		 */
		startDate: number;
		/**
		 * @description IC卡有效期结束时间
		 */
		endDate: number;
		/**
		 * @description 智能锁初始化数据或管理员电子钥匙数据 
		 */
		lockData: string;
		/**
		 * @description 中间步骤回调 
		 */
		callback?: (result: TTLock.AddICCardResult) => void;
		/**
		 * @description 设备断连回调 
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description 通过卡号添加/恢复IC卡
	 */
	interface RecoverICCard {
		/**
		 * @description IC卡卡号，3.1.0取消参数类型限制
		 */
		cardNum: string | number;
		/**
		 * @description IC卡有效期开始时间
		 */
		startDate: number;
		/**
		 * @description IC卡有效期结束时间
		 */
		endDate: number;
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
	 * @description 修改IC卡有效期
	 */
	interface ModifyICCard {
		/**
		 * @description IC卡卡号，3.1.0取消参数类型限制
		 */
		cardNum: string | number;
		/**
		 * @description IC卡有效期开始时间
		 */
		startDate: number;
		/**
		 * @description IC卡有效期结束时间
		 */
		endDate: number;
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
	 * @description 删除IC卡
	 */
	interface DeleteICCard {
		/**
		 * @description IC卡卡号，3.1.0取消参数类型限制
		 */
		cardNum: string | number;
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
	 * @description 查询智能锁内所有有效IC卡列表
	 */
	interface GetValidICCard {
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
	 * @description 添加指纹
	 */
	interface AddFingerprint {
		/**
		 * @description 指纹有效期开始时间
		 */
		startDate: number;
		/**
		 * @description 指纹有效期结束时间
		 */
		endDate: number;
		/**
		 * @description 智能锁初始化数据或管理员电子钥匙数据 
		 */
		lockData: string;
		/**
		 * @description 中间步骤回调 
		 */
		callback?: (result: TTLock.AddFingerprintResult) => void;
		/**
		 * @description 设备断连回调 
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}
	
	/**
	 * @description 修改指纹有效期
	 */
	interface ModifyFingerprint {
		/**
		 * @description 指纹编号，3.1.0取消参数类型限制
		 */
		fingerprintNum: string | number;
		/**
		 * @description 指纹有效期开始时间
		 */
		startDate: number;
		/**
		 * @description 指纹有效期结束时间
		 */
		endDate: number;
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
	 * @description 删除指纹
	 */
	interface DeleteFingerprint {
		/**
		 * @description 指纹编号，3.1.0取消参数类型校验
		 */
		fingerprintNum: string | number;
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
	 * @description 读取智能锁内所有有效指纹列表
	 */
	interface GetValidFingerprint {
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
	 * @description 删除人脸
	 */
	interface DeleteFace {
		/**
		 * @description 人脸编号
		 */
		faceNumber: string;
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
	 * @description 录入人脸
	 */
	interface AddFace {
		/**
		 * @description 人脸有效期开始时间
		 */
		startDate: number;
		/**
		 * @description 人脸有效期结束时间
		 */
		endDate: number;
		/**
		 * @description 智能锁初始化数据或管理员电子钥匙数据
		 */
		lockData: string;
		/**
		 * @description 中间步骤回调
		 */
		callback?: (result: TTLockError) => void;
		/**
		 * @description 设备断连回调
		 */
		disconnectCallback?: (result: TTLockError) => void;
	}

	/**
	 * @description 修改人脸有效期
	 */
	interface ModifyFace {
		/**
		 * @description 人脸编号
		 */
		faceNumber: string;
		/**
		 * @description 人脸有效期开始时间
		 */
		startDate: number;
		/**
		 * @description 人脸有效期结束时间
		 */
		endDate: number;
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
	 * @description 获取Cat.1模块信息
	 */
	interface GetCatOneInfo {
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
	 * @description 配置Cat.1锁APN
	 */
	interface ConfigApn {
		/**
		 * @description SIM卡APN接入点名称
		 */
		apn: string;
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
	 * @description 查询智能锁开闭状态
	 */
	interface GetLockStatus {
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
	 * @description 设置智能锁远程开关开启状态
	 */
	interface SetRemoteUnlockSwitch {
		/**
		 * @description 是否打开远程开锁开关
		 */
		enable: boolean;
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
	 * @description 查询智能锁远程开关开启状态
	 */
	interface GetRemoteUnlockSwitch {
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
	 * @description 设置智能锁开关开启状态
	 */
	interface SetLockSwitch {
		/**
		 * @description 智能锁开关类型
         * @see TTLOCK_SWITCH_CONFIG_TYPE 
		 */
		configType: number;
		/**
		 * @description 是否打开开关 
		 */
		switchOn: boolean;
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
	 * @description 查询智能锁开关开启状态
	 */
	interface GetLockSwitch {
		/**
		 * @description 智能锁开关类型
         * @see TTLOCK_SWITCH_CONFIG_TYPE 
		 */
		configType: number;
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
	 * @description 酒店配置信息
	 */
	interface HotelData {
		/**
		 * @description 通过开放平台接口或相关jar包获取的酒店信息串, 必传
		 */
		hotelInfo: string;
		/**
		 * @description 楼栋号，[1, 254]的正整数，必传
		 */
		buildingNumber: number;
		/**
		 * @description 楼层号，[1, 255]的正整数，普通酒店锁传入
		 */
		floorNumber?: number;
	}
	
	/**
	 * @description 置酒店锁卡系统使用的酒店信息
	 */
	interface SetHotelData {
		/**
		 * @description 酒店配置信息
		 */
		hotelData: HotelData;
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
	 * @description 设置酒店锁卡系统使用的扇区信息
	 */
	interface SetHotelSector {
		/**
         * 使用的扇区信息
		 * @description 1-16组成的数组，分别代表1-16号扇区可用，不能为空不可重复
		 */
		sectors: Array<number>;
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
	 * @description 设置梯控工作模式
	 */
	interface SetLiftWorkMode {
		/**
		 * @description 梯控工作模式
         * @see TTLOCK_LIFT_WORKMODE
		 */
		workMode: number;
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
	 * @description 设置梯控继电器关联的楼层列表
	 */
	interface SetLiftControlableFloors {
		/**
		 * @description 梯控关联的楼层列表映射信息，1-64组成的数组，最长64位，不能为空且不可重复
		 */
		floors: Array<number>;
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
	 * @description 查询取电开关工作模式
	 */
	interface SetPowerSaverWorkMode {
		/**
		 * @description 电开关工作模式
         * @see TTLOCK_POWER_SAVER_WORKMODE
		 */
		powerSaverWorkMode: number;
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
	 * @description 配置取电开关关联的智能锁
	 */
	interface SetPowerSaverControlableLock {
		/**
		 * @description 智能锁mac地址 
		 */
		lockMac: string;
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
	 * @description 扫描wifi锁附近可连接的wifi列表
	 */
	interface ScanWiFi {
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
	 * @description wifi配置信息
	 */
	interface WiFiConfig {
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
	 * @description 配置wifi锁连接的wifi信息
	 */
	interface ConfigWiFi {
		/**
		 * @description wifi配置信息 
		 */
		config: WiFiConfig;
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
	 * @description 远程服务器信息
	 */
	interface ServerInfo {
		/**
		 * @description 远程服务器域名地址，server与ipAddress二选一，优先生效
         * @default 常规填写: "cnwifilock.ttlock.com"
		 */
		server?: string;
		/**
		 * @description 远程服务器IP地址，server与ipAddress二选一，优先级次于server
		 */
		ipAddress?: string;
		/**
		 * @description 远程服务器端口号
         * @default 常规填写: 4999
		 */
		port: number;
	}
	
	/**
	 * @description 配置wifi锁远程服务器信息
	 */
	interface ConfigServer {
		/**
		 * @description 远程服务器信息
		 */
		config: ServerInfo;
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
	 * @description 本地固定IP地址配置信息
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
	 * @description 本地IP地址配置信息
	 */
	interface IPSetting {
		/**
		 * @description 是否使用DHCP动态获取本地IP地址, 设置为true时ipAddress不生效
		 */
		useDHCP: boolean;
		/**
		 * @description 固定IP地址，useDHCP = false时必填
		 */
		ipAddress?: StaticIPAddress;
	}
	
	/**
	 * @description 配置wifi锁本地IP信息
	 */
	interface ConfigIP {
		/**
		 * @description 本地IP地址配置信息 
		 */
		ipSetting: IPSetting;
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
	 * @description wifi锁省电模式时间段配置信息
	 */
	interface PowerSavingConfig {
		/**
         * 省电模式配置类型，当前仅支持按周开启
		 * @description 1 -按周开启
		 */
		type?: number;
		/**
         * 省电模式开启日
		 * @description 按周开启：传入[1,7]的数组，表示周一-周日
		 */
		weekDays?: number[];
		/**
		 * @description 省电模式开始分钟数，全天传入0
		 */
		startDate: number;
		/**
		 * @description 省电模式结束分钟数，全天传入0
		 */
		endDate: number;
	}
	
	/**
	 * @description 设置wifi锁省电模式时间段
	 */
	interface ConfigPowerSaving {
		/**
		 * @description wifi锁省电模式时间段配置信息
		 */
		config: PowerSavingConfig;
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
	 * @description 查询wifi锁省电模式设置
	 */
	interface GetPowerSaving {
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
	 * @description 清空wifi锁省电模式设置
	 */
	interface ClearPowerSaving {
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
	 * @description 智能锁常开模式配置信息
	 */
	interface PassageModeConfig {
		/**
		 * @description 常开模式类型
         * @see TTLOCK_PASSAGE_WORKMODE
		 */
		type: number;
		/**
		 * @description 常开日，周模式传入[1,7]的数组，表示周一-周日, 月模式传入[1,31]的数组，表示常开日期
		 */
		 repeatWeekOrDays: number[];
		/**
         * 常开开始分钟数
		 * @description 3.1.0 全天设置为0
		 */
		startDate: number;
		/**
         * 常开结束分钟数
		 * @description 3.1.0 全天设置为0
		 */
		endDate: number;
	}
	
	/**
	 * @description 设置智能锁常开模式
	 */
	interface ConfigPassageMode {
		/**
		 * @description 常开模式设置 
		 */
		config: PassageModeConfig;
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
	 * @description 查询智能锁常开模式设置
	 */
	interface GetPassageMode {
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
	 * @description 清空智能锁常开模式设置
	 */
	interface ClearPassageMode {
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
	 * @description 设置智能锁自动闭锁时间
	 */
	interface SetAutoLock {
		/**
		 * @description 自动闭锁时间 
		 */
		seconds: number;
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
	 * @description 查询智能锁自动闭锁时间
	 */
	interface GetAutoLock {
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
	 * @description 设置智能锁音量
	 */
	interface SetSoundVolume {
		/**
		 * @description 智能锁音量
         * @see TTLOCK_SOUND_VOLUME
		 */
		soundVolume: number;
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
	 * @description 查询智能锁音量
	 */
	interface GetSoundVolume {
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
	 * @description 固件升级参数配置
	 */
	interface DfuPackageInfo {
		/**
		 * @description 开放平台应用ID
		 */
		clientId: string;
		/**
		 * @description 用户账号登录令牌
		 */
		accessToken: string;
		/**
		 * @description 智能锁ID
		 */
		lockId: number;
	}
	
	/**
	 * @description 智能锁固件升级
	 */
	interface EnterDfuMode {
		/**
		 * @description 固件升级参数配置
		 */
		dfuPackageInfo: DfuPackageInfo;
		/**
		 * @description 智能锁初始化数据或管理员电子钥匙数据 
		 */
		lockData: string;
		/**
		 * @description 中间步骤回调
		 */
        callback?: (result: TTLock.EnterDfuModeResult) => void;
        /**
		 * @description 设备断连回调 
		 */
		disconnectCallback?: (result: TTLockError) => void;
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
 */
declare type TTLockResetPasscode = TTLock.ResetPasscode;

/**
 * 读取智能锁内所有有效键盘密码参数信息
 */
declare type TTLockGetAllValidPasscode = TTLock.GetValidPasscode;

/**
 * 查询管理员密码参数信息
 */
declare type TTLockGetAdminPasscode = TTLock.GetAdminPasscode;

/**
 * 修改管理员键盘密码参数信息
 */
declare type TTLockModifyAdminPasscode = TTLock.ModifyAdminPasscode;

/**
 * 添加IC卡参数信息
 */
declare type TTLockAddICCard = TTLock.AddICCard;

/**
 * 通过卡号恢复/添加IC卡参数信息
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
 */
declare type TTLockGetAllValidFingerprint = TTLock.GetValidFingerprint;

/**
 * 删除人脸参数信息
 */
declare type TTLockDeleteFace = TTLock.DeleteFace;

/**
 * 查询智能锁开闭状态参数信息
 */
declare type TTLockGetLockStatus = TTLock.GetLockStatus;

/**
 * 设置智能锁远程开关开启状态参数
 */
declare type TTLockSetRemoteUnlockSwitchState = TTLock.SetRemoteUnlockSwitch;

/**
 * 查询智能锁远程开关开启状态参数
 */
declare type TTLockGetRemoteUnlockSwitchState = TTLock.GetRemoteUnlockSwitch;

/**
 * 设置智能锁开关开启状态参数
 */
declare type TTLockSetLockConfig = TTLock.SetLockSwitch;

/**
 * 查询智能锁开关开启状态参数
 */
declare type TTLockGetLockConfig = TTLock.GetLockSwitch;

/**
 * 配置酒店信息参数
 */
declare type TTLockSetHotelData = TTLock.SetHotelData;

/**
 * 配置酒店锁卡系统使用扇区参数
 */
declare type TTLockSetHotelSector = TTLock.SetHotelSector;

/**
 * 设置梯控工作模式参数
 */
declare type TTLockSetLiftWorkMode = TTLock.SetLiftWorkMode;

/**
 * 设置梯控关联楼层参数
 */
declare type TTLockSetLiftControlableFloors = TTLock.SetLiftControlableFloors;

/**
 * 设置取电开关工作模式参数
 */
declare type TTLockSetPowerSaverWorkMode = TTLock.SetPowerSaverWorkMode;

/**
 * 设置取电开关关联的智能锁参数
 */
declare type TTLockSetPowerSaverControlableLock = TTLock.SetPowerSaverControlableLock;

/**
 * 扫描智能锁附近可连接的wifi列表参数
 */
declare type TTLockScanWifi = TTLock.ScanWiFi;

/**
 * 配置智能锁使用的wifi信息参数
 */
declare type TTLockConfigWifi = TTLock.ConfigWiFi;

/**
 * 配置wifi锁连接的服务器信息参数
 */
declare type TTLockConfigServer = TTLock.ConfigServer;

/**
 * 配置wifi锁本地IP信息参数
 */
declare type TTLockConfigIP = TTLock.ConfigIP;

/**
 * 配置wifi锁省电模式时间段参数
 */
declare type TTLockConfigPowerSaving = TTLock.ConfigPowerSaving;

/**
 * 查询wifi锁省电模式时间段参数
 */
declare type TTLockGetPowerSaving = TTLock.GetPowerSaving;

/**
 * 清空wifi锁省电模式时间段参数
 */
declare type TTLockClearPowerSaving = TTLock.ClearPowerSaving;

/**
 * 设置智能锁常开模式参数
 */
declare type TTLockConfigPassageMode = TTLock.ConfigPassageMode;

/**
 * 查询智能锁常开模式设置参数
 */
declare type TTLockGetPassageMode = TTLock.GetPassageMode;

/**
 * 清空常开模式设置参数
 */
declare type TTLockClearPassageMode = TTLock.ClearPassageMode;

/**
 * 设置自动闭锁时间参数
 */
declare type TTLockSetAutomaticLockingPeriod = TTLock.SetAutoLock;

/**
 * 查询自动闭锁时间参数
 */
declare type TTLockGetAutomaticLockingPeriod = TTLock.GetAutoLock;

/**
 * 设置智能锁音量参数
 */
declare type TTLockSetLockSoundWithSoundVolume = TTLock.SetSoundVolume;

/**
 * 查询智能锁音量参数
 */
declare type TTLockGetLockSoundWithSoundVolume = TTLock.GetSoundVolume;

/**
 * 智能锁固件升级参数
 */
declare type TTLockEnterDfuMode = TTLock.EnterDfuMode;

/**
 * 录入人脸参数
 */
declare type TTLockAddFace = TTLock.AddFace;

/**
 * 修改人脸有效期参数
 */
declare type TTLockModifyFace = TTLock.ModifyFace;

/**
 * 获取Cat.1模块信息参数
 */
declare type TTLockGetCatOneInfo = TTLock.GetCatOneInfo;

/**
 * 配置Cat.1锁APN参数
 */
declare type TTLockConfigApn = TTLock.ConfigApn;