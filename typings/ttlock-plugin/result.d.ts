/// <reference path="./params.d.ts" />
/// <reference path="./options.d.ts" />

/** 操作记录结果 */
interface TTLockError {
    /* 通通锁常规错误码 */
    errorCode: ERROR_CODE;
    /* 错误信息描述 */
    errorMsg: string;
    /* 错误信息描述补充 */
    description?: string;
    /* 微信蓝牙接口返回错误码 */
    errCode?: number;
    /* 微信蓝牙错误信息描述 */
    errMsg?: string;
    /* 蓝牙设备ID */
    deviceId?: string; // 设备ID
    /* 是否支持重试 */
    isTryAgain?: boolean;
    /* 设备电量 */
    electricQuantity?: number;
}

/** 获取智能锁版本信息返回数据 */
interface TTLockGetVersionResult extends TTLockError {
    /* 智能锁版本信息 */
    lockVersion?: TTLockVersion;
}

/** 智能锁初始化返回数据 */
interface TTLockInitResult extends TTLockError {
    /* 智能锁初始化数据 */
    lockData?: string;
}

/** 控制智能锁返回数据 */
interface TTLockControlResult extends TTLockError {
    /* 控制智能锁记录ID(唯一标识) */
    uniqueid?: number;
    /* 当前智能锁锁时间戳 */
    lockTime?: number;
    /* 控制智能锁方式 */
    controlAction?: TTLOCK_CONTROL_TYPE;
}

/** 读取智能锁操作记录返回数据 */
interface TTLockGetOperationLogResult extends TTLockError {
    /* 锁内操作记录的json字符串，用于上传服务器 */
    log?: string;
}

/** 添加自定义密码 */
interface TTLockCreateCustomPasscodeResult extends TTLockError {
    /* 自定义密码 */
    passcode?: string;
}

/** 智能锁内有效密码信息 */
interface TTLockValidPasscode {
    /* 密码类型 */
    keyboardPwdType: TTLOCK_KEYBOARD_PWD_TYPE;
    /* 密码值 */
    keyboardPwd: string;
    /* 原密码值 */
    oldKeyboardPwd: string;
    /* 密码有效期开始时间 */
    startDate: number;
    /* 密码有效期结束时间 */
    endDate?: number;
    cycleType?: number;
}

/** 读取智能锁内所有有效密码 */
interface TTLockGetAllValidPasscodeResult extends TTLockError {
    /* 智能锁内全部有效密码列表 */
    keyboardPwdList?: Array<TTLockValidPasscode>;
}

/** 查询管理员密码 */
interface TTLockGetAdminPasscodeResult extends TTLockError {
    /* 管理员密码值 */
    passcode?: string;
}

/** 修改管理员密码 */
interface TTLockModifyAdminPasscodeResult extends TTLockError {
    /* 管理员密码值 3.0.0 */
    passcode?: string;
}

/** 添加IC卡中间步骤及结果 */
interface TTLockAddICCardResult extends TTLockError {
    /* 回调类型， 1 -IC卡添加完成，操作结束， 2 -已进入添加模式，请在锁上刷卡， 3 -IC卡数据已添加，正在修改有效期 */
    type?: number;
    /* IC卡添加成功后返回卡号 */
    cardNum?: number;
}

/** 智能锁内有效IC卡记录信息 */
interface TTLockValidICCard {
    /* IC卡卡号 */
    cardNo: number;
    /* IC卡有效期开始时间 */
    startDate: number;
    /* IC卡有效期结束时间 */
    endDate: number;
}

/** 读取智能锁内所有有效IC卡 */
interface TTLockGetAllValidICCardResult extends TTLockError {
    /* 智能锁内全部有效IC卡列表 */
    cardList?: Array<TTLockValidICCard>;
}

/** 添加指纹中间步骤及结果 */
interface TTLockAddFingerprintResult extends TTLockError {
    /* 回调类型， 1 -指纹完成添加，操作结束; 2 -已进入添加模式，请在设备上录入指纹; 3 -录入指纹步骤回调; 4 -指纹已录入，正在修改有效期; */
    type?: number;
    /* 指纹添加成功后返回指纹号 */
    fingerprintNum?: number;
    /* 录入指纹的总次数 */
    totalCount?: number;
    /* 当前录入指纹已完成的次数 */
    currentCount?: number;
}

/** 智能锁内有效指纹记录信息 */
interface TTLockValidFingerprint {
    /* 指纹号 */
    fingerprintNo: number;
    /* 指纹有效期开始时间 */
    startDate: number;
    /* 指纹有效期结束时间 */
    endDate: number;
}

/** 读取智能锁内所有有效指纹 */
interface TTLockGetAllValidFingerprintResult extends TTLockError {
    /* 智能锁内全部有效指纹列表 */
    fingerprintList?: Array<TTLockValidFingerprint>;
}

/** 查询智能锁远程开关开启状态结果 */
interface TTLockGetRemoteUnlockSwitchStateResult extends TTLockError {
    /* 远程开关开启状态 */
    enabled?: boolean;
    /* 智能锁更新数据，用于上传服务器，不可用于智能锁蓝牙操作 */
    lockData?: string; 
    /* 智能锁更新后特征值(完整数据)，2.3.1版本 */
    featureValue?: string;
    /** @deprecated 智能锁更新后特征值(低位数据，兼容低版本) */
    specialValue?: number;
}

/** 设置智能锁远程开关开启状态结果 */
interface TTLockSetRemoteUnlockSwitchStateResult extends TTLockError {
    /* 远程开关开启状态(3.0.0版本) */
    enabled?: boolean;
    /* 智能锁更新数据，用于上传服务器，不可用于智能锁蓝牙操作 */
    lockData?: string; 
    /* 智能锁更新后特征值(完整数据)，2.3.1版本 */
    featureValue?: string;
    /** @deprecated 智能锁更新后特征值(低位数据，兼容低版本) */
    specialValue?: number;
}

/** 设备开关状态配置信息（未查询/未设置/智能锁不支持的属性均不返回） */
interface TTLockSwitchConfig {
    /* 是否打开防撬警报 */
    tamperAlert?: boolean; // 是否打开防撬警报
    /* 使能/禁用长按重置按键重置智能锁 */
    resetButton?: boolean;
    /* 使能/禁用反锁开关 */
    privacyLock?: boolean;
    /* 左右开门设置（true为左开门，false为右开门) */
    unlockDirection?: boolean;
    /* 使能/禁用常开模式下自动开锁 */
    pasageModeAutoUnlockSetting?: boolean; // 使能/禁用常开模式自动开锁
}

/** 查询智能锁开关开启状态结果 */
interface TTLockGetLockConfigResult extends TTLockError {
    /* 已开启的开关配置属性（未查询或锁不支持的属性均不返回） */
    lockConfigType?: number;
    /* 开关配置属性实际开启状态解析数据（未查询或锁不支持的属性均不返回） */
    lockConfigs?: TTLockSwitchConfig;
}

/** 设置智能锁开关开启状态结果 */
interface TTLockSetLockConfigResult extends TTLockError {
    /* 已开启的开关配置属性（未查询或锁不支持的属性均不返回） */
    lockConfigType?: number;
    /* 开关配置属性实际开启状态解析数据（未查询或锁不支持的属性均不返回） */
    lockConfigs?: TTLockSwitchConfig;
}

/** 查询智能锁是否已处于开锁状态 */
interface TTLockGetLockStatusResult extends TTLockError {
     /* 智能锁开闭状态 */
    lockStatus?: TTLOCK_STATUS;
}

/** @description 常开模式信息 */
interface TTLockPassageModeData {
    /* 常开工作模式 */
    type: TTLOCK_PASSAGE_WORKMODE;
    /* 常开日: 周模式下1-7,表示周一~周日;月模式下1-31,表示常开日期 */
    weekOrDay: number;
    /* 月，保留位 */
    month: number;
    /* 常开时间开始分钟数 */
    startDate: number;
    /* 常开时间结束分钟数 */
    endDate: number;
}

/** 查询智能锁常开模式配置信息 */
interface TTLockGetPassageModeResult extends TTLockError {
    /* 常开模式配置信息 */
    passageModeConfigList?: Array<TTLockPassageModeData>;
}

/** @description 自动闭锁配置信息 */
interface TTLockAutoLockInfo {
    /* 是否开启超时自动闭锁 */
    enable?: boolean;
    /* 超时自动闭锁时间 */
    autoLockTime?: number;
    /* 允许设置的自动闭锁时间最小值 */
    minAutoLockTime?: number;
    /* 允许设置的自动闭锁时间最大值 */
    maxAutoLockTime?: number;
}

/** 查询自动闭锁配置信息 */
interface TTLockGetAutomaticLockingPeriodResult extends TTLockError {
    /* 自动闭锁配置信息 */
    autoLockInfo?: TTLockAutoLockInfo;
}

/** 查询智能锁音量配置信息 */
interface TTLockGetLockSoundWithSoundVolumeResult extends TTLockError {
    /* 智能锁音量设置 */
    soundVolume?: TTLOCK_SOUND_VOLUME;
}

/** 智能锁固件升级结果及中间步骤回调信息 */
interface TTLockEnterDfuModeResult extends TTLockError {
    /* 回调类型：1 -智能锁升级准备中; 2 -固件升级中(请勿打断); 3 -固件升级完成，正在获取新的所数据; 4 -操作成功; 5 -固件升级成功，但同步服务器失败 */
    type?: number;
    /* 固件升级进度, type=2时返回 */
    progress?: number;
    /* 智能锁更新数据，操作成功后用于上传服务器更新数据，不可用于蓝牙操作 */
    lockData?: string;
}

/** 扫描智能锁附近可用的wifi列表返回数据域 */
interface TTLockScanWifiResultData {
    /* 智能锁附近可用的wifi列表 */
    wifiList?: Array<TTLockWifiFromScan>;
}

/** 扫描智能锁附近可用的wifi列表返回数据 */
interface TTLockScanWifiResult extends TTLockError {
    /* 智能锁附近可用的WIFI列表 */
   data?: TTLockScanWifiResultData;
}

/** 扫描网关附近可用的WIFI列表返回数据域 */
interface TTLockScanWifiByGatewayResultData {
    /* 网关附近可用的WIFI列表 */
    wifiList?: Array<TTLockWifiFromScan>;
}

/** 扫描网关附近可用的WIFI列表返回数据 */
interface TTLockScanWifiByGatewayResult extends TTLockError {
    /* 扫描网关附近可用的WIFI列表返回数据域 */
    data?: TTLockScanWifiByGatewayResultData;
}

/** 初始化蓝牙网关返回数据域 */
interface TTLockInitGatewayResultData {
    /* 固件版本号 */
    firmware: string;
    /* 硬件版本号 */
    hardware: string;
    /* 模块号 */
    modelNum: string;
}

/** 初始化蓝牙网关返回数据 */
interface TTLockInitGatewayResult extends TTLockError {
    /* 初始化蓝牙网关返回数据域 */
    data?: TTLockInitGatewayResultData;
}