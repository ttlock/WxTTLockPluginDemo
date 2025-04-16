/// <reference path="./device.d.ts" />

declare namespace TTLock {
    /**
	 * 智能锁版本信息
	 * @since 1.0.0
	 */
    interface LockVersion {
        /**
         * @description 智能锁协议版本号
         * @since 1.0.0
         */
        protocolVersion: number;
        /**
         * @description 智能锁协议类型
         * @since 1.0.0
         */
        protocolType: number;
        /**
         * @description 场景值
         * @since 1.0.0
         */
        scene: number;
        /**
         * @description 应用商ID，3.1.0之前扫描设备时固定返回1, 3.1.0开始扫描不再返回
         * @since 1.0.0
         */
        groupId?: number;
        /**
         * @description 应用商子ID，3.1.0之前扫描设备时固定返回1, 3.1.0开始扫描不再返回
         * @since 1.0.0
         */
        orgId?: number;
        /**
         * @description LOGO
         * @since 1.0.0
         */
        logoUrl?: string;
        showAdminKbpwdFlag?: boolean;
    }

    /**
	 * 蓝牙扫描智能锁信息
	 * @since 1.0.0
	 */
	interface DeviceModel extends TTDevice.DeviceModel {
        /**
		 * @description 智能锁类型
		 * @since 2.7.0
		 * @see TTLOCK_TYPE
		 */
        type: number;
		/**
		 * @description 智能锁版本信息
         * @since 2.7.0
		 */
		lockVersion?: LockVersion;
		/**
		 * @description 智能锁电量
		 * @since 1.0.0
		 */
		electricQuantity?: number;
		/**
		 * @description 设备是否处于可触摸开锁状态
		 * @since 2.7.0
		 */
		isTouch?: boolean;
    }
    
    /**
	 * 智能锁特征值解析状态
	 * @since 2.1.0
	 */
	interface FeatureValue {
		/**
		 * @description Keypad Password
		 */
		passcode?: boolean;
		/**
		 * @description IC Card
		 */
		ICCard?: boolean;
		/**
		 * @description Fingerprint
		 */
		fingerprint?: boolean;
		/**
		 * @description Smart Bracelet
		 */
		wristband?: boolean;
		/**
		 * @description Automatic Locking
		 */
		autoLock: boolean;
		/**
		 * @description Delete keypad password
		 */
		delPasscode: boolean;
		/**
		 * @description Firmware Upgrade
		 */
		updateHardware: boolean;
		/**
		 * @description Keypad Password Management
		 */
		mngPasscode: boolean;
		/**
		 * @description Command Locking
		 */
		locking: boolean;
		/**
		 * @description Keyboard Password Visibility Control
		 */
		passcodeVisible: boolean;
		/**
		 * @description Remote Unlocking
		 */
		gatewayUnlock: boolean;
		/**
		 * @description Freeze and Unfreeze E-Keys via Gateway
		 */
		gatewayFreeze: boolean;
		/**
		 * @description Cyclic Keyboard Password
		 */
		cyclePasscode: boolean;
		/**
		 * @description Supports Door Contact Sensor
		 */
		doorSensor: boolean;
		/**
		 * @description Remote Unlock Switch
		 */
		remoteUnlockSwitch: boolean;
		/**
		 * @description Supports Enabling or Disabling Voice Prompt Management
		 */
		audioSwitch: boolean;
		/**
		 * @description Supports NB-IoT
		 */
		NBIoT: boolean;
		/**
		 * @description Supports Reading the Administrator Password
		 */
		getAdminPasscode: boolean;
		/**
		 * @description Supports Hotel Lock Card System
		 */
		hotelCard: boolean;
		/**
		 * @description The lock does not have a clock chip
		 */
		noClock: boolean;
		/**
		 * @description Does not support Bluetooth unlocking.
		 */
		noBleUnlock: boolean;
		/**
		 * @description Supports Always-On Mode.
		 */
		passageMode: boolean;
		/**
		 * @description Does the Always-On Mode support disabling the automatic locking function
		 */
		autoLockInPassageMode: boolean;
		/**
		 * @description Wireless keyboard
		 */
		wirelessKeypad: boolean;
		/**
		 * @description Lighting timer configuration.
		 */
		lightTimeSetting: boolean;
		/**
		 * @description Allow reporting a lost hotel card.
		 */
		hotelCardBlacklist: boolean;
		/**
		 * @description ID Card
		 */
		IDCard: boolean;
		/**
		 * @description Tamper-proof switch
		 */
		tamperSwitch: boolean;
		/**
		 * @description Reset button configuration
		 */
		resetButton: boolean;
		/**
		 * @description Privacy lock
		 */
		privacyLock: boolean;
		/**
		 * @description Deadlock
		 */
		deadLock: boolean;
		/**
		 * @description Always-on mode exception
		 */
		passageModeException: boolean;
		/**
		 * @description Supports cyclic fingerprint/IC card
		 */
		cyclicCardOrFingerprint: boolean;
		/**
		 * @description Supports left/right door opening configuration
		 */
		unlockDirection: boolean;
		/**
		 * @description Supports finger vein recognition
		 */
		fingerVein: boolean;
		/**
		 * @description Supports 5G Bluetooth
		 */
		ble5G: boolean;
		/**
		 * @description Supports NB activation configuration
		 */
		NBAwake: boolean;
		/**
		 * @description Supports cyclic password recovery function
		 */
		recoverCyclePasscode: boolean;
		/**
		 * @description Supports wireless key (remote control)
		 */
		wirelessKeyFob: boolean;
		/**
		 * @description Supports reading accessory battery level information
		 */
		getAccessoryElectricQuantity: boolean;
		/**
		 * @description Supports volume and language settings
		 */
		soundVolume: boolean;
		/**
		 * @description Supports QR code unlocking
		 */
		QRCode: boolean;
		/**
		 * @description Supports door sensor status
		 */
		sensorState: boolean;
		/**
		 * @description Supports automatic unlocking setting in always-open mode
		 */
		passageModeAutoUnlock: boolean;
		/**
		 * @description Supports fingerprint distribution function
		 */
		gatwayFingerprint: boolean;
		/**
		 * @description Supports ZKTeco fingerprint distribution
		 */
		zhongzhengFingerprint: boolean;
		/**
		 * @description Supports Microarray fingerprint distribution
		 */
		shenyuanFingerprint: boolean;
		/**
		 * @description Supports wireless door sensors
		 */
		wirelessDoorSensor: boolean;
		/**
		 * @description Supports door open alarm
		 */
		doorSensorAlert: boolean;
		/**
		 * @description Supports proximity sensing
		 */
		sensitivity: boolean;
		/**
		 * @description Supports 3D facial recognition
		 */
		face: boolean;
		/**
		 * @description Supports CPU cards
		 */
		CPUCard: boolean;
		/**
		 * @description Supports WIFI lock functionality
		 */
		WIFI: boolean;
		/**
		 * @description The WIFI lock supports a fixed IP address
		 */
		WifiLockStaticIP: boolean;
		/**
		 * @description Supports partial password lock
		 */
		passcodeKeyNumber: boolean;
		/**
		 * @description "Supports two-factor authentication (2FA)
		 */
		twoFactorAuth: boolean;
		/**
		 * @description Supports Xiongmai video intercom functionality
		 */
		catEyeXM: boolean;
		/**
		 * @description Supports Zhian face recognition deployment
		 */
		faceZA: boolean;
		/**
		 * @description Supports palm vein recognition
		 */
		palmVein: boolean;
	}
}

/**
 * 智能锁版本信息
 * @since 1.0.0
 */
declare type TTLockVersion = TTLock.LockVersion;

/**
 * 蓝牙扫描到的智能锁设备
 * @since 1.0.0
 */
declare type TTLockFromScan = TTLock.DeviceModel;

/**
 * 智能锁特征值解析状态
 * @since 2.1.0
 */
declare type TTLockFeatureValue = TTLock.FeatureValue;