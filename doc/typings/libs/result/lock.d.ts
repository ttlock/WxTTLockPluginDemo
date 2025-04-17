/// <reference path="../options/index.d.ts" />

declare namespace TTLock {
    /**
     * @description 查询智能锁版本信息操作结果
     */
    interface GetVersionResult extends TTLockError {
        /**
         * 智能锁版本信息
         * @description 3.1.0开始不再修改原始参数
         */
        lockVersion?: TTLock.LockVersion;
    }

    /**
     * @description 初始化智能锁操作结果
     */
    interface InitLockResult extends TTLockError {
        /**
         * 智能锁初始化数据
         * @description 3.0.0支持直接用于开锁操作
         */
        lockData?: string;
    }

    /**
     * @description 控制智能锁操作结果
     */
    interface ControlLockResult extends TTLockError {
        /**
         * @description 控制智能锁记录ID(唯一标识)
         */
        uniqueid?: number;
        /**
         * @description 智能锁锁时间
         */
        lockTime?: number;
        /**
         * @description 控制智能锁方式
         * @see TTLOCK_CONTROL_TYPE
         */
        controlAction?: number;
    }

    /**
     * @description 读取智能锁操作记录操作结果
     */
    interface GetOperationRecordResult extends TTLockError {
        /**
         * @description 锁内操作记录的json字符串，用于上传服务器
         */
        log?: string;
    }

    /**
     * @description 添加自定义密码操作结果
     */
    interface CreateCustomPasscodeResult extends TTLockError {
        /**
         * @description 自定义密码
         */
        passcode?: string;
    }

    /**
     * @description 重置密码操作结果
     */
    interface ResetPasscodeResult extends TTLockError {
        /**
         * @description 锁数据，用于同步服务器，不可操作蓝牙
         */
        lockData?: string;
    }

    /**
     * @description 有效键盘密码信息
     */
    interface PasscodeInfo {
        /**
         * @description 密码类型
         * @see TTLOCK_KEYBOARD_PWD_TYPE
         */
        keyboardPwdType: number;
        /**
         * @description 密码值
         */
        keyboardPwd: string;
        /**
         * @description 原始密码值
         */
        oldKeyboardPwd: string;
        /**
         * @description 密码有效期开始时间
         */
        startDate: number;
        /**
         * @description 密码有效期结束时间 
         */
        endDate?: number;
        cycleType?: number;
    }

    /**
     * @description 读取智能锁内所有有效密码操作结果
     */
    interface GetValidPasscodeResult extends TTLockError {
        /**
         * @description 有效密码列表
         */
        keyboardPwdList?: Array<PasscodeInfo>;
    }

    /**
     * @description 查询管理员密码操作结果
     */
    interface GetAdminPasscodeResult extends TTLockError {
        /**
         * @description 管理员密码值
         */
        passcode?: string;
    }

    /**
     * @description 修改管理员密码操作结果
     */
    interface ModifyAdminPasscodeResult extends TTLockError {
        /**
         * @description 管理员密码值
         */
        passcode?: string;
    }

    /**
     * @description 添加IC卡操作结果
     */
    interface AddICCardResult extends TTLockError {
        /**
         * 回调类型
         * @description 1 -IC卡添加完成，操作结束， 2 -已进入添加模式，请在锁上刷卡， 3 -IC卡数据已添加，正在修改有效期
         */
        type?: number;
        /**
         * IC卡添加成功后返回卡号
         * @description type = 1时返回该数据
         */
        cardNum?: number;
    }

    /**
     * @description 智能锁内有效IC卡记录信息
     */
    interface CardInfo {
        /**
         * @description IC卡卡号
         */
        cardNo: number;
        /**
         * @description IC卡有效期开始时间
         */
        startDate: number;
        /**
         * @description IC卡有效期结束时间
         */
        endDate: number;
    }

    /**
     * @description 读取智能锁内所有有效IC卡操作结果
     */
    interface GetValidICCardResult extends TTLockError {
        /**
         * @description 有效IC卡列表
         */
        cardList?: Array<CardInfo>;
    }

    /**
     * @description 添加指纹操作结果
     */
    interface AddFingerprintResult extends TTLockError {
        /**
         * 回调类型
         * @description 1 -指纹完成添加，操作结束; 2 -已进入添加模式，请在设备上录入指纹; 3 -录入指纹步骤回调; 4 -指纹已录入，正在修改有效期;
         */
        type?: number;
        /**
         * 指纹添加成功后返回指纹号
         * @description type = 1时返回该数据
         */
        fingerprintNum?: number;
        /**
         * @description 录入指纹的总次数
         */
        totalCount?: number;
        /**
         * @description 当前录入指纹已完成的次数
         */
        currentCount?: number;
    }

    /**
     * @description 智能锁内有效指纹记录信息
     */
    interface FingerprintInfo {
        /**
         * @description 指纹编号
         */
        fingerprintNo: number;
        /**
         * @description 指纹有效期开始时间
         */
        startDate: number;
        /**
         * @description 指纹有效期结束时间
         */
        endDate: number;
    }

    /**
     * @description 读取智能锁内所有有效指纹操作结果
     */
    interface GetValidFingerprintResult extends TTLockError {
        /**
         * @description 有效指纹列表
         */
        fingerprintList?: Array<FingerprintInfo>;
    }

    /**
     * @description 查询智能锁开闭状态操作结果
     */
    interface GetLockStatusResult extends TTLockError {
        /**
         * @description 智能锁开闭状态
         * @see TTLOCK_STATUS
         */
        lockStatus?: number;
    }

    /**
     * @description 查询智能锁远程开关开启状态结果
     */
    interface GetRemoteUnlockSwitchResult extends TTLockError {
        /**
         * @description 远程开关开启状态
         */
        enable?: boolean;
        /**
         * @description 智能锁更新数据，用于上传服务器，不可用于智能锁蓝牙操作
         */
        lockData?: string; 
        /**
         * @description 智能锁更新后特征值
         * @since 2.3.1
         */
        featureValue?: string;
        /**
         * @description 智能锁更新后特征值(低位数据，兼容低版本)
         * @deprecated 2.3.1
         */
        specialValue?: number;
    }

    /**
     * @description 设置智能锁远程开关开启状态结果
     */
    interface SetRemoteUnlockSwitchResult extends TTLockError {
        /**
         * @description 远程开关开启状态
         * @since 3.0.0
         */
        enable?: boolean;
        /**
         * @description 智能锁更新数据，用于上传服务器，不可用于智能锁蓝牙操作
         */
        lockData?: string; 
        /**
         * @description 智能锁更新后特征值
         * @since 2.3.1
         */
        featureValue?: string;
        /**
         * @description 智能锁更新后特征值(低位数据，兼容低版本)
         * @deprecated 2.3.1
         */
        specialValue?: number;
    }

    /**
     * 智能锁开关开启配置信息
     * @description 未查询/未设置/智能锁不支持的属性均不返回
     */
    interface SwitchConfig {
        /**
         * @description 是否打开防撬警报
         */
        tamperAlert?: boolean;
        /**
         * @description 是否允许长按重置智能锁
         */
        resetButton?: boolean;
        /**
         * @description 使能/禁用反锁开关
         */
        privacyLock?: boolean;
        /**
         * 左右开门设置
         * @description true为左开门，false为右开门
         */
        unlockDirection?: boolean;
        /**
         * @description 使能/禁用常开模式下自动开锁
         */
        pasageModeAutoUnlockSetting?: boolean;
        /**
         * wifi锁是否开启省电模式
         * @description 非wifi锁也可能返回该值，请根据特征值判断
         * @since 3.1.0
         */
        wifiPowerSavingMode?: boolean;
    }

    /**
     * @description 查询智能锁开关开启状态操作结果
     */
    interface GetLockSwitchResult extends TTLockError {
        /**
         * 已开启的开关配置属性
         * @description 未查询或锁不支持的属性均不返回
         * @see TTLOCK_SWITCH_CONFIG_TYPE
         */
        lockConfigType?: number;
        /**
         * 开关配置属性实际开启状态解析数据
         * @description 未查询或锁不支持的属性均不返回
         */
        lockConfigs?: SwitchConfig;
    }

    /**
     * @description 设备智能锁开关开启状态操作结果
     */
    interface SetLockSwitchResult extends TTLockError {
        /**
         * 已开启的开关配置属性
         * @description 未查询或锁不支持的属性均不返回
         * @see TTLOCK_SWITCH_CONFIG_TYPE
         */
        lockConfigType?: number;
        /**
         * 开关配置属性实际开启状态解析数据
         * @description 未查询或锁不支持的属性均不返回
         */
        lockConfigs?: SwitchConfig;
    }

    /**
	 * 扫描到的wifi信息
	 */
    interface WiFiInfo {
        /**
         * @description wifi名称
         */
        SSID: string;
        /**
         * @description wifi信号值
         */
        rssi: number;
    }

    /**
     * @description 扫描智能锁附近可用的wifi列表数据域
     */
    interface ScanWiFiResultData {
        /**
         * @description 智能锁附近可用的wifi列表
         */
        wifiList?: Array<WiFiInfo>;
    }

    /**
     * @description 扫描智能锁附近可用的wifi列表操作结果
     */
    interface ScanWiFiResult extends TTLockError<ScanWiFiResultData> {}

    /**
     * @description wifi锁省电模式信息
     */
    interface PowerSavingInfo {
        /**
         * wifi锁省电模式
         * @description 1 -周模式
         */
        type?: number;
        /**
         * 省电模式生效日
         * @description 周模式: 1-7,表示周一~周日
         */
        weekOrDay: number;
        /**
         * @description 月，保留位
         */
        month: number;
        /**
         * 省电模式生效开始分钟数
         * @description 全天传入0
         */
        startDate: number;
        /**
         * 省电模式生效结束分钟数
         * @description 全天传入0
         */
        endDate: number;
    }

    /**
     * @description 查询wifi锁省电模式配置信息结果
     */
    interface GetPowerSavingResult extends TTLockError {
        /**
         * @description wifi锁省电模式配置信息
         */
        configs?: Array<PowerSavingInfo>;
    }

    /**
     * @description 常开模式信息
     */
    interface PassageModeInfo {
        /**
         * @description 常开工作模式
         * @see TTLOCK_PASSAGE_WORKMODE
         */
        type: number;
        /**
         * 常开日
         * @description 周模式: 1-7,表示周一~周日   月模式: 1-31,表示常开日期
         */
        weekOrDay: number;
        /**
         * @description 月，保留位
         */
        month: number;
        /**
         * 常开时间开始分钟数
         * @description 3.1.0 全天常开传入0
         */
        startDate: number;
        /**
         * 常开时间结束分钟数
         * @description 3.1.0 全天常开传入0
         */
        endDate: number;
    }

    /**
     * @description 查询智能锁常开模式配置信息结果
     */
    interface GetPassageModeResult extends TTLockError {
        /**
         * @description 常开模式配置信息
         */
        passageModeConfigList?: Array<PassageModeInfo>;
    }

    /**
     * @description 自动闭锁配置信息
     */
    interface AutoLockInfo {
        /**
         * @description 是否开启超时自动闭锁
         */
        enable?: boolean;
        /**
         * @description 超时自动闭锁时间
         */
        autoLockTime?: number;
        /**
         * @description 允许设置的自动闭锁时间最小值
         */
        minAutoLockTime?: number;
        /**
         * @description 允许设置的自动闭锁时间最大值
         */
        maxAutoLockTime?: number;
    }

    /**
     * @description 查询自动闭锁配置信息结果
     */
    interface GetAutoLockResult extends TTLockError {
        /**
         * @description 自动闭锁配置信息
         */
        autoLockInfo?: AutoLockInfo;
    }

    /**
     * @description 查询智能锁音量配置信息结果
     */
    interface GetSoundVolumeResult extends TTLockError {
        /**
         * @description 智能锁音量设置
         * @see TTLOCK_SOUND_VOLUME
         */
        soundVolume?: number;
    }

    /**
     * @description 智能锁固件升级结果
     */
    interface EnterDfuModeResult extends TTLockError {
        /**
         * 回调类型
         * @description 1 -智能锁升级准备中; 2 -固件升级中(请勿打断); 3 -固件升级完成，正在获取新的所数据; 4 -操作成功; 5 -固件升级成功，但同步服务器失败
         */
        type?: number;
        /**
         * 固件升级进度
         * @description type=2时返回
         */
        progress?: number;
        /**
         * @description 智能锁更新数据，操作成功后用于上传服务器更新数据，不可用于蓝牙操作
         */
        lockData?: string;
    }
}

/**
 * 查询智能锁版本信息结果
 */
declare type TTLockGetVersionResult = TTLock.GetVersionResult;

/**
 * 初始化智能锁结果
 */
declare type TTLockInitResult = TTLock.InitLockResult;

/**
 * 控制智能锁结果
 */
declare type TTLockControlResult = TTLock.ControlLockResult;

/**
 * 读取智能锁操作记录结果
 */
declare type TTLockGetOperationLogResult = TTLock.GetOperationRecordResult;

/**
 * 添加自定义密码操作记录结果
 */
declare type TTLockCreateCustomPasscodeResult = TTLock.CreateCustomPasscodeResult;

/**
 * 重置密码操作记录结果
 */
declare type TTLockResetPasscodeResult = TTLock.ResetPasscodeResult;

/**
 * 读取智能锁内所有有效密码结果
 */
declare type TTLockGetAllValidPasscodeResult = TTLock.GetValidPasscodeResult;

/**
 * 查询管理员密码结果
 */
declare type TTLockGetAdminPasscodeResult = TTLock.GetAdminPasscodeResult;

/**
 * 修改管理员密码结果
 */
declare type TTLockModifyAdminPasscodeResult = TTLock.ModifyAdminPasscodeResult;

/**
 * 添加IC卡操作结果
 */
declare type TTLockAddICCardResult = TTLock.AddICCardResult;

/**
 * 读取智能锁内所有有效IC卡操作结果
 */
declare type TTLockGetAllValidICCardResult = TTLock.GetValidICCardResult;

/**
 * 添加指纹操作结果
 */
declare type TTLockAddFingerprintResult = TTLock.AddFingerprintResult;

/**
 * 读取智能锁内所有有效IC卡操作结果
 */
declare type TTLockGetAllValidFingerprintResult = TTLock.GetValidFingerprintResult;

/**
 * 查询智能锁开闭状态操作结果
 */
declare type TTLockGetLockStatusResult = TTLock.GetLockStatusResult;

/**
 * 查询智能锁远程开关开启状态结果
 */
declare type TTLockGetRemoteUnlockSwitchStateResult = TTLock.GetRemoteUnlockSwitchResult;

/**
 * 设置智能锁远程开关开启状态结果
 */
declare type TTLockSetRemoteUnlockSwitchStateResult = TTLock.SetRemoteUnlockSwitchResult;

/**
 * 查询智能锁开关开启状态结果
 */
declare type TTLockGetLockConfigResult = TTLock.GetLockSwitchResult;

/**
 * 设置智能锁开关开启状态结果
 */
declare type TTLockSetLockConfigResult = TTLock.SetLockSwitchResult;

/**
 * 扫描wifi锁附近的wifi列表操作结果
 */
declare type TTLockScanWifiResult = TTLock.ScanWiFiResult;

/**
 * 查询wifi锁省电模式配置信息结果
 */
declare type TTLockGetPowerSavingResult = TTLock.GetPowerSavingResult;

/**
 * 查询智能锁常开模式配置信息结果
 */
declare type TTLockGetPassageModeResult = TTLock.GetPassageModeResult;

/**
 * 查询自动闭锁配置信息结果
 */
declare type TTLockGetAutomaticLockingPeriodResult = TTLock.GetAutoLockResult;

/**
 * 查询智能锁音量配置信息结果
 */
declare type TTLockGetLockSoundWithSoundVolumeResult = TTLock.GetSoundVolumeResult;

/**
 * 智能锁固件升级结果
 */
declare type TTLockEnterDfuModeResult = TTLock.EnterDfuModeResult;