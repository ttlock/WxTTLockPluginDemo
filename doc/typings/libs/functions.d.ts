/// <reference path="./params.d.ts" />
/// <reference path="./options.d.ts" />
/// <reference path="./result.d.ts" />
/// <reference path="./callback.d.ts" />
/// <reference path="./interfaceParam.d.ts" />

declare function setShowLog(openLog: boolean, callback?: TTLockShowLogCallback): void;
declare function getLockType(lockVersion: TTLockVersion): TTLOCK_TYPE;
declare function parseSpecialValues(featureValue: string | number): TTLockFeatureValue;

declare function startScanBleDevice(callback?: TTLockScanLockCallback, failCallback?: TTLockCallback): Promise<TTLockError>;
declare function startScanGateway(callback?: TTLockScanGatewayCallback, failCallback?: TTLockCallback): Promise<TTLockError>;
declare function stopScanBleDevice(): Promise<TTLockError>;
declare function stopScanGateway(): Promise<TTLockError>;
declare function stopAllOperations(): Promise<TTLockError>;

declare function getLockVersion(option: TTLockGetVersion): Promise<TTLockGetVersionResult>
declare function getLockVersion(deviceFromScan: TTLockFromScan, disconnectCallback?: TTLockCallback): Promise<TTLockGetVersionResult>
declare function getLockVersion(macOrLockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetVersionResult>
declare function initLock(option: TTLockInit): Promise<TTLockInitResult>
declare function initLock(deviceFromScan: TTLockFromScan, disconnectCallback?: TTLockCallback, vendor?: string): Promise<TTLockInitResult>
declare function resetLock(option: TTLockReset): Promise<TTLockError>
declare function resetLock(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function controlLock(option: TTLockControl): Promise<TTLockControlResult>
declare function controlLock(controlAction: TTLOCK_CONTROL_TYPE, lockData: string, disconnectCallback?: TTLockCallback, floorList?: Array<number>): Promise<TTLockControlResult>
declare function setLockTime(option: TTLockSetTime): Promise<TTLockError>
declare function setLockTime(serverTime: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function getOperationLog(option: TTLockGetOperationLog): Promise<TTLockGetOperationLogResult>
declare function getOperationLog(logType: TTLOCK_READ_RECORD_TYPE, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetOperationLogResult>

declare function createCustomPasscode(option: TTLockCreateCustomPasscode): Promise<TTLockCreateCustomPasscodeResult>
declare function createCustomPasscode(passcode: string, startDate: number, endDate: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockCreateCustomPasscodeResult>
declare function modifyPasscode(option: TTLockModifyPasscode): Promise<TTLockError>
declare function modifyPasscode(originalPasscode: string, passcode: string, startDate: number, endDate: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function deletePasscode(option: TTLockDeletePasscode): Promise<TTLockError>
declare function deletePasscode(passcode: string, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function getAllValidPasscode(option: TTLockGetAllValidPasscode): Promise<TTLockGetAllValidPasscodeResult>
declare function getAllValidPasscode(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetAllValidPasscodeResult>
declare function getAdminPasscode(option: TTLockGetAdminPasscode): Promise<TTLockGetAdminPasscodeResult>
declare function getAdminPasscode(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetAdminPasscodeResult>
declare function modifyAdminPasscode(option: TTLockModifyAdminPasscode): Promise<TTLockModifyAdminPasscodeResult>
declare function modifyAdminPasscode(newPasscode: string, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockModifyAdminPasscodeResult>

declare function addICCard(option: TTLockAddICCard): Promise<TTLockAddICCardResult>
declare function addICCard(startDate: number, endDate: number, lockData: string, callback?: TTLockAddICCardCallback): Promise<TTLockAddICCardResult>
declare function recoverICCardNumber(option: TTLockRecoverICCard): Promise<TTLockError>
declare function recoverICCardNumber(cardNum: number, startDate: number, endDate: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function modifyICCardValidityPeriod(option: TTLockModifyICCardPeriod): Promise<TTLockError>
declare function modifyICCardValidityPeriod(startDate: number, endDate: number, cardNum: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function deleteICCard(option: TTLockDeleteICCard): Promise<TTLockError>
declare function deleteICCard(cardNum: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function getAllValidICCard(option: TTLockGetAllValidICCard): Promise<TTLockGetAllValidICCardResult>
declare function getAllValidICCard(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetAllValidICCardResult>

declare function addFingerprint(option: TTLockAddFingerprint): Promise<TTLockAddFingerprintResult>
declare function addFingerprint(startDate: number, endDate: number, lockData: string, callback?: TTLockAddFingerprintCallback): Promise<TTLockAddFingerprintResult>
declare function modifyFingerprintValidityPeriod(option: TTLockModifyFingerprintPeriod): Promise<TTLockError>
declare function modifyFingerprintValidityPeriod(startDate: number, endDate: number, fingerprintNum: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function deleteFingerprint(option: TTLockDeleteFingerprint): Promise<TTLockError>
declare function deleteFingerprint(fingerprintNum: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function getAllValidFingerprint(option: TTLockGetAllValidFingerprint): Promise<TTLockGetAllValidFingerprintResult>
declare function getAllValidFingerprint(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetAllValidFingerprintResult>

declare function getRemoteUnlockSwitchState(option: TTLockGetRemoteUnlockSwitchState): Promise<TTLockGetRemoteUnlockSwitchStateResult>
declare function getRemoteUnlockSwitchState(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetRemoteUnlockSwitchStateResult>
declare function setRemoteUnlockSwitchState(option: TTLockSetRemoteUnlockSwitchState): Promise<TTLockSetRemoteUnlockSwitchStateResult>
declare function setRemoteUnlockSwitchState(enable: boolean, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockSetRemoteUnlockSwitchStateResult>
declare function getLockConfig(option: TTLockGetLockConfig): Promise<TTLockGetLockConfigResult>
declare function getLockConfig(configType: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetLockConfigResult>
declare function setLockConfig(option: TTLockSetLockConfig): Promise<TTLockSetLockConfigResult>
declare function setLockConfig(configType: number, switchOn: boolean, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockSetLockConfigResult>
declare function getLockStatus(option: TTLockGetLockStatus): Promise<TTLockGetLockStatusResult>
declare function getLockStatus(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetLockStatusResult>
declare function getPassageMode(option: TTLockGetPassageMode): Promise<TTLockGetPassageModeResult>
declare function getPassageMode(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetPassageModeResult>
declare function configPassageMode(option: TTLockConfigPassageMode): Promise<TTLockError>
declare function configPassageMode(config: TTLockPassageModeConfiguration, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function clearPassageMode(option: TTLockClearPassageMode): Promise<TTLockError>
declare function clearPassageMode(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function getAutomaticLockingPeriod(option: TTLockGetAutomaticLockingPeriod): Promise<TTLockGetAutomaticLockingPeriodResult>
declare function getAutomaticLockingPeriod(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetAutomaticLockingPeriodResult>
declare function setAutomaticLockingPeriod(option: TTLockSetAutomaticLockingPeriod): Promise<TTLockError>
declare function setAutomaticLockingPeriod(seconds: number, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function getLockSoundWithSoundVolume(option: TTLockGetLockSoundWithSoundVolume): Promise<TTLockGetLockSoundWithSoundVolumeResult>
declare function getLockSoundWithSoundVolume(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockGetLockSoundWithSoundVolumeResult>
declare function setLockSoundWithSoundVolume(option: TTLockSetLockSoundWithSoundVolume): Promise<TTLockError>
declare function setLockSoundWithSoundVolume(soundVolume: TTLOCK_SOUND_VOLUME, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>

declare function setHotelData(option: TTLockSetHotelData): Promise<TTLockError>
declare function setHotelData(hotelData: TTLockHotelData, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function setHotelSector(option: TTLockSetHotelSector): Promise<TTLockError>
declare function setHotelSector(sectors: Array<number>, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function setLiftWorkMode(option: TTLockSetLiftWorkMode): Promise<TTLockError>
declare function setLiftWorkMode(workMode: TTLOCK_LIFT_WORKMODE, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function setLiftControlableFloors(option: TTLockSetLiftControlableFloors): Promise<TTLockError>
declare function setLiftControlableFloors(floors: Array<number>, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function setPowerSaverWorkMode(option: TTLockSetPowerSaverWorkMode): Promise<TTLockError>
declare function setPowerSaverWorkMode(powerSaverWorkMode: TTLOCK_POWER_SAVER_WORKMODE, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function setPowerSaverControlableLock(option: TTLockSetPowerSaverControlableLock): Promise<TTLockError>
declare function setPowerSaverControlableLock(lockMac: string, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>

declare function scanWifi(option: TTLockScanWifi): Promise<TTLockScanWifiResult>
declare function scanWifi(lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockScanWifiResult>
declare function configWifi(option: TTLockConfigWifi): Promise<TTLockError>
declare function configWifi(config: TTLockWifiInfo, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function configServer(option: TTLockConfigServer): Promise<TTLockError>
declare function configServer(config: TTLockServerIPAddress, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>
declare function configIp(option: TTLockConfigIP): Promise<TTLockError>
declare function configIp(ipSetting: TTLockLocaleIPAddress, lockData: string, disconnectCallback?: TTLockCallback): Promise<TTLockError>

declare function enterDfuMode(option: TTLockEnterDfuMode): Promise<TTLockEnterDfuModeResult>
declare function enterDfuMode(dfuPackageInfo: TTLockDfuPackageInfo, lockData: string, callback?: TTLockEnterDfuModeCallback): Promise<TTLockEnterDfuModeResult>

declare function connectGateway(option: TTLockConnectGateway): Promise<TTLockError>;
declare function connectGateway(deviceFromScan: TTGatewayFromScan, disconnectCallback?: TTLockCallback): Promise<TTLockError>;
declare function scanWiFiByGateway(option: TTLockScanWifiByGateway): Promise<TTLockScanWifiByGatewayResult>;
declare function scanWiFiByGateway(deviceFromScan: TTGatewayFromScan, disconnectCallback?: TTLockCallback): Promise<TTLockScanWifiByGatewayResult>;
declare function initGateway(option: TTLockInitGateway): Promise<TTLockInitGatewayResult>;
declare function initGateway(deviceFromScan: TTGatewayFromScan, configuration?: TTLockGatewayConfiguration, disconnectCallback?: TTLockCallback): Promise<TTLockInitGatewayResult>;