/// <reference path="../options/index.d.ts" />
/// <reference path="../params/index.d.ts" />
/// <reference path="../result/index.d.ts" />
/**
 * 通用接口导出列表
 */
declare interface TTLockPlugin {
	/**
	 * 当前插件版本信息
	 * @since 1.0.0
	 */
    VERSION: string;
    
	/**
	 * 设置日志开关及回调方法
	 * @param open -日志开关
	 * @param callback -日志回调方法
	 * @since 1.0.0
	 */
	setShowLog(open: boolean, callback?: (...args: any | void) => any): void;
	
	/**
	 * @description 解析智能锁版本信息
	 * @param lockVersion -智能锁版本信息
	 * @since 1.0.0
	 */
    getLockType(lockVersion: TTLock.LockVersion): TTLOCK_TYPE;
    
    /**
	 * @description 解析智能锁特征值
	 * @param featureValue -智能锁特征值, 可传入specialValue或featureValue
	 * @since 2.1.0
	 */
    parseSpecialValues(featureValue: string | number): TTLock.FeatureValue;

	/**
	 * @description 开启蓝牙智能锁扫描
	 * @since 1.0.0
	 */
    startScanBleDevice(onFoundDevice: TTLock.OnScanCallback, failCallback: TTDevice.DefaultCallback): Promise<TTLockError>;

    /**
	 * @description 停止蓝牙智能锁扫描
	 * @since 1.0.0
	 */
    stopScanBleDevice(): Promise<TTLockError>;

    /**
	 * @description 开启蓝牙网关扫描
	 * @since 2.6.0
	 */
    startScanGateway(callback?: TTGateway.OnScanCallback, failCallback?: TTDevice.DefaultCallback): Promise<TTLockError>;

    /**
	 * @description 停止蓝牙网关扫描
	 * @since 2.6.0
	 */
    stopScanGateway(): Promise<TTLockError>;

    /**
	 * 强制停止所有操作并断开蓝牙
     * @description 该操作无法停止正在连接中的操作
	 * @since 1.0.0
	 */
    stopAllOperations(): Promise<TTLockError>;
    
	/**
	 * @description 批量操作结束，断开设备连接并释放资源
	 * @since 3.1.0
	 */
	finishOperations(): Promise<TTLockError>;
	
	/**
	 * @description 查询智能锁版本信息
	 * @since 1.0.0
	 */
    getLockVersion(option: TTLock.GetLockVersion): Promise<TTLockGetVersionResult>;
    
    /**
	 * @description 初始化蓝牙智能锁
	 * @since 1.3.2
	 */
    initLock(option: TTLockInit): Promise<TTLockInitResult>;

    /**
	 * @description 重置/删除蓝牙智能锁
	 * @since 1.3.2
	 */
    resetLock(option: TTLockReset): Promise<TTLockError>;

    /**
	 * @description 设置/校准智能锁时间
	 * @since 1.0.0
	 */
    setLockTime(option: TTLockSetTime): Promise<TTLockError>;

    /**
	 * @description 控制智能锁(智能锁开锁/闭锁)
	 * @since 1.0.0
	 */
    controlLock(option: TTLockControl): Promise<TTLockControlResult>;

    /**
	 * @description 读取智能锁操作记录
	 * @since 2.0.0
	 */
    getOperationLog(option: TTLockGetOperationLog): Promise<TTLockGetOperationLogResult>;

    /**
	 * @description 添加自定义密码
	 * @since 2.0.0
	 */
    createCustomPasscode(option: TTLockCreateCustomPasscode): Promise<TTLockCreateCustomPasscodeResult>;

    /**
	 * @description 修改密码及其有效期
	 * @since 2.0.0
	 */
    modifyPasscode(option: TTLockModifyPasscode): Promise<TTLockError>;

    /**
	 * @description 删除键盘密码
	 * @since 2.0.0
	 */
    deletePasscode(option: TTLockDeletePasscode): Promise<TTLockError>;

    /**
	 * @description 重置普通键盘密码
	 * @since 3.1.0
	 */
    resetPasscode(option: TTLockResetPasscode): Promise<TTLockResetPasscodeResult>;

    /**
	 * @description 获取智能锁内全部有效键盘密码
	 * @since 2.8.2
	 */
    getAllValidPasscode(option: TTLockGetAllValidPasscode): Promise<TTLockGetAllValidPasscodeResult>;

    /**
	 * @description 查询管理员密码
	 * @since 2.6.0
	 */
    getAdminPasscode(option: TTLockGetAdminPasscode): Promise<TTLockGetAdminPasscodeResult>;

    /**
	 * @description 修改管理员密码
	 * @since 2.6.0
	 */
    modifyAdminPasscode(option: TTLockModifyAdminPasscode): Promise<TTLockModifyAdminPasscodeResult>;

    /**
	 * @description 添加IC卡
	 * @since 2.0.0
	 */
    addICCard(option: TTLockAddICCard): Promise<TTLockAddICCardResult>;

    /**
	 * @description 通过卡号添加/恢复IC卡
	 * @since 2.6.3
	 */
    recoverICCardNumber(option: TTLockRecoverICCard): Promise<TTLockError>;

    /**
	 * @description 修改IC卡有效期
	 * @since 2.0.0
	 */
    modifyICCardValidityPeriod(option: TTLockModifyICCardPeriod): Promise<TTLockError>;

    /**
	 * @description 删除IC卡
	 * @since 2.0.0
	 */
    deleteICCard(option: TTLockDeleteICCard): Promise<TTLockError>;

    /**
	 * @description 查询智能锁内所有有效IC卡
	 * @since 2.8.2
	 */
    getAllValidICCard(option: TTLockGetAllValidICCard): Promise<TTLockGetAllValidICCardResult>;

    /**
	 * @description 添加指纹
	 * @since 2.0.0
	 */
    addFingerprint(option: TTLockAddFingerprint): Promise<TTLockAddFingerprintResult>;

    /**
	 * @description 修改指纹有效期
	 * @since 2.0.0
	 */
    modifyFingerprintValidityPeriod(option: TTLockModifyFingerprintPeriod): Promise<TTLockError>;

    /**
	 * @description 删除指纹
	 * @since 2.0.0
	 */
    deleteFingerprint(option: TTLockDeleteFingerprint): Promise<TTLockError>;

    /**
	 * @description 查询智能锁内所有有效指纹
	 * @since 2.8.2
	 */
    getAllValidFingerprint(option: TTLockGetAllValidFingerprint): Promise<TTLockGetAllValidFingerprintResult>;

    /**
	 * @description 删除人脸
	 * @since 3.1.0
	 */
    deleteFaceNumber(option: TTLockDeleteFace): Promise<TTLockError>;

    /**
	 * @description 查询智能锁开闭状态
	 * @since 2.7.3
	 */
    getLockStatus(option: TTLockGetLockStatus): Promise<TTLockGetLockStatusResult>;

    /**
	 * @description 设置远程开锁开关开启状态
	 * @since 2.3.0
	 */
    setRemoteUnlockSwitchState(option: TTLockSetRemoteUnlockSwitchState): Promise<TTLockSetRemoteUnlockSwitchStateResult>;

    /**
	 * @description 查询远程开锁开关开启状态
	 * @since 2.3.0
	 */
    getRemoteUnlockSwitchState(option: TTLockGetRemoteUnlockSwitchState): Promise<TTLockGetRemoteUnlockSwitchStateResult>;

    /**
	 * @description 设置智能锁开关开启状态
	 * @since 2.5.0
	 */
    setLockConfig(option: TTLockSetLockConfig): Promise<TTLockSetLockConfigResult>;

    /**
	 * @description 查询智能锁开关开启状态
	 * @since 2.5.0
	 */
    getLockConfig(option: TTLockGetLockConfig): Promise<TTLockGetLockConfigResult>;

    /**
	 * @description 设置酒店信息
	 * @since 2.4.0
	 */
    setHotelData(option: TTLockSetHotelData): Promise<TTLockError>;

    /**
	 * @description 配置酒店锁卡系统使用扇区
	 * @since 2.4.0
	 */
    setHotelSector(option: TTLockSetHotelSector): Promise<TTLockError>;

    /**
	 * @description 设置梯控工作模式
	 * @since 2.7.0
	 */
    setLiftWorkMode(option: TTLockSetLiftWorkMode): Promise<TTLockError>;

    /**
	 * @description 设置梯控关联楼层
	 * @since 2.7.0
	 */
    setLiftControlableFloors(option: TTLockSetLiftControlableFloors): Promise<TTLockError>;

    /**
	 * @description 设置取电开关工作模式
	 * @since 2.8.5
	 */
    setPowerSaverWorkMode(option: TTLockSetPowerSaverWorkMode): Promise<TTLockError>;

    /**
	 * @description 设置取电开关关联的智能锁
	 * @since 2.8.5
	 */
    setPowerSaverControlableLock(option: TTLockSetPowerSaverControlableLock): Promise<TTLockError>;

    /**
	 * @description wifi锁扫描附近可用改的wifi
	 * @since 2.7.6
	 */
    scanWifi(option: TTLockScanWifi): Promise<TTLockScanWifiResult>;

    /**
	 * @description 配置wifi锁连接的wifi
	 * @since 2.7.6
	 */
    configWifi(option: TTLockConfigWifi): Promise<TTLockError>;

    /**
	 * @description 配置wifi锁连接的服务器
	 * @since 2.7.6
	 */
    configServer(option: TTLockConfigServer): Promise<TTLockError>;

    /**
	 * @description 配置wifi锁本地IP信息
	 * @since 2.7.6
	 */
    configIp(option: TTLockConfigIP): Promise<TTLockError>;

    /**
	 * @description 配置wifi锁省电模式开启时间段
	 * @since 3.1.0
	 */
    configWifiPowerSavingTime(option: TTLockConfigPowerSaving): Promise<TTLockError>;

    /**
	 * @description 查询wifi锁省电模式开启时间段
	 * @since 3.1.0
	 */
    getWifiPowerSavingTime(option: TTLockGetPowerSaving): Promise<TTLockGetPowerSavingResult>;

    /**
	 * @description 清空wifi锁省电模式开启时间段
	 * @since 3.1.0
	 */
    clearWifiPowerSavingTime(option: TTLockClearPowerSaving): Promise<TTLockError>;

    /**
	 * @description 配置智能锁常开模式开启时间段
	 * @since 2.8.2
	 */
    configPassageMode(option: TTLockConfigPassageMode): Promise<TTLockError>;

    /**
	 * @description 查询智能锁常开模式开启时间段
	 * @since 2.8.2
	 */
    getPassageMode(option: TTLockGetPassageMode): Promise<TTLockGetPassageModeResult>;

    /**
	 * @description 清空智能锁常开模式开启时间段
	 * @since 2.8.2
	 */
    clearPassageMode(option: TTLockClearPassageMode): Promise<TTLockError>;

    /**
	 * @description 设置自动闭锁时间
	 * @since 2.8.2
	 */
    setAutomaticLockingPeriod(option: TTLockSetAutomaticLockingPeriod): Promise<TTLockError>;
    /**
	 * @description 查询自动闭锁时间
	 * @since 2.8.2
	 */
    getAutomaticLockingPeriod(option: TTLockGetAutomaticLockingPeriod): Promise<TTLockGetAutomaticLockingPeriodResult>;

    /**
	 * @description 设置智能锁音量
	 * @since 2.8.4
	 */
    setLockSoundWithSoundVolume(option: TTLockSetLockSoundWithSoundVolume): Promise<TTLockError>;

    /**
	 * @description 查询智能锁音量
	 * @since 2.8.4
	 */
    getLockSoundWithSoundVolume(option: TTLockGetLockSoundWithSoundVolume): Promise<TTLockGetLockSoundWithSoundVolumeResult>;

    /**
	 * @description 智能锁固件升级
	 * @since 2.9.0
	 */
    enterDfuMode(option: TTLockEnterDfuMode): Promise<TTLockEnterDfuModeResult>;

    /**
	 * @description 连接智能网关设备
	 * @since 2.6.0
	 */
    connectGateway(option: TTLockConnectGateway): Promise<TTLockError>;

    /**
	 * @description 搜索网关附近的wifi
	 * @since 2.6.0
	 */
    scanWiFiByGateway(option: TTLockScanWifiByGateway): Promise<TTLockScanWifiByGatewayResult>;

    /**
	 * @description 初始化蓝牙网关
	 * @since 2.6.0
	 */
    initGateway(option: TTLockInitGateway): Promise<TTLockInitGatewayResult>;
}