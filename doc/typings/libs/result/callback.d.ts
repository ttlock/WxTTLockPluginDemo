/// <reference path="./lock.d.ts" />

declare namespace TTDevice {
    /**
     * 通通锁常规回调方法
     */
    type DefaultCallback<T = any> = (res: TTLockError<T>) => any;

    /**
     * 自定义日志输出回调方法
     */
    type LogCallback = (...logs: any) => any;
}

declare namespace TTLock {
    /**
     * 智能锁扫描回调
     */
    type OnScanCallback = (deviceFromScan?: TTLock.DeviceModel, deviceFromScanList?: Array<TTLock.DeviceModel>) => any;

    /**
     * 添加IC卡中间步骤回调
     */
    type InitCardCallback = (result: TTLock.AddICCardResult) => any;

    /**
     * 添加指纹中间步骤回调
     */
    type InitFingerprintCallback = (result: TTLock.AddFingerprintResult) => any;

    /**
     * 智能锁升级中间步骤回调
     */
    type UpgradeCallback = (result: TTLock.EnterDfuModeResult) => any;
}

declare namespace TTGateway {
    /**
     * 网关扫描回调
     */
    type OnScanCallback = (deviceFromScan?: TTGateway.DeviceModel, deviceFromScanList?: Array<TTGateway.DeviceModel>) => any;
}

/**
 * 通通锁常规回调方法
 */
declare type TTLockCallback<T = any> = TTDevice.DefaultCallback<T>;

/**
 * 自定义日志输出回调方法
 */
declare type TTLockShowLogCallback = TTDevice.LogCallback;

/**
 * 智能锁扫描回调
 */
declare type TTLockScanCallback = TTLock.OnScanCallback;

/**
 * 网关扫描回调
 */
declare type TTGatewayScanCallback = TTGateway.OnScanCallback;

/**
 * 添加IC卡中间步骤回调
 */
declare type TTLockAddICCardCallback = TTLock.InitCardCallback;

/**
 * 添加指纹中间步骤回调
 */
declare type TTLockAddFingerprintCallback = TTLock.InitFingerprintCallback;

/**
 * 智能锁升级中间步骤回调
 */
declare type TTLockEnterDfuModeCallback = TTLock.UpgradeCallback;
