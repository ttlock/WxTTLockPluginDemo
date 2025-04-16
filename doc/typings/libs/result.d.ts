
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

/** 智能锁内有效IC卡记录信息 */
interface TTLockValidICCard {
    /* IC卡卡号 */
    cardNo: number;
    /* IC卡有效期开始时间 */
    startDate: number;
    /* IC卡有效期结束时间 */
    endDate: number;
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

/** 扫描智能锁附近可用的wifi列表返回数据域 */
interface TTLockScanWifiResultData {
    /* 智能锁附近可用的wifi列表 */
    wifiList?: Array<TTLockWifiFromScan>;
}

/** 扫描网关附近可用的WIFI列表返回数据域 */
interface TTLockScanWifiByGatewayResultData {
    /* 网关附近可用的WIFI列表 */
    wifiList?: Array<TTLockWifiFromScan>;
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