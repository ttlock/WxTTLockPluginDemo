/// <reference path="../enums/index.d.ts" />

/**
 * TTLock 常规错误返回结果
 * @see TTLOCK_ERROR_CODE
 * @since 1.0.0
 */
declare interface TTLockError<T = any> {
    /**
     * @description TTLock 常规错误码
     * @see TTLOCK_ERROR_CODE
     * @since 1.0.0
     */
    errorCode: number;
    /**
	 * 错误信息描述
	 * @since 1.0.0
	 */
    errorMsg: string;
    /**
	 * 错误信息描述补充
	 * @since 1.0.0
	 */
    description?: string;
    /**
	 * 设备电量
	 * @since 2.7.0
	 */
    electricQuantity?: number;
    /**
	 * 内部报错结果，仅用于内部调试
	 * @since 3.1.0
	 */
    wxInterface?: string;
    /**
	 * 其余返回参数
	 * @since 1.0.0
	 */
    data?: T;
    /**
     * 微信蓝牙接口返回错误码
     * @deprecated 3.1.0
     */
    errCode?: number;
    /**
     * 微信蓝牙错误信息描述
     * @deprecated 3.1.0
     */
    errMsg?: string;
    /**
     * 蓝牙设备ID
     * @since 2.7.0
     * @deprecated 3.1.0
     */
    deviceId?: string;
    /**
     * 是否支持重试
     * @deprecated 3.1.0
     */
    isTryAgain?: boolean;
}