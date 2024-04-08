/** 通通锁蓝牙插件错误码 */
declare const enum ERROR_CODE {
    STOP_OPERATION = -4, // 用户中断操作
    RECEIVE_TIME_OUT_ONCE = -3, // 设备响应超时，通信失败(单次接收超时)
    HAS_NEXT = -2, // 操作未结束，等待下一次操作(还有后续操作，操作未结束)
    STOP_CALLBACK = -1, // 最后一次回调，断连不再进行设备回调
    OK = 0, // 操作成功
    CRC_CHECK_ERROR = 0x01, // 设备通信错误，操作失败，请重试(CRC error)
    NOT_ADMIN_ERROR = 0x02, // 非管理员权限，无法操作(Not administrator, has no permission.)
    CHECK_ADMIN_FAILED = 0x03, // 管理员校验未通过(Wrong administrator password.)
    LOCK_IN_SETTING_MODE_ERROR = 0x05, // 智能锁处于设置状态(lock is in setting mode.)
    NO_ADMIN_ERROR = 0x06, // 设备未初始化(lock has no administrator.)
    NOT_SETTING_MODE = 0x07, // 智能锁不在可初始化状态，请先摸亮锁或重置智能锁(Non-setting mode.)
    DYNAMIC_CODE_ERROR = 0x08, // 动态码错误(invalid dynamic code.)
    LOW_BATTERY = 0x0a, // 电池电量低(run out of battery.)
    INIT_KEYBOARD_PSD_FAILED = 0x0b, // 初始化（重置）键盘密码失败(initialize keyboard password falied.)
    LOW_LOCKFLAG_POSITION = 0x0d, // 电子钥匙失效，权重过低(invalid ekey, lock flag position is low.)
    EKEY_EXPIRED = 0x0e, // 电子钥匙已过期(ekey expired.)
    INVALID_PASSWORD_LENGTH = 0x0f, // 密码长度错误，必须为4-9位的数字字符串(invalid password length.)
    ADMINPSD_SAMETO_DELETEPSD = 0x10, // 管理员密码与清空码相同(admin super password is same with delete password.)
    UNEFFECT_EKEY = 0x11, // 电子钥匙未生效(ekey hasn't become effective.)
    NOT_LOGIN = 0X12, // 用户验证未通过，暂无操作权限(user not login)
    UNDEFINED_ERROR = 0x13, // 操作失败，未定义的错误或设备不支持相关操作(Failed. Undefined error.)
    PASSWORD_EXIST = 0x14, // 密码已存在，无法添加(password already exists.)
    PASSWORD_NOT_EXIST = 0x15, // 密码不存在或未被使用过，无法操作(password not exists or never be used.)
    OUT_OF_EMPTY = 0x16, // 存储空间不足(out of memory.)（如添加密码时，超过存储容量）
    NO_DEFIEND_ERROR = 0x17, // 无定义的错误(no defined error.)
    CARDNO_NOT_EXIST = 0x18, // 卡号不存在(Card number not exist.)
    FINGERPRINT_NOT_EXIST = 0x1a, // 指纹不存在(Finger print not exist.)
    INVALID_COMMAND = 0x1b, // 无效指令(Invalid command, 智能锁不支持该操作或参数不符合要求)
    LOCK_FROZEN = 0x1c, // 电子钥匙已冻结(lock frozen.)
    INVALID_STR = 0x1d, // 无效字符串, 定制智能锁使用特定vendor, 请核对相关参数(invalid vendor string.)
    DOOR_LOCKED = 0x1e, // 门已反锁(普通用户不允许开锁)
    RECORD_NOT_EXIST = 0x1f, // 记录不存在(record not exist)
    LOCK_OPERATING = 0x24, // 指令已接收，正在处理中, 请稍候(智能锁)
    LOCK_SSID_ERROR = 0x25, // 无效的SSID，智能锁无法使用该网络(WIFI锁配置SSID错误)
    LOCK_WIFI_PASSCODE_ERROR = 0x26, // WIFI密码错误
    GATEWAY_OPERATION_FAILED = 0x80, // 网关操作失败   
    GATEWAY_OPERATING = 0x81, // 指令已接收，正在处理中, 请稍候(网关)
    GATEWAY_SSIE_ERROR = 0x82, // 无效的SSID，网关无法使用该网络
    GATEWAY_WIFI_PASSWORD_ERROR = 0x83, // WIFI密码错误(网关)
    GATEWAY_OPERATION_FINISHED = 0x84, // 处理已完成(网关)
    GATEWAY_UNKNOW_COMMAND = 0x85, // 无效指令(网关)
    GATEWAY_COMMAND_TIME_OUT = 0x86, // 指令超时(网关)
    GATEWAY_NO_SIM = 0x87, // 设备未插入SIM卡
    GATEWAY_NO_NETWORK = 0x88, // 设备无法连接网络(没有插入网线)
    KEY_TIME_ERROR = 10000, // 钥匙或锁时间不正确
    KEY_INVALID = 10001, // 锁可能被重置，请重新添加(锁通信时返回数据解析为空，锁可能被重置)
    BT_CONNECT_TIMEOUT = 10002, // 设备连接超时，请确认是否在附近或稍后重试(连接超时且次数超出限制)
    BT_DISCONNECT = 10003, // 设备已断开连接（意外断连)
    BT_WRITE_DATA_ERROR = 10004, // 数据发送失败，请稍后重试
    KEY_DATA_ERROR = 10005, // 无效钥匙，请检查钥匙数据是否正确
    DATA_PARSE_ERROR = 10006, // 钥匙数据解析失败，请重试
    BT_CONNECT_FAILED = 10007, // 建立蓝牙连接失败或连接已中断
    BT_DISCONNECT_FAILED = 10008, // 停止蓝牙扫描失败
    BT_NOTALLOW_LOCKTYPE = 10009, // 不支持的设备类型
    INIT_LOCK_ERROR_NOT_SETTING_MODE = 10010, // 锁未进入可添加模式，请先摸亮锁或重置智能锁
    INIT_GATEWAY_ERROR_NOT_SETTING_MODE = 10011, // 网关未进入可添加模式，请重新通电后扫描
    BLUETOOTH_NOT_OPEN = 10012, // 系统蓝牙功能未开启
    BLUETOOTH_NOT_OPEN_OR_NO_PROP = 10013, // 系统蓝牙功能未开启或用户未授权予微信蓝牙权限(iOS)
    BLUETOOTH_WXPROP_NOT_OPEN = 10014, // 用户未授权予微信蓝牙权限(iOS)
    LOCATION_WXPROP_NOT_OPEN = 10015, // 用户未授权予微信位置权限(安卓)
    NO_GATEWAY_FOUND = 10016, // 设备未扫描到可用WIFI
    DATA_TRANSFORM_TIMEOUT = 10017, // 设备通信超时未响应
    NO_AVAILABLE_CHARCTERISTICS = 10018, // 蓝牙特征值不存在
    INVALID_WIFI = 10019, // 配置WIFI信息失败，请检查WIFI信息及网络状态(无效的WIFI信息或网络状态差)
    INVALID_SERVER = 10020, // 配置远程服务器失败，请检查服务器配置信息及网络状态
    DEVICE_NO_RETURN = 10021, // 设备未响应，请重试
    OPERATION_STOPPED = 10022, // 操作已中断
    BT_ADAPTER_START_FAILED = 10030, // 启动蓝牙适配器失败
    BT_STOP_DISCOVERY_FAILED = 10031, // 停止设备扫描失败
    BT_NOTIFY_DEVICE_FAILED = 10032, // 启用蓝牙特征值监控失败，请重试（蓝牙通信失败）
    BT_WRITE_FAILED = 10033, // 数据发送失败
    DEVICE_TRANSFORM_ERROR = 10034, // 设备通信错误(未正确返回数据)
    INIT_LOCK_FAILED = 10035, // 智能锁初始化失败
    SCAN_DEVICE_TIMEOUT = 10036, // 搜索不到设备，已停止搜索，请确认是否在锁附近或稍后重试
    STOP_ALL_FAILED = 10037, // 正在连接设备，无法中止，请稍候
    WXLIB_ERROR = 10038, // 微信基础库版本过低，请升级
    WECHAT_BLUETOOTH_AUTH_FAILED = 10039, // 小程序蓝牙授权未开启（2.9.2）
    BT_ADAPTER_CLOSE_FAILED = 10040, // 关闭蓝牙适配器失败（2.9.5）
    BT_START_DISCOVERY_FAILED = 10041, // 启动蓝牙扫描失败（2.9.5)
    NOT_SUPPORT_OPERATION = 11001, // 设备暂不支持该操作
    NOT_ALLOW_DEBUG = 11002, // 设备或平台不支持蓝牙功能调试
    PARAMS_ERROR = 11003, // 参数错误
    NOT_SUPPORT_LOCK_OPERATION = 11004, // 智能锁不支持该功能(不支持的特征值)
    NOT_ADMIN_USER = 11005, // 非管理员用户，无权操作
    NOT_AVAILABLE_LOCKDATA = 11006, // 无效的锁数据
    NOT_AVAILABLE_LOCKTIME = 11007, // 无效的锁时间（校准锁时间返回）
    NOT_AVAILABLE_FLOORLST = 11008, // 无效的楼层编号列表（梯控开锁返回）
    INVALID_PASSCODE = 11009, // 密码为4-9位数字字符串
    INVALID_DATESPAN = 11010, // 时间不在有效期内(设置的时间不在有效期内）
    INVALID_DATESPAN_S = 11011, // 结束时间不能早于开始时间
    NOT_AVAILABLE_HOTELDATA = 11012, // 无效的酒店信息
    API_IS_BUSY = 11013, // 蓝牙正在操作中，请稍候再试
    NOT_AVAILABLE_BUILDNO_OR_FLOORNO = 11014, // 无效的楼栋楼层信息
    LATEST_LOCK_VERSION = 11015, // 固件版本无需升级
    UPGRADE_FAILED = 11016, // 固件升级失败
    UPGRADE_PACKAGE_DOWNLOAD_FAILED = 11017, // 固件包下载失败(2.9.5)
    CLOUD_API_FAILED = 11101, // 服务器请求失败
}

/** 小程序智能设备类型 */
declare const enum TTDEVICE_TYPE {
    /** 智能锁 */
    LOCK = 1,
    /** 网关设备 */
    PLUG = 2,
    /** 不支持的智能设备 */
    UNSUPPORT = 99,
}

/** 智能锁版本类型 */
declare const enum TTLOCK_TYPE {
    /** 三代智能锁 */
    V3 = 5,
    /** 二代锁场景一(不支持蓝牙操作) */
    V2_S2 = 4,
    /** 二代锁场景二(不支持蓝牙操作) */
    V2_S1 = 3,
    /** 车位锁(不支持蓝牙操作) */
    CAR_LOCK = 1,
    /** 不支持的智能锁类型 */
    UNSUPPORT = 0,
}

/** 控制智能锁参数 */
declare const enum TTLOCK_CONTROL_TYPE {
    /* 开锁 */
    OPEN = 3,
    /* 闭锁 */
    CLOSE = 6,
}

/** 读取操作记录方式 */
declare const enum TTLOCK_READ_RECORD_TYPE {
    /* 读取智能锁内所有的操作记录 */
    ALL = 1,
    /* 读取锁内未被读取的操作记录 */
    NEW = 2,
}

/** 三代智能锁密码类型 */
declare const enum TTLOCK_KEYBOARD_PWD_TYPE {
    /* 永久密码 */
    PERMANENT = 1,
    /* 单次密码 */
    ONCE = 2,
    /* 限时密码 */
    LIMIT = 3,
    /* 循环密码 */
    CYCLE = 4,
}

/** 梯控工作模式 */
declare const enum TTLOCK_LIFT_WORKMODE {
    /* 梯控刷卡后，仅能按房间所在楼层 */
    ACTIVE_ALL_FLOORS = 1,
    /* 梯控刷卡后，可按所有继电器已关联的楼层 */
    ACTIVE_SPECIFIC_FLOORS = 2,
}

/** 智能锁开关配置方式 */
declare const enum TTLOCK_SWITCH_CONFIG_TYPE {
    TAMPER_ALERT = 1, // 使能/禁用防撬开关
    RESET_BUTTON = 2, // 使能/禁用重置按键
    PRIVACY_LOCK = 4, // 使能/禁用反锁开关
    UNLOCK_DIRECTION = 16, // 左右开门设置（1 -左开门， 0 -右开门)
    PASAGE_MODE_AUTO_UNLOCK_SETTING = 32, // 使能/禁用常开模式自动开锁
}

/** 智能锁开闭状态 */
declare const enum TTLOCK_STATUS {
    LOCK = 0, // 智能锁关
    UNLOCKED = 1, // 智能锁开
    UNKNOWN = 2, // 状态未知
}

/** 智能锁常开类型 */
declare const enum TTLOCK_PASSAGE_WORKMODE {
    /* 按周循环 */
    WEEKLY = 1,
    /* 按月循环 */
    MONTHLY = 2,
}

/** 智能锁音量等级 */
declare const enum TTLOCK_SOUND_VOLUME {
    /* 开启锁声音提示 */
    ON = -1, // 开启
    /* 关闭锁声音提示 */
    OFF = 0,
    /* 一级 */
    FIRST_LEVEL = 1,
    /* 二级 */
    SECOND_LEVEL = 2,
    /* 三级 */
    THIRD_LEVEL = 3,
    /* 四级 */
    FOURTH_LEVEL = 4,
    /* 五级 */
    FIFTH_LEVEL = 5,
}

/** 取电开关工作模式 */
declare const enum TTLOCK_POWER_SAVER_WORKMODE {
    /* 禁用 */
    OFF = 0,
    /* 任意卡取电 */
    ANY_CARD = 1,
    /* 酒店卡取电 */
    HOTEL_CARD = 4,
    /* 房间卡取电 */
    ROOM_CARD = 8,
}

/** 网关类型 */
declare const enum TTGATEWAY_TYPE {
    /** G2 网关(WIFI网关) */
    G2 = 2,
    /** G3 网关(有线网关) */
    G3 = 3,
    /** G4 网关(4G网关) */
    G4 = 4,
    /** 不支持的智能设备 */
    UNSUPPORT = -1,
}