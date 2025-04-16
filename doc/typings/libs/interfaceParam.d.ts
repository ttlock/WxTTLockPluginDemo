

// /** 设置智能锁时间参数 */
// interface TTLockSetTime {
//     /* 电子钥匙数据 */
//     lockData: string; // 智能锁数据
//     /* 待设置的服务器时间戳 */
//     serverTime?: number;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 读取智能锁操作记录 */
// interface TTLockGetOperationLog {
//     logType: TTLOCK_READ_RECORD_TYPE; // 读取操作记录方式
//     /* 电子钥匙数据 */
//     lockData: string; // 智能锁数据
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 写入自定义密码 */
// interface TTLockCreateCustomPasscode {
//     /* 自定义密码，0-9组成的4-9位长度字符串 */
//     passcode: string;
//     /* 密码有效期开始时间 */
//     startDate: number;
//     /* 密码有效期结束时间 */
//     endDate: number;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 修改密码 */
// interface TTLockModifyPasscode {
//     /* 原始密码，0-9组成的4-9位长度字符串 */
//     originalPasscode: string;
//     /* 新密码，0-9组成的4-9位长度字符串 */
//     passcode: string;
//     /* 新密码有效期开始时间 */
//     startDate: number;
//     /* 新密码有效期结束时间 */
//     endDate: number;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 删除密码 */
// interface TTLockDeletePasscode {
//     /* 新密码，0-9组成的4-9位长度字符串 */
//     passcode: string;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 读取智能锁内所有有效的密码 */
// interface TTLockGetAllValidPasscode {
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 查询管理员密码 */
// interface TTLockGetAdminPasscode {
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 修改管理员密码 */
// interface TTLockModifyAdminPasscode {
//     /* 管理员新密码 */
//     newPasscode: string;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 添加IC卡 */
// interface TTLockAddICCard {
//     /* IC卡有效期开始时间 */
//     startDate: number;
//     /* IC卡有效期结束时间 */
//     endDate: number; // IC卡有效期结束时间
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 中间步骤回调 */
//     callback?: TTLockAddICCardCallback; // 中间步骤回调
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 恢复IC卡 */
// interface TTLockRecoverICCard {
//     /* IC卡有效期开始时间 */
//     startDate: number;
//     /* IC卡有效期结束时间 */
//     endDate: number;
//     /* IC卡卡号 */
//     cardNum: number;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 修改IC卡有效期 */
// interface TTLockModifyICCardPeriod {
//     /* IC卡有效期开始时间 */
//     startDate: number;
//     /* IC卡有效期结束时间 */
//     endDate: number;
//     /* IC卡卡号 */
//     cardNum: number;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 删除IC卡 */
// interface TTLockDeleteICCard {
//     /* IC卡卡号 */
//     cardNum: number;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 读取智能锁内所有有效的IC卡 */
// interface TTLockGetAllValidICCard {
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 添加指纹 */
// interface TTLockAddFingerprint {
//     /* 指纹有效期开始时间 */
//     startDate: number;
//     /* 指纹有效期结束时间 */
//     endDate: number;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 中间步骤回调 */
//     callback?: TTLockAddFingerprintCallback;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 修改指纹有效期 */
// interface TTLockModifyFingerprintPeriod {
//     /* 指纹号 */
//     fingerprintNum: number;
//     /* 指纹有效期开始时间 */
//     startDate: number;
//     /* 指纹有效期结束时间 */
//     endDate: number;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 删除指纹 */
// interface TTLockDeleteFingerprint {
//     /* 指纹号 */
//     fingerprintNum: number;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 读取智能锁内所有有效的指纹 */
// interface TTLockGetAllValidFingerprint {
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 查询智能锁远程开关开启状态参数 */
// interface TTLockGetRemoteUnlockSwitchState {
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 设置智能锁远程开关开启状态参数 */
// interface TTLockSetRemoteUnlockSwitchState {
//     /* 是否开启远程开关 */
//     enable: boolean;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 查询智能锁开关开启状态参数 */
// interface TTLockGetLockConfig {
//     /* 待查询的开关配置属性 */
//     configType: number;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 设置智能锁开关开启状态参数 */
// interface TTLockSetLockConfig {
//     /* 待设置的开关配置属性 */
//     configType: number;
//     /* 开关开启状态 */
//     switchOn: boolean;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 查询智能锁开闭状态参数 */
// interface TTLockGetLockStatus {
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 查询智能锁常开模式参数 */
// interface TTLockGetPassageMode {
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

/** 智能锁常开模式配置信息 */
interface TTLockPassageModeConfiguration {
    /* 常开模式类型 */
    type: TTLOCK_PASSAGE_WORKMODE;
    /* 常开日，周模式传入1-7组成的整数数组，分别表示周一~周日，月模式传入1-31的整数数组，表示常开日期 */
    repeatWeekOrDays?: number[];
    /* 常开开始分钟数 */
    startDate: number;
    /* 常开结束分钟数 */
    endDate: number;
}

// /** 配置智能锁常开模式参数 */
// interface TTLockConfigPassageMode {
//     /* 常开模式配置信息 */
//     config: TTLockPassageModeConfiguration;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 清空常开模式参数 */
// interface TTLockClearPassageMode {
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 查询自动闭锁时间参数 */
// interface TTLockGetAutomaticLockingPeriod {
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 设置自动闭锁时间参数 */
// interface TTLockSetAutomaticLockingPeriod {
//     /* 自动闭锁时间，单位：秒，0表示关闭超时自动闭锁 */
//     seconds: number;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 查询智能锁音量参数 */
// interface TTLockGetLockSoundWithSoundVolume {
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 设置智能锁音量参数 */
// interface TTLockSetLockSoundWithSoundVolume {
//     /* 音量设置 */
//     soundVolume: TTLOCK_SOUND_VOLUME;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

/** @description 酒店锁配置信息 */
interface TTLockHotelData {
    /* 通过开放平台接口或相关jar包获取的酒店信息串 */
    hotelInfo: string;
    /* 楼栋号，1-254的正整数 */
    buildingNumber: number;
    /* 楼层号，1-255的正整数 */
    floorNumber?: number;
}

// /** 配置酒店相关信息参数 */
// interface TTLockSetHotelData {
//     /* 待设置的酒店锁配置信息 */
//     hotelData: TTLockHotelData;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 配置酒店锁卡系统使用扇区接口参数 */
// interface TTLockSetHotelSector {
//     /* 待配置的扇区列表 */
//     sectors: Array<number>;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 设置梯控工作模式参数 */
// interface TTLockSetLiftWorkMode {
//     /* 梯控工作模式 */
//     workMode: TTLOCK_LIFT_WORKMODE;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 设置梯控关联楼层参数 */
// interface TTLockSetLiftControlableFloors {
//     /* 梯控与楼层关联信息 */
//     floors: Array<number>;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 设置取电开关工作模式参数 */
// interface TTLockSetPowerSaverWorkMode {
//     /* 取电开关工作模式 */
//     powerSaverWorkMode: TTLOCK_POWER_SAVER_WORKMODE;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 设置取电开关关联的智能锁参数 */
// interface TTLockSetPowerSaverControlableLock {
//     /* 取电开关关联的智能锁MAC地址 */
//     lockMac: string;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 扫描智能锁附近可连接的wifi列表参数 */
// interface TTLockScanWifi {
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 配置智能锁使用的wifi信息参数 */
// interface TTLockConfigWifi {
//     /* wifi配置信息 */
//     config: TTLockWifiInfo;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 配置wifi锁连接的服务器信息参数 */
// interface TTLockConfigServer {
//     /* 服务器配置信息 */
//     config: TTLockServerIPAddress;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 配置wifi锁本地使用的IP信息参数 */
// interface TTLockConfigIP {
//     /* 本地IP配置信息 */
//     ipSetting: TTLockLocaleIPAddress;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

/** 固件升级必备信息 */
interface TTLockDfuPackageInfo {
    /* 开放平台client_id，通过开放平台获取 */
    clientId: string;
    /* 用户认证令牌，通过开放平台获取 */
    accessToken: string;
    /* 智能锁ID */
    lockId: number;
}

// /** 固件升级完整参数 */
// interface TTLockEnterDfuMode {
//     /* 固件升级必备信息 */
//     dfuPackageInfo: TTLockDfuPackageInfo;
//     /* 管理员电子钥匙数据 */
//     lockData: string;
//     /* 中间步骤回调 */
//     callback?: TTLockEnterDfuModeCallback;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 连接网关设备参数 */
// interface TTLockConnectGateway {
//     /* 扫描到的网关设备信息 */
//     deviceFromScan: TTGatewayFromScan;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

// /** 扫描网关附近可连接的wifi列表参数 */
// interface TTLockScanWifiByGateway {
//     /* 扫描到的网关设备信息 */
//     deviceFromScan: TTGatewayFromScan;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }

/** 网关配置信息 */
interface TTLockGatewayConfiguration {
    /* 网关类型 */
    type: TTGATEWAY_TYPE;
    /* 通通锁用户ID */
    uid: number;
    /* 通通锁用户密码，需MD5加密，32位 */
    password: string;
    /* 公司ID，没有则填0 */
    companyId: number;
    /* 分店ID, 没有则填0 */
    branchId: number;
    /* 网关命名，最长50个字符 */
    plugName: string;
    /* wifi名称，G2网关必传 */
    SSID?: string; // SSID
    /* wifi密码，G2网关必传 */
    wifiPwd?: string;
    /* 网关服务器IP地址 */
    serverIPAddress?: string;
    /* 网关服务器域名 */
    server?: string;
    /* 网关服务器端口地址 */
    port: number;
    /* 是否需要配置本地IP地址，仅部分网关支持本地IP地址配置 */
    useLocalIPAddress: boolean;
    /* 是否使用DHCP动态配置本地IP地址，useLocalIPAddress为true时生效 */
    useDHCP?: boolean;
    /* 固定IP地址, useDHCP为false时生效 */
    ipAddress?: string;
    /* 子网掩码, useDHCP为false时生效 */
    subnetMask?: string;
    /* 默认网关, useDHCP为false时生效 */
    router?: string;
    /* 首选DNS, useDHCP为false时生效 */
    dns1?: string; // 首选DNS
    /* 备用DNS, useDHCP为false时生效 */
    dns2?: string;
}

// /** 初始化蓝牙网关参数 */
// interface TTLockInitGateway {
//     /* 扫描到的网关设备信息 */
//     deviceFromScan: TTGatewayFromScan;
//     /* 网关初始化配置信息 */
//     configuration: TTLockGatewayConfiguration;
//     /* 设备断连回调 */
//     disconnectCallback?: TTLockCallback;
// }