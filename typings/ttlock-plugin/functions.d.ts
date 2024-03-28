/// <reference path="./params.d.ts" />
/// <reference path="./options.d.ts" />
/// <reference path="./result.d.ts" />
/// <reference path="./callback.d.ts" />
/// <reference path="./interfaceParam.d.ts" />

declare namespace TTLockPluginModel {
    export function setShowLog(openLog: boolean, callback?: TTLockShowLogCallback): void;
    export function getLockType(lockVersion: TTLockVersion): TTLOCK_TYPE;
    export function parseSpecialValues(featureValue: string | number): TTLockFeatureValue;

    export function startScanBleDevice(callback?: TTLockScanLockCallback, failCallback?: TTLockCallback): Promise<TTLockError>;
    export function startScanGateway(callback?: TTLockScanGatewayCallback, failCallback?: TTLockCallback): Promise<TTLockError>;
    export function stopScanBleDevice(): Promise<TTLockError>;
    export function stopScanGateway(): Promise<TTLockError>;
    export function stopAllOperations(): Promise<TTLockError>;

    export function getLockVersion(option: TTLockGetVersion): Promise<TTLockGetVersionResult>
    export function getLockVersion(deviceFromScan: TTLockFromScan, disconnectCallback?: TTLockCallback): Promise<TTLockGetVersionResult>
    export function getLockVersion(macOrLockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetVersionResult>
    export function initLock(option: TTLockInit): Promise<TTLockInitResult>
    export function initLock(deviceFromScan: TTLockFromScan, disconnectCallback?: TTLockCallback, vendor?: string): Promise<TTLockInitResult>
    export function resetLock(option: TTLockReset): Promise<TTLockError>
    export function resetLock(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function controlLock(option: TTLockControl): Promise<TTLockControlResult>
    export function controlLock(controlAction: TTLOCK_CONTROL_TYPE, lockData: string, disconnectCallback?: TTLockCallback, floorList?: Array<number>): Promise<TTLockControlResult>
    export function setLockTime(option: TTLockSetTime): Promise<TTLockError>
    export function setLockTime(serverTime: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function getOperationLog(option: TTLockGetOperationLog): Promise<TTLockGetOperationLogResult>
    export function getOperationLog(logType: TTLOCK_READ_RECORD_TYPE, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetOperationLogResult>

    export function createCustomPasscode(option: TTLockCreateCustomPasscode): Promise<TTLockCreateCustomPasscodeResult>
    export function createCustomPasscode(passcode: string, startDate: number, endDate: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockCreateCustomPasscodeResult>
    export function modifyPasscode(option: TTLockModifyPasscode): Promise<TTLockError>
    export function modifyPasscode(originalPasscode: string, passcode: string, startDate: number, endDate: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function deletePasscode(option: TTLockDeletePasscode): Promise<TTLockError>
    export function deletePasscode(passcode: string, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function getAllValidPasscode(option: TTLockGetAllValidPasscode): Promise<TTLockGetAllValidPasscodeResult>
    export function getAllValidPasscode(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetAllValidPasscodeResult>
    export function getAdminPasscode(option: TTLockGetAdminPasscode): Promise<TTLockGetAdminPasscodeResult>
    export function getAdminPasscode(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetAdminPasscodeResult>
    export function modifyAdminPasscode(option: TTLockModifyAdminPasscode): Promise<TTLockModifyAdminPasscodeResult>
    export function modifyAdminPasscode(newPasscode: string, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockModifyAdminPasscodeResult>

    export function addICCard(option: TTLockAddICCard): Promise<TTLockAddICCardResult>
    export function addICCard(startDate: number, endDate: number, lockData: string, callback?: TTLockAddICCardCallback): Promise<TTLockAddICCardResult>
    export function recoverICCardNumber(option: TTLockRecoverICCard): Promise<TTLockError>
    export function recoverICCardNumber(cardNum: number, startDate: number, endDate: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function modifyICCardValidityPeriod(option: TTLockModifyICCardPeriod): Promise<TTLockError>
    export function modifyICCardValidityPeriod(startDate: number, endDate: number, cardNum: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function deleteICCard(option: TTLockDeleteICCard): Promise<TTLockError>
    export function deleteICCard(cardNum: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function getAllValidICCard(option: TTLockGetAllValidICCard): Promise<TTLockGetAllValidICCardResult>
    export function getAllValidICCard(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetAllValidICCardResult>

    export function addFingerprint(option: TTLockAddFingerprint): Promise<TTLockAddFingerprintResult>
    export function addFingerprint(startDate: number, endDate: number, lockData: string, callback?: TTLockAddFingerprintCallback): Promise<TTLockAddFingerprintResult>
    export function modifyFingerprintValidityPeriod(option: TTLockModifyFingerprintPeriod): Promise<TTLockError>
    export function modifyFingerprintValidityPeriod(startDate: number, endDate: number, fingerprintNum: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function deleteFingerprint(option: TTLockDeleteFingerprint): Promise<TTLockError>
    export function deleteFingerprint(fingerprintNum: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function getAllValidFingerprint(option: TTLockGetAllValidFingerprint): Promise<TTLockGetAllValidFingerprintResult>
    export function getAllValidFingerprint(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetAllValidFingerprintResult>

    export function getRemoteUnlockSwitchState(option: TTLockGetRemoteUnlockSwitchState): Promise<TTLockGetRemoteUnlockSwitchStateResult>
    export function getRemoteUnlockSwitchState(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetRemoteUnlockSwitchStateResult>
    export function setRemoteUnlockSwitchState(option: TTLockSetRemoteUnlockSwitchState): Promise<TTLockSetRemoteUnlockSwitchStateResult>
    export function setRemoteUnlockSwitchState(enable: boolean, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockSetRemoteUnlockSwitchStateResult>
    export function getLockConfig(option: TTLockGetLockConfig): Promise<TTLockGetLockConfigResult>
    export function getLockConfig(configType: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetLockConfigResult>
    export function setLockConfig(option: TTLockSetLockConfig): Promise<TTLockSetLockConfigResult>
    export function setLockConfig(configType: number, switchOn: boolean, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockSetLockConfigResult>
    export function getLockStatus(option: TTLockGetLockStatus): Promise<TTLockGetLockStatusResult>
    export function getLockStatus(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetLockStatusResult>
    export function getPassageMode(option: TTLockGetPassageMode): Promise<TTLockGetPassageModeResult>
    export function getPassageMode(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetPassageModeResult>
    export function configPassageMode(option: TTLockConfigPassageMode): Promise<TTLockError>
    export function configPassageMode(config: TTLockPassageModeConfiguration, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function clearPassageMode(option: TTLockClearPassageMode): Promise<TTLockError>
    export function clearPassageMode(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function getAutomaticLockingPeriod(option: TTLockGetAutomaticLockingPeriod): Promise<TTLockGetAutomaticLockingPeriodResult>
    export function getAutomaticLockingPeriod(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetAutomaticLockingPeriodResult>
    export function setAutomaticLockingPeriod(option: TTLockSetAutomaticLockingPeriod): Promise<TTLockError>
    export function setAutomaticLockingPeriod(seconds: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function getLockSoundWithSoundVolume(option: TTLockGetLockSoundWithSoundVolume): Promise<TTLockGetLockSoundWithSoundVolumeResult>
    export function getLockSoundWithSoundVolume(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetLockSoundWithSoundVolumeResult>
    export function setLockSoundWithSoundVolume(option: TTLockSetLockSoundWithSoundVolume): Promise<TTLockError>
    export function setLockSoundWithSoundVolume(config: TTLOCK_SOUND_VOLUME, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>

    export function setHotelData(option: TTLockSetHotelData): Promise<TTLockError>
    export function setHotelData(hotelData: TTLockHotelData, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function setHotelSector(option: TTLockSetHotelSector): Promise<TTLockError>
    export function setHotelSector(sectors: Array<number>, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function setLiftWorkMode(option: TTLockSetLiftWorkMode): Promise<TTLockError>
    export function setLiftWorkMode(workMode: TTLOCK_LIFT_WORKMODE, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function setLiftControlableFloors(option: TTLockSetLiftControlableFloors): Promise<TTLockError>
    export function setLiftControlableFloors(floors: Array<number>, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function setPowerSaverWorkMode(option: TTLockSetPowerSaverWorkMode): Promise<TTLockError>
    export function setPowerSaverWorkMode(powerSaverWorkMode: TTLOCK_POWER_SAVER_WORKMODE, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function setPowerSaverControlableLock(option: TTLockSetPowerSaverControlableLock): Promise<TTLockError>
    export function setPowerSaverControlableLock(lockMac: string, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>

    export function scanWifi(option: TTLockScanWifi): Promise<TTLockScanWifiResult>
    export function scanWifi(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockScanWifiResult>
    export function configWifi(option: TTLockConfigWifi): Promise<TTLockError>
    export function configWifi(config: TTLockWifiInfo, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function configServer(option: TTLockConfigServer): Promise<TTLockError>
    export function configServer(config: TTLockServerIPAddress, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
    export function configIp(option: TTLockConfigIP): Promise<TTLockError>
    export function configIp(ipSetting: TTLockLocaleIPAddress, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>

    export function enterDfuMode(option: TTLockEnterDfuMode): Promise<TTLockEnterDfuModeResult>
    export function enterDfuMode(dfuPackageInfo: TTLockDfuPackageInfo, lockData: string, callback?: TTLockEnterDfuModeCallback): Promise<TTLockEnterDfuModeResult>

    export function connectGateway(option: TTLockConnectGateway): Promise<TTLockError>;
    export function connectGateway(deviceFromScan: TTGatewayFromScan, disconnectCallback?: TTLockCallback): Promise<TTLockError>;
    export function scanWiFiByGateway(option: TTLockScanWifiByGateway): Promise<TTLockScanWifiByGatewayResult>;
    export function scanWiFiByGateway(deviceFromScan: TTGatewayFromScan, disconnectCallback?: TTLockCallback): Promise<TTLockScanWifiByGatewayResult>;
    export function initGateway(option: TTLockInitGateway): Promise<TTLockInitGatewayResult>;
    export function initGateway(deviceFromScan: TTGatewayFromScan, configuration?: TTLockGatewayConfiguration, disconnectCallback?: TTLockCallback): Promise<TTLockInitGatewayResult>;
}

declare type TTLockPlugin = typeof TTLockPluginModel;