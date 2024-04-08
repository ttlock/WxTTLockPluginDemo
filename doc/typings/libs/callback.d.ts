/// <reference path="./options.d.ts" />
/// <reference path="./result.d.ts" />

/** 通通锁常规回调方法 */
type TTLockCallback = (res: TTLockError) => any;

/** 自定义日志输出回调方法 */
type TTLockShowLogCallback = (...logs: any) => any;

/** 用户扫描到智能锁回调方法 */
type TTLockScanLockCallback = (deviceFromScan: TTLockFromScan | null, deviceFromScanList: Array<TTLockFromScan>) => any;

/** 用户扫描到网关回调方法 */
type TTLockScanGatewayCallback = (deviceFromScan: TTGatewayFromScan | null, deviceFromScanList: Array<TTGatewayFromScan>) => any;

/** 添加IC卡中间步骤回调方法 */
type TTLockAddICCardCallback = (result: TTLockAddICCardResult) => any;

/** 添加指纹中间步骤回调方法 */
type TTLockAddFingerprintCallback = (result: TTLockAddFingerprintResult) => any;

/** 智能锁升级中间步骤回调方法 */
type TTLockEnterDfuModeCallback = (result: TTLockEnterDfuModeResult) => any;