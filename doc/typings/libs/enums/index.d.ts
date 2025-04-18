/** 
 * TTLock 错误码
 */
declare const enum TTLOCK_ERROR_CODE {
    OK = 0, // 操作成功
    CRC_CHECK_ERROR = 0x01, // [智能锁]设备通信错误，操作失败，请重试(CRC error)
    NOT_ADMIN_ERROR = 0x02, // [智能锁]非管理员权限，无法操作(Not administrator, has no permission.)
    CHECK_ADMIN_FAILED = 0x03, // [智能锁]管理员校验未通过(Wrong administrator password.)
    LOCK_IN_SETTING_MODE_ERROR = 0x05, // [智能锁]智能锁处于设置状态(lock is in setting mode.)
    NO_ADMIN_ERROR = 0x06, // [智能锁]设备未初始化(lock has no administrator.)
    NOT_SETTING_MODE = 0x07, // [智能锁]智能锁不在可初始化状态，请先摸亮锁或重置智能锁(Non-setting mode.)
    DYNAMIC_CODE_ERROR = 0x08, // [智能锁]动态码错误(invalid dynamic code.)
    LOW_BATTERY = 0x0a, // [智能锁]电池电量低(run out of battery.)
    INIT_KEYBOARD_PSD_FAILED = 0x0b, // [智能锁]初始化（重置）键盘密码失败(initialize keyboard password falied.)
    LOW_LOCKFLAG_POSITION = 0x0d, // [智能锁]电子钥匙失效，权重过低(invalid ekey, lock flag position is low.)
    EXPIRED_EKEY = 0x0e, // [智能锁]电子钥匙已过期(ekey expired.)
    INVALID_PASSWORD_LENGTH = 0x0f, // [智能锁]密码长度错误，必须为4-9位的数字字符串(invalid password length.)
    ADMINPSD_SAMETO_DELETEPSD = 0x10, // [智能锁]管理员密码与清空码相同(admin super password is same with delete password.)
    UNEFFECT_EKEY = 0x11, // [智能锁]电子钥匙未生效(ekey hasn't become effective.)
    NOT_LOGIN = 0x12, // [智能锁]用户验证未通过，暂无操作权限(user not login)
    UNDEFINED_ERROR = 0x13, // [智能锁]操作失败，未定义的错误或设备不支持相关操作(Failed. Undefined error.)
    PASSWORD_EXIST = 0x14, // [智能锁]密码已存在，无法添加(password already exists.)
    PASSWORD_NOT_EXIST = 0x15, // [智能锁]密码不存在或未被使用过，无法操作(password not exists or never be used.)
    OUT_OF_EMPTY = 0x16, // [智能锁]存储空间不足(out of memory.)（如添加密码时，超过存储容量）
    NO_DEFIEND_ERROR = 0x17, // [智能锁]无定义的错误(no defined error.)
    CARDNO_NOT_EXIST = 0x18, // [智能锁]卡号不存在(Card number not exist.)
    FINGERPRINT_NOT_EXIST = 0x1a, // [智能锁]指纹不存在(Finger print not exist.)
    INVALID_COMMAND = 0x1b, // [智能锁]无效指令(Invalid command, 智能锁不支持该操作或参数不符合要求)
    LOCK_FROZEN = 0x1c, // [智能锁]电子钥匙已冻结(lock frozen.)
    INVALID_STR = 0x1d, // [智能锁]无效字符串, 定制智能锁使用特定vendor, 请核对相关参数(invalid vendor string.)
    DOOR_LOCKED = 0x1e, // [智能锁]门已反锁(普通用户不允许开锁)
    RECORD_NOT_EXIST = 0x1f, // [智能锁]记录不存在(record not exist)
	INVALID_PARAM = 0X20, // [智能锁]参数无效
    LOCK_OPERATING = 0x24, // [智能锁]指令已接收，正在处理中, 请稍候(智能锁)
    LOCK_SSID_ERROR = 0x25, // [智能锁]无效的SSID，智能锁无法使用该网络(WIFI锁配置SSID错误)
    LOCK_WIFI_PASSCODE_ERROR = 0x26, // [智能锁]WIFI密码错误
    GATEWAY_OPERATION_FAILED = 0x80, // [网关]网关操作失败   
    GATEWAY_OPERATING = 0x81, // [网关]指令已接收，正在处理中, 请稍候(网关)
    GATEWAY_SSIE_ERROR = 0x82, // [网关]无效的SSID，网关无法使用该网络
    GATEWAY_WIFI_PASSWORD_ERROR = 0x83, // [网关]WIFI密码错误(网关)
    GATEWAY_OPERATION_FINISHED = 0x84, // [网关]处理已完成(网关)
    GATEWAY_UNKNOW_COMMAND = 0x85, // [网关]无效指令(网关)
    GATEWAY_COMMAND_TIME_OUT = 0x86, // [网关]指令超时(网关)
    GATEWAY_NO_SIM = 0x87, // [网关]设备未插入SIM卡
    GATEWAY_NO_NETWORK = 0x88, // [网关]设备无法连接网络(没有插入网线)
    EKEY_INVALID = 10001, // [设备通信][智能锁]锁可能被重置，请重新添加(锁通信时返回数据解析为空，锁可能被重置)
    BT_CONNECT_TIMEOUT = 10002, // [蓝牙][连接超时]蓝牙连接超时，请确认设备已在附近(通用超时，重连)
    BT_DISCONNECT = 10003, // [蓝牙][设备断连]设备已断开连接
    BT_WRITE_ERROR = 10004, // [蓝牙][设备通信][数据发送]数据发送失败，请稍后重试
    INVALID_LOCKDATA = 10005, // [参数]无效的电子钥匙或锁数据
    BLE_CREATE_CONN_FAILED = 10007, // [接口防错]设备连接失败
    BLE_CLOSE_CONN_FAILED = 10008, // [接口防错]断开蓝牙设备连接失败
    UNSUPPORT_DEVICE_TYPE = 10009, // [参数][设备类型][插件功能]当前插件不支持该设备类型(不支持的锁版本或网关版本)
    LOCK_NO_SETTING_MODE = 10010, // [初始化][智能锁]锁未进入可添加模式，请先摸亮锁或重置智能锁
    GATEWAY_NO_SETTING_MODE = 10011, // [初始化][网关]网关未进入可添加模式，请重新通电后扫描
    BT_SWITCH_ERROR = 10012, // [系统开关][蓝牙开关]请打开系统【蓝牙】开关
    BLUETOOTH_AUTH_DENY = 10014, // [权限开关][iOS][蓝牙授权]用户已拒绝授权，请检查系统设置中微信【蓝牙】权限是否已授予
    LOCATION_AUTH_DENY = 10015, // [权限开关][Android][设备扫描][位置授权]用户已拒绝授权，请检查系统设置中微信【位置信息】权限是否已授予(部分设备无法分辨是否已授予精确位置，则返回该错误码)
    NO_WIFI_FOUND = 10016, // [WiFi扫描][智能锁][网关]未扫描到可用WiFi
    BT_RECEIVE_TIMEOUT = 10017, // [蓝牙][设备通信][数据接收]设备通信超时未响应
    BT_CHAR_NO_EXIST = 10018, // [蓝牙][设备通信][特征值]蓝牙特征值不存在
    BLE_OPEN_ADAPTER_FAILED = 10030, // [接口防错]启用蓝牙适配器失败
    BLE_STOP_SCAN_FAILED = 10031, // [接口防错]停止蓝牙设备扫描失败
    BLE_NOTIFY_CHAR_FAILED = 10032, // [接口防错]启用蓝牙特征值notify服务失败（蓝牙通信失败）
    BLE_WRITE_CHAR_FAILED = 10033, // [接口防错]数据发送失败
    BT_TRANSFORM_ERROR = 10034, // [蓝牙][设备通信][数据解析]数据解析失败(未正确返回数据)
    INIT_LOCK_FAILED = 10035, // [初始化][智能锁]智能锁初始化失败
    BT_SCAN_TIMEOUT = 10036, // [蓝牙][设备扫描][iOS][设备ID转换]搜索不到设备，已停止搜索，请确认设备是否已在附近
    SDK_VERSION_ERROR = 10038, // [设备平台][微信SDK]微信基础库版本过低，请升级
    MINIPROGRAM_AUTH_DENY = 10039, // [权限开关][小程序授权][小程序蓝牙授权]用户已拒绝小程序【蓝牙】授权（2.9.2）
    BLE_CLOSE_ADAPTER_FAILED = 10040, // [接口防错]关闭蓝牙适配器失败（2.9.5）
    BLE_START_SCAN_FAILED = 10041, // [接口防错]开启蓝牙设备扫描失败（2.9.5)
    BT_CONNECT_TIMEOUT_ANDROID = 10042, // [权限开关][Android][连接超时][附近设备授权]设备连接超时，请在系统设置中检查微信【附近设备】权限是否已授予，并确认设备已在附近(3.0.4)
	LOCAL_DEVICE_AUTH_DENY = 10043, // [权限开关][Android][附近设备授权]用户已拒绝授权，请检查系统设置中微信【附近设备】权限是否已授予(3.0.4)
	DETAIL_LOCATION_AUTH_DENY = 10044, // [权限开关][Android][设备扫描][精确位置授权]用户已拒绝授权，请检查系统设置中微信【精确位置信息】权限是否已授予(3.0.4)
	BT_CONN_FAILED_133 = 10045, // [蓝牙][设备连接][Android][status 133]蓝牙连接失败，请重试(Android 133错误)(3.0.4)
	LOCATION_SWITCH_ERROR = 10046, // [系统开关][位置开关][Android][设备扫描]请打开系统【位置信息】开关(3.0.4)
    WX_VERSION_ERROR = 10101, // [设备平台][微信版本]微信版本过低，请升级。当前最低版本号：%d（3.1.0)
	INVALID_REQUEST_DOMAIN = 10302, // [网络请求]网络请求失败，请检查域名是否已列入白名单(3.1.0)
	INVALID_REQUEST_URL = 10304, // [网络请求]无效的请求地址(3.1.0)
	REQUEST_API_FAILED = 10305, // [网络请求][状态码]`网络请求失败，状态码：${requsetStatus}`(状态码错误)(3.1.0)
	SERVER_RES_ERROR = 10307, // [网络请求][服务器返回值]`操作失败，服务器返回错误码：${requsetStatus}`(服务器错误码)(3.1.0)
	BT_SCAN_TIMEOUT_ANDROID = 10404, // [权限开关][Android][设备扫描][附近设备授权][扫描超时]设备扫描超时，请在系统设置中检查微信【附近设备】权限是否已授予，并确认设备已在附近(3.1.0)(半防错)
	BT_CONNECT_FAIED = 10503, // [蓝牙][设备连接失败]蓝牙连接失败，请重试(半防错)(3.1.0)
	BT_CHAR_ERROR = 10508, // [蓝牙][特征值]通信失败，无法启用蓝牙特征值(3.1.0)
	BT_SERVICE_NO_EXIST = 10513, // [蓝牙][蓝牙服务]通信失败，蓝牙服务不存在(3.1.0)
	BT_ALREAY_CONNECTED = 10601, // [蓝牙连接]设备已连接上，无需重连(3.1.0)
	BT_ERROR_CONNECTED_DEVICE = 10602, // [蓝牙连接]目标设备与当前已连接的设备不符(3.1.0)
    PLATFORM_ERROR = 11002, // [设备平台]蓝牙调试功能暂不支持 Mac 以外的平台
    PARAMS_ERROR = 11003, // [参数]参数错误
    UNSUPPORT_OPERATIONS = 11004, // [参数]当前设备不支持该操作
    NOT_ADMIN_USER = 11005, // [参数]非管理员用户无权操作
    API_BUSY = 11013, // [蓝牙][状态控制]蓝牙正在操作中，请稍候再试
    LATEST_LOCK_VERSION = 11015, // [智能锁][固件升级]固件版本无需更新
    UPGRADE_FAILED = 11016, // [智能锁][固件升级]固件升级失败(半防错)
    PACKAGE_DOWNLOAD_FAILED = 11017, // [智能锁][固件升级]固件升级包加载失败(2.9.5)
	UPGRADE_SYNC_FAILED = 11018, // [智能锁][固件升级]同步服务器失败，设备固件已升级成功(3.1.0)
    REQUEST_FAILED = 11101, // [接口防错]网络请求失败
	BLE_GET_SERVICES_FAILED = 13007, // [接口防错][蓝牙服务]获取蓝牙服务列表失败(3.1.0)
	BLE_GET_CHAR_FAILED = 13008, // [接口防错][特征值]获取蓝牙特征值列表失败(3.1.0)
	BLE_READ_CHAR_FAILED = 13011, // [接口防错][数据发送]读取蓝牙特征值失败(3.1.0)
	DOWNLOAD_FAILED = 13013, // [接口防错]文件下载失败(3.1.0)
    FAIL = 99999, // [防错错误码]操作失败(3.0.2)
}

/** 
 * 设备类型
 */
declare const enum TTDEVICE_TYPE {
    LOCK = 1, // 智能锁
    GATEWAY = 2, // 网关设备
    UNSUPPORT = 99, // 不支持的设备
}

/** 
 * 网关类型
 * @since 2.6.0
 */
declare const enum TTGATEWAY_TYPE {
    UNSUPPORT = -1, // 不支持
    G2 = 2, // G2网关（wifi)
    G3 = 3, // G3网关（有线）
    G4 = 4, // G4网关（4G)
}

/**
 * @description 智能锁版本类型
 */
declare const enum TTLOCK_TYPE {
    V3 = 5, // 三代锁
    V2_S2 = 4, // 二代锁(带永久密码功能)
    V2_S1 = 3, // 二代门锁
    CAR_LOCK = 1, // 车位锁
    UNSUPPORT = 0, // 不支持的锁类型
}

/**
 * @description 控制智能锁方式
 */
declare const enum TTLOCK_CONTROL_TYPE {
    OPEN = 3, // 开锁
    CLOSE = 6, // 闭锁
}

/**
 * @description 读取操作记录类型
 */
declare const enum TTLOCK_READ_RECORD_TYPE {
    ALL = 1, // 读取锁内所有的操作记录
    NEW = 2, // 读取锁内未被读取的操作记录
}

/**
 * @description 三代智能锁密码类型
 */
declare const enum TTLOCK_KEYBOARD_PWD_TYPE {
    PERMANENT = 1, // 永久密码
    ONCE = 2, // 单次密码
    LIMIT = 3, // 限时密码
    CYCLE = 4, // 循环密码
}

/**
 * @description 梯控工作模式
 */
declare const enum TTLOCK_LIFT_WORKMODE {
    ACTIVE_ALL_FLOORS = 1, // 梯控刷卡后，仅能按房间所在楼层
    ACTIVE_SPECIFIC_FLOORS = 2, // 梯控刷卡后，可按所有楼层
}

/**
 * @description 智能锁锁开关配置方式
 */
declare const enum TTLOCK_SWITCH_CONFIG_TYPE {
    TAMPER_ALERT = 0x01, // 使能/禁用防撬开关
    RESET_BUTTON = 0x02, // 使能/禁用重置按键
    PRIVACY_LOCK = 0x04, // 使能/禁用反锁开关(不做隐私锁)
    UNLOCK_DIRECTION = 0x10, // 左右开门设置（1 -左开门， 0 -右开门)
    PASAGE_MODE_AUTO_UNLOCK_SETTING = 0x20, // 使能/禁用常开模式自动开锁
    POWER_SAVING_MODE = 0x80, // wifi锁省电模式开关(3.1.0)
}

/**
 * @description 智能锁开闭状态
 */
declare const enum TTLOCK_STATUS {
    LOCKED = 0, // 已闭锁
    UNLOCK = 1, // 已开锁
    UNKNOWN = 2, // 未知
}

/**
 * @description 智能锁常开日循环方式
 */
declare const enum TTLOCK_PASSAGE_WORKMODE {
    WEEKLY = 1, // 周循环
    MONTHLY = 2, // 日循环
}

/**
 * @description 智能锁音量
 */
declare const enum TTLOCK_SOUND_VOLUME {
    ON = -1, // 开启
    OFF = 0, // 关闭锁声音
    FIRST_LEVEL = 1, // 一级
    SECOND_LEVEL = 2, // 二级
    THIRD_LEVEL = 3, // 三级
    FOURTH_LEVEL = 4, // 四级
    FIFTH_LEVEL = 5, // 五级
}

/**
 * @description 取电开关工作模式
 */
declare const enum TTLOCK_POWER_SAVER_WORKMODE {
    OFF = 0, // 禁用
    ANY_CARD = 1, // 任意卡取电
    ID_CARD = 2, // 身份证取电
    HOTEL_CARD = 4, // 酒店卡取电
    ROOM_CARD = 8, // 房间卡取电
}