/// <reference path="./params.d.ts" />

// /** 智能锁版本信息 */
// interface TTLockVersion {
//     /* 智能锁协议版本号 */
//     protocolVersion: number;
//     /* 智能锁协议类型 */
//     protocolType: number; // 协议类型
//     /* 场景值 */
//     scene: number;
//     /* 应用商ID，扫描设备时固定返回1 */
//     groupId: number;
//     /* 应用商子ID，扫描设备时固定返回1 */
//     orgId: number;
//     /* LOGO */
//     logoUrl?: string;
//     /* 是否展示管理员密码 */
//     showAdminKbpwdFlag?: boolean;
// }

// /** 蓝牙扫描到的智能锁设备 */
// interface TTLockFromScan {
//     /* 设备类型 (2.7.6新增) */
//     deviceType: TTDEVICE_TYPE;
//     /* 智能锁类型 (2.7.0新增) */
//     type: TTLOCK_TYPE;
//     /* 蓝牙广播设备ID, 安卓设备与MAC地址相同，iOS为UUID格式 */
//     deviceId: string;
//     /* 设备信号值, 0表示该设备已掉线 */
//     rssi: number;
//     /* 智能锁是否处于可添加状态 */
//     isSettingMode: boolean;
//     /* 蓝牙设备MAC地址 (2.7.0新增) */
//     MAC: string;
//     /* 智能锁名称 (2.7.0新增) */
//     deviceName: string;
//     /* 设备扫描最后更新时间 */
//     updatedTime?: number;
//     /* 智能锁版本信息, 扫描时groupID和orgId固定返回1 (2.7.0新增) */
//     lockVersion: TTLockVersion;
//     /* 智能锁设备电量 */
//     electricQuantity: number; // 锁电量
//     /* 设备是否处于可触摸开锁状态 (2.7.0新增) */
//     isTouch: boolean;
// }

// /** 智能锁特征值解析结果 */
// interface TTLockFeatureValue {
//     passcode: boolean; // 密码
//     ICCard: boolean; // IC卡
//     fingerprint: boolean; // 指纹
//     wristband: boolean; // 手环
//     autoLock: boolean; // 自动闭锁
//     delPasscode: boolean; // 删除密码
//     updateHardware: boolean; // 固件升级
//     mngPasscode: boolean; // 密码管理
//     locking: boolean; // 指令闭锁
//     passcodeVisible: boolean; // 密码显示或隐藏的控制
//     gatewayUnlock: boolean; // 远程开锁指令
//     gatewayFreeze: boolean; // 网关冻结、解冻
//     cyclePasscode: boolean; // 循环密码
//     doorSensor: boolean; // 支持门磁
//     remoteUnlockSwitch: boolean; // 远程开锁设置
//     audioSwitch: boolean; // 支持启用或禁用语音提示管理
//     NBIoT: boolean; // 支持NB
//     getAdminPasscode: boolean; // 支持读取管理员密码
//     hotelCard: boolean; // 支持酒店锁卡系统
//     noClock: boolean; // 锁没有时钟芯片
//     noBleUnlock: boolean; // 不支持蓝牙开锁
//     passageMode: boolean; // 支持常开模式
//     autoLockInPassageMode: boolean; // 常开模式下是否支持关闭自动闭锁
//     wirelessKeypad: boolean; // 无线键盘
//     lightTimeSetting: boolean; // 照明灯时间配置
//     hotelCardBlacklist: boolean; // 允许挂失酒店卡
//     IDCard: boolean; // 身份证
//     tamperSwitch: boolean; // 防撬开关
//     resetButton: boolean; // 重置键配置
//     privacyLock: boolean; // 反锁
//     deadLock: boolean; // 死锁
//     passageModeException: boolean; // 常开模式例外
//     cyclicCardOrFingerprint: boolean; // 支持循环指纹/IC卡
//     unlockDirection: boolean; // 支持左右开门设置
//     fingerVein: boolean; // 支持指静脉
//     ble5G: boolean; // 支持5G蓝牙
//     NBAwake: boolean; // 支持NB激活配置
//     recoverCyclePasscode: boolean; // 支持循环密码恢复功能
//     wirelessKeyFob: boolean; // 支持无线钥匙（遥控）
//     getAccessoryElectricQuantity: boolean; // 支持读取配件电量信息
//     soundVolume: boolean; // 支持音量及语言设置
//     QRCode: boolean; // 支持二维码
//     sensorState: boolean; // 支持门磁状态
//     passageModeAutoUnlock: boolean; // 支持常开模式自动开锁设置
//     gatwayFingerprint: boolean; // 支持指纹下发功能
//     zhongzhengFingerprint: boolean; // 支持中正指纹下发
//     shenyuanFingerprint: boolean; // 支持晟元指纹下发
//     wirelessDoorSensor: boolean; // 支持无线门磁
//     doorSensorAlert: boolean; // 支持门未关报警
//     sensitivity: boolean; // 支持接近感应
//     face: boolean; // 支持3D人脸
//     CPUCard: boolean; // IP支持CPU卡
//     WIFI: boolean; // 支持WIFI锁功能
//     WifiLockStaticIP: boolean; // WiFi锁支持固定IP地址
//     passcodeKeyNumber: boolean; // 支持不完整密码锁
//     twoFactorAuth: boolean; // 支持双重认证
//     catEyeXM: boolean; // 支持雄迈可视对讲功能
//     faceZA: boolean; // 支持指安人脸下发
//     palmVein: boolean; // 支持掌静脉
// }

// /** 蓝牙扫描到的网关设备 */
// interface TTGatewayFromScan {
//     /* 设备类型 (2.7.6新增) */
//     deviceType: TTDEVICE_TYPE;
//     /* 网关类型 (2.7.0新增) */
//     type: TTGATEWAY_TYPE;
//     /* 蓝牙广播设备ID, 安卓设备与MAC地址相同，iOS为UUID格式 */
//     deviceId: string;
//     /* 设备信号值, 0表示该设备已掉线 */
//     rssi: number;
//     /* 网关是否处于可添加状态 */
//     isSettingMode: boolean;
//     /* 蓝牙设备MAC地址 (2.7.0新增) */
//     MAC: string;
//     /* 网关名称 (2.7.0新增) */
//     deviceName: string;
//     /* 设备扫描最后更新时间 */
//     updatedTime?: number;
//     /* 是否为网关设备 */
//     isGateway?: boolean;
// }

// /** @description 扫描到的wifi信息 */
// interface TTLockWifiFromScan {
//     /* SSID */
//     SSID: string;
//     /* 信号值 */
//     rssi: number;
// }

// /** @description wifi配置信息 */
// interface TTLockWifiInfo {
//     /* wifi名称 */
//     SSID: string;
//     /* wifi密码 */
//     password: string;
// }

// /** 网络服务器地址 */
// interface TTLockServerIPAddress {
//     /* 服务器域名地址，server与ipAddress二选一，优先生效 */
//     server?: string;
//     /* 服务器IP地址，server与ipAddress二选一 */
//     ipAddress?: string;
//     /* 服务器端口地址 */
//     port: number; // 服务器端口地址
// }

// /** @description 固定IP配置信息 */
// interface TTLockStaticIPAddress {
//     /* 固定IP地址 */
//     ipAddress: string;
//     /* 子网掩码 */
//     subnetMask: string;
//     /* 默认网关 */
//     router: string;
//     /* 首选DNS */
//     dns1: string;
//     /* 备用DNS */
//     dns2: string;
// }

// /** 本地IP地址配置信息 */
// interface TTLockLocaleIPAddress {
//     /* 是否使用DHCP动态获取 */
//     useDHCP: boolean;
//     /* 固定IP地址，useDHCP=false时必填 */
//     ipAddress?: TTLockStaticIPAddress;
// }