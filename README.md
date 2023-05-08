# 通通锁蓝牙模块通信插件接口说明文档 (version: 2.x)

## 说明
 通通锁蓝牙模块通信插件是基于微信小程序接口开发的蓝牙模块插件，使用时需配合通通锁开放平台接口或相关本地开发包使用。
 小程序后台可通过搜索“**通通锁**”或小程序appid进行搜索  
 在线版appid: **wx43d5971c94455481** (免费使用)  
 离线版appid: **wxc788856964635783** (付费使用)  

 **2.x版本接口适配开放平台Cloud API V3版本接口，相对1.x版本的接口有很大改动，升级时请特别注意**  
 **2.x版本不再兼容1.x版本接口**
 **接口为蓝牙通信模块，操作时需通过蓝牙进行设备交互，操作中将向用户请求scope.bluetooth权限**

1. 添加智能锁：通过初始化完成的操作为本地操作，不与服务器交互，需自行调用远程接口进行数据同步 
    **注意：若未上传服务器可能导致智能锁数据丢失，只能物理重置智能锁**  
2. 开锁：调用获取锁的普通钥匙列表(其余获取钥匙的接口均可) -> 小程序controlLock接口开锁  
    **注意：小程序接口不主动上传操作记录，如需上传请自行调用开放平台接口上传记录**  
3. 小程序插件单个接口内部自动连接和断开设备，无需额外连接蓝牙操作，但**两个蓝牙接口调用之间需要设置一定的延迟时间**，否则可能出现“启用蓝牙特征值监控失败，请重试”或“锁连接已断开”等错误，具体可参考demo
	**2.7.0开始不再需要设置延迟，不主动断开设备连接**
4. 受数据通信影响，真机调试可能导致设备意外断连而无法正常操作，因此**不建议使用真机调试模式**，**iOS设备目前不支持真机调试**
	**调试时可使用预览模式并打开手机端进行开发调试**



## 重要参数  

### 导出参数

#### 1. 智能锁类型-LockType (2.7.0) 

`enum LockType`

###### 参数说明
+ LockType参数说明
```
	enum LockType {
		 V3 = 5,       		// 三代锁
		 V2_S2 = 4,          // 二代锁(带永久密码功能)
		 V2_S1 = 3,          // 二代门锁
		 UNSUPPORT = 0,       // 不支持的锁类型
	}
``` 

###### 说明
+ 当前小程序仅支持三代锁，二代锁不支持

###### 版本更新内容 
+ **2.7.0**  
	 1. 2.7.0版本新增 



#### 2. 锁开关配置属性类型-LockConfigType (2.5.0) 

`enum LockConfigType`

###### 参数说明
+ LockConfigType参数说明
```
	enum LockConfigType {
		 TAMPER_ALERT = 0x01,   // 使能/禁用防撬开关
		 RESET_BUTTON = 0x02,   // 使能/禁用重置按键
		 PRIVACY_LOCK = 0x04,    // 使能/禁用反锁开关
		 UNLOCK_DIRECTION = 0x10,  // 左右开门设置（1 -左开门， 0 -右开门)
		 PASAGE_MODE_AUTO_UNLOCK_SETTING = 0x20,  // 使能/禁用常开模式自动开锁
	}
```

###### 说明
+ 锁开关配置属性类型，文档中未说明的类型为当前不支持的类型，传入时可通过

###### 版本更新内容
+ **2.5.0**  
	 1. 2.5.0版本新增



#### 3. 智能锁控制方式-ControlAction (2.7.0) 

`enum ControlAction`

###### 参数说明
+ ControlAction参数说明
```
	enum ControlAction {
		 OPEN = 3,       // 开锁
    	 CLOSE = 6,          // 闭锁
	}
```

###### 说明
+ 智能锁控制时使用参数，调用controlLock接口时使用

###### 版本更新内容
+ **2.7.0**  
	 1. 2.7.0版本新增 



#### 4. 操作记录读取方式-RecordReadType (2.7.0) 

`enum RecordReadType`

###### 参数说明
+ RecordReadType参数说明
```
	enum RecordReadType {
		 ALL = 1,            // 读取锁内所有的操作记录
    	 NEW = 2,           // 读取锁内未被读取的操作记录
	}
```

###### 说明
+ 智能锁获取操作记录时使用参数，调用getOperationLog接口时使用

###### 版本更新内容
+ **2.7.0**  
	 1. 2.7.0版本新增



#### 5. 梯控激活模式-LiftWorkMode (2.7.0) 

`enum LiftWorkMode`

###### 参数说明
+ LiftWorkMode参数说明
```
	enum LiftWorkMode {
		 ACTIVE_ALL_FLOORS = 1,   // 梯控刷卡后，仅能按房间所在楼层
    	 ACTIVE_SPECIFIC_FLOORS = 2,   // 梯控刷卡后，可按所有楼层
	}
```

###### 说明
+ 智能锁梯控激活方式

###### 版本更新内容
+ **2.7.0**  
	 1. 2.7.0版本新增


#### 6. 智能锁开关状态-LockStatus (2.7.3) 

`enum LockStatus`

###### 参数说明
+ LockStatus参数说明
```
	enum LockStatus {
		 LOCK = 0, // 智能锁关
    	 UNLOCKED = 1, // 智能锁开
    	 UNKNOWN = 2, // 状态未知
	}
```

###### 说明
+ 智能锁开关状态

###### 版本更新内容
+ **2.7.0**  
	 1. 2.7.0版本新增


#### 7. 变量 锁蓝牙模块的uuid (deprecated 已过期, 后期将不再使用) 

`LOCK_BLE_UUID`

###### 版本更新内容 
+ **2.8.0**  
	 1. 删除该参数 

+ **2.7.0**  
	 1. 接口已过期，后续将不再返回 

+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动  



#### 8. 变量 三代锁  (deprecated 已过期, 后期将不再使用)

`LOCK_TYPE_V3`  

###### 版本更新内容 
+ **2.8.0**  
	 1. 删除该参数 

+ **2.7.0**  
	 1. 接口已过期，请使用LockType参数  

+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动  


#### 9. 变量 控制锁类型-开锁  (deprecated 已过期, 后期将不再使用) 

`CONTROL_ACTION_OPEN` 

###### 说明
+ 控制锁类型，固定值3，用于开锁/闭锁接口传参

###### 版本更新内容 
+ **2.8.0**  
	 1. 删除该参数 

+ **2.7.0**  
	 1. 接口已过期，请使用ControlAction参数  

+ **2.0.0**  
	 1. 2.0.0版本新增，开锁/闭锁接口参数类型  



#### 10. 变量 控制锁类型-闭锁  (deprecated 已过期, 后期将不再使用) 

`CONTROL_ACTION_CLOSE` 

###### 说明
+ 控制锁类型，固定值6，用于开锁/闭锁接口传参

###### 版本更新内容 
+ **2.8.0**  
	 1. 删除该参数 

+ **2.7.0**  
	 1. 接口已过期，请使用ControlAction参数 
	 
+ **2.0.0**  
	 1. 2.0.0版本新增，开锁/闭锁接口参数类型  



#### 11. 变量 锁记录类型-全部读取   (deprecated 已过期, 后期将不再使用) 

`RECORD_TYPE_ALL` 

###### 说明
+ 锁记录类型，固定值1，用于读取锁操作记录传参，表示读取全部操作记录

###### 版本更新内容 
+ **2.8.0**  
	 1. 删除该参数 

+ **2.7.0**  
	 1. 接口已过期，请使用RecordReadType参数 

+ **2.0.0**  
	 1. 2.0.0版本新增


#### 12. 变量 锁记录类型-未读取的操作记录  (deprecated 已过期, 后期将不再使用)  

`RECORD_TYPE_NEW` 

###### 说明
+ 锁记录类型，固定值2，用于读取锁操作记录传参，表示读取锁内未读取的操作记录

###### 版本更新内容  
+ **2.8.0**  
	 1. 删除该参数 

+ **2.7.0**  
	 1. 接口已过期，请使用RecordReadType参数 

+ **2.0.0**  
	 1. 2.0.0版本新增




###### 说明
智能锁常规返回错误参数格式

### 其它参数

#### 1. 设备类型-DeviceType
```
    enum DeviceType {
        LOCK = 1, // 智能锁
        PLUG = 2, // 网关设备
        UNSUPPORT = 99, // 不支持的设备
    }
``` 

#### 2. 网关类型-PlugType
```
    enum PlugType {
        UNSUPPORT = -1, // 不支持
        G2 = 2, // G2网关（wifi)
        G3 = 3, // G3网关（有线）
        G4 = 4, // G4网关（4G)
    }
``` 

## 参数声明

### 返回参数
#### 1. 常规返回参数 TTLockError
```
    {
        errorCode: number, // 错误码, 请参照错误码说明
        errorMsg: string, // 错误信息
        description?: string, // 蓝牙失败原因描述
        errMsg?: string, // 蓝牙错误信息描述
        errCode?: number, // 微信返回的蓝牙错误码
        deviceId?: string, // 设备ID，用于下一次蓝牙操作性能优化(2.7.0版本新增)
        electricQuantity?: number, // 锁电量 (2.7.0版本新增，操作成功后返回)
    }
```

### 部分使用类型说明

#### 1. 智能锁版本信息 - TTLockVersion
```
    {
        protocolVersion: number; // 锁协议版本号
        protocolType: number; // 锁协议类型
        scene: number; // 设备场景值
        groupId: number; // 应用商ID, 扫描时固定返回默认值1, 非真实数据
        orgId: number; // 应用商子ID, 扫描时固定返回默认值1, 非真实数据
        logoUrl?: string; // LOGO
        showAdminKbpwdFlag?: boolean; // 是否展示管理员密码
	}
```  

#### 2. WIFI扫描信息 - TTLockWIFI
```
    {
        SSID: string; // SSID
        rssi: number; // 信号值
	}
```  

## 主要接口  

### 非蓝牙接口 

#### 1. 方法 开启/关闭调试日志

`function setShowLog (openLog: boolean): void`

###### 参数
+ openLog: 是否打印调试日志，默认不打开日志

###### 返回值
+ 无

###### 版本更新内容
+ **2.0.1**  
	 1. 修复调试默认值与文档说明不符的问题

+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动  


#### 2. 方法 获取当前智能锁类型

`function getLockType(lockVersion: TTLockVersion): LockType`  

###### 参数
+ lockVersion：智能锁版本信息 
	 + TTLockVersion说明:
```
	{
		 protocolVersion: number,   		// 锁协议版本号
    	 protocolType: number,      		// 锁协议类型
    	 scene: number,             		// 设备场景值
    	 groupId: number;        			// 应用商ID
    	 orgId: number;      				// 应用商子ID
    	 logoUrl?: string;       			// LOGO
    	 showAdminKbpwdFlag?: boolean;     	// 是否展示管理员密码
	}
```  

###### 返回值 
+ 智能锁类型，请参考LockType参数说明

###### 版本更新内容
+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动  



#### 3. 方法 判断设备是否允许远程开锁 (deprecated 已过期, 后期将不再使用)

`function isRemoteUnlockEnabled(featureValue:string | number):boolean`  

###### 参数
+ featureValue:锁的特征值, 可传入featureValueh或者specialValue, 2.4.1版本开始支持传入featureValue

###### 返回值
+ boolean, 是否支持远程开锁

###### 版本更新内容
+ **2.8.0**  
	 1. 删除该接口 

+ **2.7.0**  
	 1. 接口已过期，请使用parseSpecialValues接口

+ **2.4.1**  
	 1. 参数支持传入featureValue

+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动   



#### 4. 方法 通过广播数据获取当前设备mac地址 (deprecated 已过期, 后期将不再使用)

`function getDeviceMacAddress(deviceAdvertis: WechatMiniprogram.BlueToothDevice):string`

###### 参数
+ deviceAdvertis: 微信小程序蓝牙扫描接口返回的device对象

###### 返回值
+ 返回当前锁的mac地址, 格式`AA:AA:AA:BB:BB:BB`, 参数错误时返回空字符串

###### 版本更新内容
+ **2.8.0**  
	 1. 删除该接口

+ **2.7.0**  
	 1. 接口已过期，请使用parseSpecialValues接口
	 2. 接口不再返回null, 解析失败时返回空字符串

+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动 




#### 5. 方法 解析智能锁特征值 (2.1.0) 

`function parseSpecialValues(featureValue:string | number):TTLockFeatureConfig`

###### 参数
+ featureValue:锁的特征值, 可传入featureValueh或者specialValue, 2.4.1版本开始支持传入featureValue

###### 返回值
+ TTLockFeatureConfig说明：
```
	{
		passcode: boolean;       // 是否支持键盘密码
		ICCard: boolean;           // 是否支持IC卡
		fingerprint: boolean;        // 是否支持指纹
		wristband: boolean;               // 是否支持手环
		autoLock: boolean;           // 是否支持自动闭锁
		delPasscode: boolean;            // 是否支持删除密码
		updateHardware: boolean;         // 是否支持固件升级（**2.7.0版本新增**）
		mngPasscode: boolean;            // 是否支持密码管理

		locking: boolean;            // 指令闭锁
		passcodeVisible: boolean;       // 密码显示或隐藏的控制
		gatewayUnlock: boolean;         // 远程开锁指令
		gatewayFreeze: boolean;         // 网关冻结、解冻
		cyclePasscode: boolean;         // 循环密码
		doorSensor: boolean;                 // 支持门磁
		remoteUnlockSwitch: boolean;              // 远程开锁设置
		audioSwitch: boolean;                 // 支持启用或禁用语音提示管理

		NBIoT: boolean;                 // 支持NB
		getAdminPasscode: boolean;      // 支持读取管理员密码
		hotelCard: boolean;                 // 支持酒店锁卡系统
		noClock: boolean;                 // 锁没有时钟芯片
		noBleUnlock: boolean;                 // 不支持蓝牙开锁
		passageMode: boolean;               // 支持常开模式
		autoLockInPassageMode: boolean;               // 常开模式下是否支持关闭自动闭锁

		wirelessKeypad: boolean;               // 无线键盘
		lightTimeSetting: boolean;               // 照明灯时间配置
		hotelCardBlacklist: boolean;               // 允许挂失酒店卡
		IDCard: boolean;               // 身份证
		tamperSwitch: boolean;               // 防撬开关
		resetButton: boolean;               // 重置键配置
		privacyLock: boolean;               // 反锁
		
		deadLock: boolean;               // 死锁
		passageModeException: boolean;               // 常开模式例外（**2.7.0版本新增**）
		cyclicCardOrFingerprint: boolean;               // 支持循环指纹/IC卡

		unlockDirection: boolean;           // 支持左右开门设置（**2.5.0版本新增**）
		fingerVein: boolean;            // 支持指静脉
		ble5G: boolean;         // 支持5G蓝牙
		NBAwake: boolean;           // 支持NB激活配置

		gatwayFingerprint: boolean;               // 支持指纹下发功能（**2.7.0版本新增**）
		zhongzhengFingerprint: boolean;               // 支持中正指纹下发（**2.7.0版本新增**）
		shenyuanFingerprint: boolean;               // 支持晟元指纹下发（**2.7.0版本新增**）

		WIFI: boolean; // 支持WIFI锁功能（**2.7.6版本新增**）
	}
``` 

###### 版本更新内容 
+ **2.7.6**  
  1. 增加WIFI锁特征值

+ **2.7.0**  
  1. 增加部分特征值返回值

+ **2.5.0**  
  1. 增加是否支持左右开门设置返回值

+ **2.4.1**  
  1. 支持传入featureValue特征值 

+ **2.1.0**
	 1. 2.1.0版本新增



### 设备搜索、停止搜索  

#### 1. 方法 扫描蓝牙智能锁设备

`function startScanBleDevice (callback?: Function, failCallback?: Function):Promise<void>`

###### 参数
+ callBack扫描接口成功获取设备回调, 扫描成功该方法可能执行多次，请不要在该循环执行添加锁等操作，返回参数信息`callback(bleDevice: TTLockSmartLock | null, bleDeviceList: Array<TTLockSmartLock>)`
	 + bleDevice为扫描到的单把锁信息, 同一把锁可能返回多次, 说明:
```
	{
         deviceType: DeviceType, // 设备类型, 参考"重要参数 - 其它参数说明 - 1. 设备类型-DeviceType" (2.7.6新增)
         type: LockType, // 设备类型, 参考"重要参数 - 1. 智能锁类型-LockType" (2.7.0新增)
         deviceId: string, // 设备ID, 安卓设备："C3:38:37:1C:18:0F", iOS: "设备固定ID"(2.7.0 iOS不再在该字段返回MAC地址)
         rssi: number, // 蓝牙当前信号强度, 0表示该设备已掉线
         isSettingMode: boolean, // 设备是否处于可添加状态, 只有处于可初始化模式才能初始化锁, 1.3.0版本以前无蓝牙超时处理, 设备超时无回调 如：true
         MAC: string, // 设备MAC地址, 如："C3:38:37:1C:18:0F" (2.7.0新增)
         deviceName: string, // 设备名称, 如："LC2_0e181c" (2.7.0新增)
         updatedTime?: number, // 设备最后更新时间
         lockVersion: TTLockVersion, // 智能锁版本信息, 参考"参数类型 - 部分使用类型说明 - 1. 智能锁版本信息 - TTLockVersion" 扫描时groupId和orgId返回固定值1, 需通过getLockVersion接口更新 (2.7.0新增)
         electricQuantity: number, // 电池电量
         isTouch: boolean, // 是否处于触摸开锁状态 (2.7.0新增)

         lockName: string, // 同deviceName (deprecated 已过期, 不再使用)
         lockMac: string, // 同MAC (deprecated 已过期, 不再使用)
         lockType?: LockType, // 同type (deprecated 已过期，不再使用)
         isLock?: boolean, // 是否为智能锁 (deprecated 已过期，不再使用)
         protocolType: number, // 同lockVersion.protocolType (deprecated 已过期，不再使用)
         protocolVersion: number, // 同lockVersion.protocolVersion (deprecated 已过期，不再使用)
         scene: number, // 同lockVersion.scene (deprecated 已过期，不再使用)
	}
``` 

	 + bleDeviceList说明: 1.3.0版本新增, **为当前扫描状态下周围锁信息列表, 以添加状态、蓝牙信号强度排序**, 参数信息参考bleDevice

+ failCallback: 1.3.0版本新增,用于开启蓝牙扫描失败回调, 返回参数形式：`failCallBack(err: TTLockError)`

###### 返回值
+ 在callBack和failCallback回调中返回

###### 版本更新内容
+ **2.7.0**  
	 1. 修改返回的智能锁参数 

+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动 



#### 2. 方法 扫描蓝牙网关设备 (2.6.0) 

`function startScanGateway(callback?: Function, failCallback?: Function):Promise<void>`

###### 参数
+ callBack扫描接口成功获取设备回调, 扫描成功该方法可能执行多次，请不要在该循环内执行添加网关等操作，返回参数信息`callback(bleDevice: TTLockGateway | null, bleDeviceList: Array<TTLockGateway>)`
	 + bleDevice为扫描到的单个网关信息, 同一设备可能返回多次, 说明:
```
	{
         deviceType: DeviceType, // 设备类型, 参考"重要参数 - 其它参数说明 - 1. 设备类型-DeviceType" (2.7.6新增)
         type: PlugType, // 设备类型, 参考"网关类型-PlugType" (2.7.0新增)
         deviceId: string, // 设备ID, 安卓设备："C3:38:37:1C:18:0F", iOS: "设备固定ID"(2.7.0 iOS不再在该字段返回MAC地址)
         rssi: number, // 蓝牙当前信号强度, 0表示该设备已掉线
         isSettingMode: boolean, // 设备是否处于可添加状态, 只有处于可初始化模式才能进行设备初始化
         MAC: string, // 设备MAC地址, 如："C3:38:37:1C:18:0F" (2.7.0新增)
         deviceName: string, // 设备名称, 如："LC2_0e181c" (2.7.0新增)
         updatedTime?: number, // 设备最后更新时间

		 isGateway: boolean, // 是否为网关设备
	}
```
	 + bleDeviceList说明: **为当前扫描状态下周围网关信息列表, 以添加状态、蓝牙信号强度排序**, 参数信息参考bleDevice

+ failCallback: 用于开启蓝牙扫描失败回调, 返回参数形式：`failCallBack(err: TTLockError)`

###### 返回值
+ 在callBack和failCallback回调中返回

###### 版本更新内容
+ **2.6.0**  
	 1. 2.6.0版本新增 



#### 3. 方法 停止扫描蓝牙智能锁

`function stopScanBleDevice(callBack?: Function, failCallback?: Function):Promise<TTLockError>`

###### 参数
+ callback为蓝牙停止扫描成功接口回调, 返回参数形式：`callback(res: TTLockError)`
+ failCallback -蓝牙停止扫描失败接口回调, 返回参数形式：`failCallback(err: TTLockError)`

###### 返回值
+ 异步返回TTLockError

###### 版本更新内容
+ **2.7.0**  
	 1. 增加异步调用返回值
	 2. callBack及failCallback将在之后版本不再使用 

+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动 



#### 4. 方法 停止扫描蓝牙网关 (2.6.0) 

`function stopScanGateway(callBack?: Function, failCallback?: Function):Promise<TTLockError>`

###### 参数
+ callback为蓝牙停止扫描成功接口回调, 返回参数形式：`callback(res: TTLockError)`
+ failCallback -蓝牙停止扫描失败接口回调, 返回参数形式：`failCallback(err: TTLockError)`

###### 返回值
+ 异步返回TTLockError

###### 版本更新内容
+ **2.7.0**  
	 1. 增加异步调用返回值
	 2. callBack及failCallback将在之后版本不再使用 

+ **2.6.0**  
	 1. 2.6.0版本新增 



#### 5. 方法 停止设备的智能锁及网关操作并断开蓝牙连接 (2.6.0) 

`function stopAllOperations(deviceId?: string):Promise<TTLockError>`

###### 参数
+ deviceId	-扫描到的蓝牙设备ID

###### 返回值
+ 异步返回TTLockError

###### 特殊说明
+ **添加网关时支持连续调用而不设置操作延迟**
+ 调用后断开蓝牙适配器

###### 版本更新内容
+ **2.7.0**  
	 1. 增加智能锁设备支持
	 2. 增加异步调用返回模式
	 3. 修复部分错误码以抛出异常的方式返回的问题 

+ **2.6.0**  
	 1. 2.6.0版本新增 



### 智能锁相关接口  

#### 1. 方法 获取智能锁版本号 (2.2.0) 

`function getLockVersion(device: string | TTLockSmartLock, callBack?: Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ device    -支持传入以下参数：1. 目标锁的mac地址, 格式"AA:AA:AA:BB:BB:BB", 2. 扫描到的智能锁设备, 3. 智能锁数据lockData
+ callBack  -操作回调, 返回参数形式：`callback(res: TTLockError)` 
+ deviceId  -**2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)
	 + TTLockError返回参数增加：
```
    {
        lockVersion?: TTLockVersion // 智能锁版本信息(操作成功后返回)
    }
``` 

###### 说明
若传入参数为扫描到的智能锁设备，将修改传入参数中的lockVersion参数

###### 版本更新内容 
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 
	 4. 增加device传入设备、lockData的方式

+ **2.2.0**  
	1. 2.2.0版本新增


#### 2. 方法 初始化锁

`function initLock(deviceFromScan: TTLockSmartLock, callBack?: Function, vendor?: string | null, deviceId?: string):Promise<TTLockError>` 

###### 参数
+ deviceFromScan	-扫描到的蓝牙设备
+ callBack			-蓝牙初始化接口回调, 返回参数形式：`callback(res: TTLockError)` 
+ verdor 			-**2.1.0版本新增**, 为定制智能锁板约定字符串, **常规智能锁不传入该值** 
+ deviceId			-**2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 说明
+ 该接口不写入酒店信息，需初始化酒店锁请在初始化完成后调用“设置酒店信息”及“设置酒店锁扇区”接口

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)
	 + TTLockError返回参数增加：
```
    {
        lockData?：string, // 智能锁初始化数据(操作成功后返回)
    }
``` 

###### 版本更新内容 
+ **2.7.2**  
	 1. 删除定制智能锁板判断，由硬件控制

+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值

+ **2.4.1**  
  	 1. 修复部分手机设备扫描不到智能锁时无法正常退出操作的问题 

+ **2.1.1**  
	 1. 修改调试文本输出
	 2. 增加部分错误码

+ **2.1.0**  
  	 1. 增加vendor参数，用于定制版智能锁添加
	 2. 修改调试文本输出
	 3. 增加部分错误码

+ **2.0.2**  
  	 1. 优化蓝牙操作效率
	 2. 修改调试文本输出
	 3. 增加部分错误码

+ **2.0.0**  
  	 1. 名称沿用1.4.1版本
  	 2. 修改参数名称bleDevice为device
  	 3. 返回值lockData修改为加密字符串


#### 3. 方法 重置锁

`function resetLock(lockData: string, callBack?: Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ lockData		- **管理员**钥匙数据字符串
+ callBack		- 锁重置结果回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId		-**2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)

###### 版本更新内容  
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 

+ **2.4.1**  
  	 1. 修复部分手机设备扫描不到智能锁时无法正常退出操作的问题 

+ **2.1.1**  
	 1. 修改调试文本输出
	 2. 增加部分错误码

+ **2.1.0**  
  	 1. 增加vendor参数，用于定制版智能锁添加
	 2. 修改调试文本输出
	 3. 增加部分错误码

+ **2.0.2**  
  	 1. 优化蓝牙操作效率
	 2. 修改调试文本输出
	 3. 增加部分错误码

+ **2.0.0**
	 1. 钥匙数据改为传入加密字符串lockData


#### 4. 方法 蓝牙开锁/闭锁接口

`function controlLock(controlAction: ControlAction, lockData: string, callBack?: Function, floorList?:Array<number> | null, deviceId?: string):Promise<TTLockError>`

###### 参数
+ controlAction		- 操作类型, 请参考ControlAction参数
+ lockData			- 钥匙数据字符串
+ callBack			- 钥匙开锁/闭锁后的回调, 返回参数形式：`callback(res: TTLockError)`
+ floorList			- 仅在梯控开锁时传入需要点亮的楼层编号列表,**有且至少传入一个楼层编号**，如[1,2,3]，单个楼层编号为[1, 127]**闭区间**的正整数，**非梯控开锁时，该参数不填**
+ deviceId			-**2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)
	 + TTLockError返回参数增加：(操作成功后返回)
```
    {
        lockTime: number, // 锁中当前时间的时间戳
        controlAction: ControlAction, // 操作类型, 请参考ControlAction参数
        uniqueid: number, // 唯一标识

        battery: number, // 锁电量（deprecated 已过期, 后续将不再返回, 请使用electricQuantity）
    }
``` 

###### 版本更新内容  
+ **2.8.0**  
	 1. 简化校准时间流程，以网络时间为准

+ **2.7.9**  
	1. 锁时间不正确则进行一次锁时间校准

+ **2.7.8**  
	1. 管理员钥匙可开反锁

+ **2.7.1**  
	 1. 删除设置锁时间有效期验证，允许初始化参数开锁

+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 
	 4. 增加开锁成功后自动校准本地时间为锁时间
	 5. 增加electricQuantity返回值

+ **2.4.1**  
  1. 修复部分手机设备扫描不到智能锁时无法正常退出操作的问题 

+ **2.1.1**  
	1. 修改调试文本输出
	2. 增加部分错误码

+ **2.1.0**  
  1. 增加梯控传参floorList
  2. 增加用户参数判定

+ **2.0.2**  
  1. 优化蓝牙交互效率，降低交互时间
  2. 修改调试日志输出文本
  3. 修改断开连接时机

+ **2.0.0**  
	 1. 2.0.0版本新增，开锁功能继承1.x中UnlockBleLock接口
	 2. 钥匙数据为传入加密字符串lockData, 去掉锁时间参数
	 3. 增加controlAction参数控制开闭锁
	 4. 增加返回值controlAction、uniqueid, 修改返回值lockDate为lockTime, 修改返回值electricQuantity为battery
	 5. 为兼容离线版，开锁接口不再包含校准锁时间功能，需校准锁时间请调用setLockTime接口


#### 5. 方法 设置锁时间

`function setLockTime(serverTime: number, lockData: string, callBack?: Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ serverTime		- 待设置的时间戳，建议传入服务器时间，2.8.0开始，非管理员使用网络时间
+ lockData			- 钥匙数据字符串，该操作不需要管理员钥匙数据
+ callBack			- 钥匙开门后的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId			-**2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)

###### 版本更新内容  
+ **2.8.0**  
	 1. 禁止非管理员校准本地时间功能

+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 

+ **2.4.1**  
  	 1. 修复部分手机设备扫描不到智能锁时无法正常退出操作的问题 

+ **2.1.1**  
	 1. 修改调试文本输出
	 2. 增加部分错误码

+ **2.1.0**  
  	 1. 增加用户参数判定

+ **2.0.2**  
	 1. 优化蓝牙交互效率，降低交互时间
	 2. 修改调试日志输出文本
	 3. 修改断开连接时机

+ **2.0.0**  
	 1. 2.0.0版本新增，开锁功能继承1.x中CorrectBleLockTime接口
	 2. 钥匙数据为传入加密字符串lockData
	 2. 接口名称改为setLockTime
	 3. 删除返回值electricQuantity


#### 6. 方法 读取锁内操作记录

`function getOperationLog(logType: RecordReadType, lockData: string, callBack?: Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ logType		- 记录类型, 请参考RecordReadType参数
+ lockData		- 钥匙数据字符串
+ callBack		- 读取操作记录的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId		-**2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)
	 + TTLockError返回参数增加：(操作成功后返回)
```
    {
        log?: string // 锁内操作记录的json字符串，用于上传服务器
    }
``` 

###### 版本更新内容 
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值  

+ **2.4.1**  
  	 1. 修复部分手机设备扫描不到智能锁时无法正常退出操作的问题 

+ **2.1.1**  
	 1. 修改调试文本输出
	 2. 增加部分错误码

+ **2.1.0**  
  	 1. 增加用户参数判定

+ **2.0.2**  
  	 1. 优化蓝牙交互效率，降低交互时间
  	 2. 修改调试日志输出文本
  	 3. 修改断开连接时机

+ **2.0.0**  
	 1. 2.0.0版本新增


#### 7. 方法 添加自定义密码

`function createCustomPasscode(passcode: string, startDate:number, endDate:number, lockData: string, callBack?:Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ passcode: 添加的密码字符串，由0-9组成的4-9位长度数字字符串，如"0123456"
+ startDate: 密码有效期开始时间，整点的时间戳
+ endDate: 密码有效期结束时间，整点时间戳
+ lockData: **管理员**字符串
+ callBack: 添加密码的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)

###### 版本更新内容  
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 

+ **2.4.1**  
  	 1. 修复部分手机设备扫描不到智能锁时无法正常退出操作的问题 

+ **2.1.1**  
	 1. 修改调试文本输出
	 2. 增加部分错误码

+ **2.1.0**  
  	 1. 增加用户参数判定

+ **2.0.2**  
	 1. 优化蓝牙交互效率，降低交互时间
	 2. 修改调试日志输出文本
	 3. 修改断开连接时机

+ **2.0.0**  
	 1. 2.0.0版本新增


#### 8. 方法 修改密码

`function modifyPasscode(originalPasscode: string, passcode: string, startDate:number, endDate:number, lockData: string, callBack?:Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ originalPasscode: 待修改的原始密码字符串, 由0-9组成的4-9位长度数字字符串，如"0123456"
+ passcode: 修改后的密码字符串，由0-9组成的4-9位长度数字字符串，如"0123456"
+ startDate: 新密码有效期开始时间，整点的时间戳
+ endDate: 新密码有效期结束时间，整点时间戳
+ lockData: **管理员**锁数据字符串
+ callBack：修改密码的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)

###### 版本更新内容  
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 

+ **2.4.1**  
  	 1. 修复部分手机设备扫描不到智能锁时无法正常退出操作的问题 

+ **2.1.1**  
	 1. 修改调试文本输出
	 2. 增加部分错误码

+ **2.1.0**  
  	 1. 增加用户参数判定

+ **2.0.2**  
  	 1. 优化蓝牙交互效率，降低交互时间
  	 2. 修改调试日志输出文本
 	 3. 修改断开连接时机

+ **2.0.0**  
	 1. 2.0.0版本新增


#### 9. 方法 删除密码

`function deletePasscode(passcode: string, lockData: string, callBack?:Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ passcode: 待删除的密码字符串，由0-9组成的4-9位长度数字字符串，如"0123456"
+ lockData: **管理员**锁数据字符串
+ callBack: 删除密码的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)

###### 版本更新内容  
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 

+ **2.4.1**  
  	 1. 修复部分手机设备扫描不到智能锁时无法正常退出操作的问题 

+ **2.1.1**  
	 1. 修改调试文本输出
	 2. 增加部分错误码

+ **2.1.0**  
  	 1. 增加用户参数判定

+ **2.0.2**  
  	 1. 优化蓝牙交互效率，降低交互时间
  	 2. 修改调试日志输出文本
  	 3. 修改断开连接时机

+ **2.0.0**
	 1. 2.0.0版本新增



#### 10. 方法 添加IC卡

`function addICCard(startDate:number, endDate:number, lockData: string, callBack?:Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ startDate: IC卡有效期开始时间，精确到分钟的时间戳
+ endDate: IC卡有效期结束时间，精确到分钟的时间戳
+ lockData: **管理员**锁数据字符串
+ callBack: 添加IC卡的回调, 返回参数形式：`callback(res: TTLockError)`
	+ 之后版本将改为设备断连回调及中间步骤回调，**请尽快调整为Promise模式** , 中间步骤回调参数(TTLockError增加回调参数)
```
    {
        type?: number, // 回调类型, 当type为1时表示回调: 1 -IC卡完成添加，操作结束; 2 -已进入添加模式; 3 -IC卡数据已添加，正在修改有效期
        cardNum?: number, // 添加成功的IC卡号，仅type=1时返回
    }
``` 
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)
	 + TTLockError返回参数增加：(操作成功后返回)
```
    {
        cardNum: number, // 添加成功的IC卡号
    }
``` 

###### 版本更新内容 
+ **2.7.6**  
	 1. 增加type=3, IC卡已添加正在修改有效期步骤

+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作**及中间步骤**，**请尽快调整为Promise模式**
	 3. 增加deviceId参数及返回值 

+ **2.4.1**  
  	 1. 修复部分手机设备扫描不到智能锁时无法正常退出操作的问题 

+ **2.1.1**  
	 1. 修改调试文本输出
	 2. 增加部分错误码

+ **2.1.0**  
  	 1. 增加用户参数判定

+ **2.0.2**  
  	 1. 优化蓝牙交互效率，降低交互时间
  	 2. 修改调试日志输出文本
  	 3. 修改断开连接时机

+ **2.0.0**
	 1. 2.0.0版本新增


#### 11. 方法 修改IC卡有效期

`function modifyICCardValidityPeriod(startDate:number, endDate:number, cardNum:number, lockData: string, callBack?: Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ startDate: 新IC卡有效期开始时间，精确到分钟的时间戳
+ endDate: 新IC卡有效期结束时间，精确到分钟的时间戳
+ cardNum: 待修改的IC卡卡号, 如123456
+ lockData: **管理员**锁数据字符串
+ callBack: 修改IC卡有效期的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)

###### 版本更新内容  
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 

+ **2.4.1**  
  	 1. 修复部分手机设备扫描不到智能锁时无法正常退出操作的问题 

+ **2.1.1**  
	 1. 修改调试文本输出
	 2. 增加部分错误码

+ **2.1.0**  
  	 1. 增加用户参数判定

+ **2.0.2**  
  	 1. 优化蓝牙交互效率，降低交互时间
  	 2. 修改调试日志输出文本
  	 3. 修改断开连接时机

+ **2.0.0**
	 1. 2.0.0版本新增


#### 12. 方法 删除IC卡

`function deleteICCard(cardNum:number, lockData: string, callBack?:Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ cardNum: 待删除的IC卡卡号, 如123456
+ lockData: **管理员**锁数据字符串
+ callBack: 删除IC卡的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)

###### 版本更新内容  
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 

+ **2.4.1**  
  1. 修复部分手机设备扫描不到智能锁时无法正常退出操作的问题 

+ **2.1.1**  
	1. 修改调试文本输出
	2. 增加部分错误码

+ **2.1.0**  
  1. 增加用户参数判定

+ **2.0.2**  
  1. 优化蓝牙交互效率，降低交互时间
  2. 修改调试日志输出文本
  3. 修改断开连接时机

+ **2.0.0**
	 1. 2.0.0版本新增



#### 13. 方法 恢复IC卡 (2.6.3) 

`function recoverICCardNumber(cardNum:number, startDate:number, endDate:number, lockData: string, callBack?:Function, deviceId?: string)`

###### 参数
+ cardNum: 待恢复的IC卡卡号, 如123456
+ startDate: 新IC卡有效期开始时间，精确到分钟的时间戳
+ endDate: 新IC卡有效期结束时间，精确到分钟的时间戳
+ lockData: **管理员**锁数据字符串
+ callBack: 恢复IC卡有效期的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)

###### 版本更新内容  
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 

+ **2.6.3**
	 1. 2.6.3版本新增


#### 14. 方法 添加指纹

`function addFingerprint(startDate:number, endDate:number, lockData: string, callBack?: Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ startDate: 指纹有效期开始时间，时间戳，精确到分钟
+ endDate: 指纹有效期结束时间，时间戳，精确到分钟
+ lockData: **管理员**锁数据字符串
+ callBack：添加指纹结果及中间步骤的回调, 返回参数形式：`callback(res: TTLockError)`
	+ 之后版本将改为设备断连回调及中间步骤回调，**请尽快调整为Promise模式** , 中间步骤回调参数(TTLockError增加回调参数)
```
    {
        // 中间步骤回调时返回
        type?: number, // 回调类型, 1 -指纹完成添加，操作结束; 2 -已进入添加模式; 3 -录入指纹步骤回调; 4 -指纹已录入，正在修改有效期;
        fingerprintNum?: number, // 添加成功的指纹号，仅type=1时返回
        totalCount?: number, // 录入指纹的总次数
        currentCount?: number, // 当前录入指纹已完成的次数
	}
``` 
+ deviceId			-**2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)
	 + TTLockError返回参数增加：(操作成功后返回)
```
    {
        type: number, // 回调类型
        fingerprintNum: number, // 添加成功的指纹号
    }
``` 

###### 版本更新内容 
+ **2.7.6**  
	 1. 增加type=4, 指纹已添加正在修改有效期步骤

+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作**及中间步骤**，**请尽快调整为Promise模式**
	 3. 增加deviceId参数及返回值 

+ **2.4.1**  
	 1. 修复部分手机设备扫描不到智能锁时无法正常退出操作的问题 

+ **2.1.1**  
	 1. 修改调试文本输出
	 2. 增加部分错误码

+ **2.1.0**  
	 1. 增加用户参数判定

+ **2.0.2**  
	 1. 优化蓝牙交互效率，降低交互时间
	 2. 修改调试日志输出文本
	 3. 修改断开连接时机

+ **2.0.0**
	 1. 2.0.0版本新增



#### 15. 方法 修改指纹有效期

`function modifyFingerprintValidityPeriod(startDate:number, endDate:number, fingerprintNum:number, lockData: string, callBack?:Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ startDate: 指纹有效期开始时间，时间戳，精确到分钟
+ endDate: 指纹有效期结束时间，时间戳，精确到分钟
+ fingerprintNum: 待修改的指纹号
+ lockData: **管理员**锁数据字符串
+ callBack: 修改指纹的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)

###### 版本更新内容
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 

+ **2.4.1**  
	 1. 修复部分手机设备扫描不到智能锁时无法正常退出操作的问题 

+ **2.1.1**  
	 1. 修改调试文本输出
	 2. 增加部分错误码

+ **2.1.0**  
	 1. 增加用户参数判定

+ **2.0.2**  
	 1. 优化蓝牙交互效率，降低交互时间
	 2. 修改调试日志输出文本
	 3. 修改断开连接时机

+ **2.0.0**
	 1. 2.0.0版本新增


#### 16. 方法 删除指纹

`function deleteFingerprint(fingerprintNum:number, lockData: string, callBack?:Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ fingerprintNum: 待删除的指纹号
+ lockData: **管理员**锁数据字符串
+ callBack: 修改指纹的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)

###### 版本更新内容
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 

+ **2.4.1**  
	 1. 修复部分手机设备扫描不到智能锁时无法正常退出操作的问题 

+ **2.1.1**  
	 1. 修改调试文本输出
	 2. 增加部分错误码

+ **2.1.0**  
	 1. 增加用户参数判定

+ **2.0.2**  
	 1. 优化蓝牙交互效率，降低交互时间
	 2. 修改调试日志输出文本
	 3. 修改断开连接时机

+ **2.0.0**
	 1. 2.0.0版本新增


#### 17. 方法 设置远程开锁开关配置状态 (2.3.0) 

`function setRemoteUnlockSwitchState(enable:boolean, lockData: string, callBack?: Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ enable: boolean  -是否开启远程开锁开关
+ lockData: string	-**管理员**锁数据
+ callBack: 设置远程开锁开关配置状态的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)
	 + TTLockError返回参数增加：(操作成功后返回)
```
    {
        lockData: string, // 状态修改成功后返回的锁数据，用于锁数据更新**不能直接用于智能锁操作**
        specialValue: number, // 修改后锁特征值
        featureValue: string, // 修改后的锁扩展特征值（2.3.1版本新增）
    }
``` 

###### 版本更新内容 
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 
	 4. 修复返回的lockData可直接用于智能锁操作的问题

+ **2.3.1**  
	 1. 修复部分情况下返回的lockData和specialValue不正确的问题
	 2. 增加扩展特征值featureValue参数 

+ **2.3.0**  
	 1. 2.3.0版本新增


#### 18. 方法 获取远程开锁开关配置状态 (2.3.0) 

`getRemoteUnlockSwitchState(lockData: string, callBack?:Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ lockData: string	-**管理员**锁数据
+ callBack: 获取远程开锁开关配置状态的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)
	 + TTLockError返回参数增加：(操作成功后返回)
```
    {
        enabled: boolean, // 是否已开启远程开锁
        lockData: string, // 状态修改成功后返回的锁数据，用于锁数据更新**不能直接用于智能锁操作**
        specialValue: number, // 修改后锁特征值
        featureValue: string, // 修改后的锁扩展特征值（2.3.1版本新增）
    }
``` 

###### 版本更新内容 
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 

+ **2.3.1**  
	 1. 修复部分情况下返回的lockData和specialValue不正确的问题
	 2. 增加扩展特征值featureValue参数 
	
+ **2.3.0**  
	 1. 2.3.0版本新增


#### 19. 方法 设置酒店信息 (2.4.0) 

`function setHotelData(hotelData: TTLockHotelData, lockData: string, callBack?: Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ hotelData: TTLockHotelData		-待设置的酒店信息
	 + TTLockHotelData说明：
``` 
    {
        hotelInfo: string, // 通过开放平台接口或相关jar包获取的酒店信息串, 必传
        buildingNumber: number, // 楼栋号，[1, 254]的正整数，必传
        floorNumber: number, // 楼层号，[1, 255]的正整数，普通酒店锁传入
    }
``` 
+ lockData: **管理员**锁数据
+ callBack: 设置酒店信息的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 特殊说明
+ **该接口仅用于酒店方案智能锁配置，在锁初始化完成后调用**

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)

###### 版本更新内容  
+ **2.7.6**  
	 1. 楼层号控制位1-255的正整数，禁止传入0

+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 
	 4. 修改文档错误，修复buildingNumber能传入0的问题

+ **2.4.0**  
	 1. 2.4.0版本新增


#### 20. 方法 设置酒店锁扇区 (2.4.0) 

`function setHotelSector(sectors: Array<number>, lockData: string, callBack?:Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ sectors: 待配置锁扇区, 传入1-16组成的数组，如[1, 3, 6]代表1、3、6号扇区可用，**该数组不能为空**
+ lockData: -**管理员**锁数据
+ callBack: 设置酒店扇区的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 特殊说明
+ **该接口仅用于酒店方案智能锁配置，在锁初始化完成后调用**
+ **酒店扇区配置后，如卡片写入正常数据缺无法开锁，请将锁断电后重新通电后重新开锁**

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)

###### 版本更新内容  
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 

+ **2.4.0**  
	 1. 2.4.0版本新增 


#### 21. 方法 设置梯控工作模式 (2.7.0) 

`function setLiftWorkMode(workMode: LiftWorkMode, lockData: string, disconnectCallback?: Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ sectors: 待配置锁扇区, 传入1-16组成的数组，如[1, 3, 6]代表1、3、6号扇区可用，**该数组不能为空**
+ lockData: **管理员**锁数据
+ disconnectCallback: 设备断连回调, 返回参数形式：`disconnectCallback(res: TTLockError)`
+ deviceId: 用于iOS设备优化，非必传，安卓设备不传

###### 特殊说明
+ **该接口仅用于酒店方案梯控锁配置，在锁初始化完成后调用**

###### 返回值
+ 异步返回TTLockError

###### 版本更新内容  
+ **2.7.0**  
	 1. 2.7.0版本新增 


#### 22. 方法 设置梯控关联楼层 (2.7.0) 

`function setLiftControlableFloors(floors: Array<number>, lockData: string, disconnectCallback?:Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ floors: 继电器与梯控的映射, 传入1-64组成的数组，最长64位, **该数组不能为空**
+ lockData: **管理员**锁数据
+ disconnectCallback: 设备断连回调, 返回参数形式：`disconnectCallback(res: TTLockError)`
+ deviceId: 用于iOS设备优化，非必传，安卓设备不传

###### 特殊说明
+ **该接口仅用于酒店方案梯控锁配置，在锁初始化完成后调用**

###### 返回值
+ 异步返回TTLockError

###### 版本更新内容  
+ **2.7.0**  
	 1. 2.7.0版本新增


#### 23. 方法 设置锁开关配置信息 (2.5.0) 

`function setLockConfig(configType: number, switchOn: boolean, lockData: string, callBack?:Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ configType: 需要获取的开关配置类型，支持类型见本文档“重要参数-2. 锁开关配置属性类型-LockConfigType”，
+ switchOn: 是否设置开关为开启状态，true为使能，false为禁用（左右开门设置时传入true为左开门，false为右开门）
+ lockData: **管理员**锁数据
+ callBack: 设置锁开关配置信息的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传

###### 特殊说明
+ lockConfigType及lockConfigs均不返回智能锁不支持的属性
+ 支持同时设置多个属性时，如需同时重置按键属性和防撬开关配置属性时，TTLockConfigType传入`LockConfigType.RESET_BUTTON | LockConfigType.TAMPER_ALERT`

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)
	 + TTLockError返回参数增加：(操作成功后返回)
```
    {
        lockConfigType: number, // 开关配置属性实际开启状态
        lockConfigs：TTLockSwitchConfig, // 开关使能状态（未查询或锁不支持的属性均不返回）
    }
``` 
	 + TTLockSwitchConfig为开关使能状态（未查询或锁不支持的属性均不返回），参数说明：
```
    {
        tamperAlert?: boolean, // 是否打开防撬警报
        resetButton?: boolean, // 使能/禁用重置按键
        privacyLock?: boolean, // 使能/禁用反锁开关
        unlockDirection?: boolean, // 左右开门设置（true为左开门，false为右开门)
        pasageModeAutoUnlockSetting?: boolean, // 使能/禁用常开模式自动开锁
    }
``` 

###### 版本更新内容  
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值 

+ **2.5.0**  
	 1. 2.5.0版本新增


#### 24. 方法 获取锁开关配置 (2.5.0) 

`function getLockConfig(configType: number, lockData: string, callBack?: Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ configType: 需要获取的开关配置类型，支持类型见本文档“重要参数-2. 锁开关配置属性类型-LockConfigType”
+ lockData: **管理员**锁数据
+ callBack: 设置锁开关配置信息的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传 

###### 特殊说明
+ lockConfigType及lockConfigs均不返回智能锁不支持的属性
+ 支持同时获取多个属性时，如需同时获取重置按键属性和防撬开关配置属性时，TTLockConfigType传入`LockConfigType.RESET_BUTTON | LockConfigType.TAMPER_ALERT`

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)
	 + TTLockError返回参数增加：(操作成功后返回)
```
    {
        lockConfigType: number,		// 开关配置属性实际开启状态
        lockConfigs：TTLockSwitchConfig			-开关使能状态（未查询或锁不支持的属性均不返回）
    }
``` 
	 + TTLockSwitchConfig为开关使能状态（未查询或锁不支持的属性均不返回），参数说明：
```
    {
        tamperAlert?: boolean, // 是否打开防撬警报
        resetButton?: boolean, // 使能/禁用重置按键
        privacyLock?: boolean, // 使能/禁用反锁开关
        unlockDirection?: boolean, // 左右开门设置（true为左开门，false为右开门)
        pasageModeAutoUnlockSetting?: boolean, // 使能/禁用常开模式自动开锁
    }
``` 

###### 版本更新内容  
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值  

+ **2.5.0**  
	 1. 2.5.0版本新增


#### 25. 方法 获取管理员密码 (2.6.0) 

`function getAdminPasscode(lockData: string, callBack?:Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ lockData: **管理员**锁数据
+ callBack: 设置锁开关配置信息的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传 

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)
	 + TTLockError返回参数增加：(操作成功后返回)
```
    {
        passcode: string, // 管理员密码字符串，由0-9组成的4-9位长度数字字符串，如"0123456"
        lockData：string, // 带管理员密码的字符串，用于数据更新, **该参数不能直接用于智能锁操作**
    }
``` 

###### 版本更新内容  
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值  
	 4. 修复返回的lockData可直接用于蓝牙操作的问题

+ **2.6.0**  
	1. 2.6.0版本新增


#### 26. 方法 修改管理员密码 (2.6.0) 

`function modifyAdminPasscode(newPasscode: string, lockData: string, callBack?:Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ newPasscode: 4-9位新密码字符串，由0-9组成，如"0123456"
+ lockData: **管理员**锁数据
+ callBack: 设置锁开关配置信息的回调, 返回参数形式：`callback(res: TTLockError)`
+ deviceId: **2.7.0版本新增**，用于iOS设备优化，非必传，安卓设备不传 

###### 返回值
+ 异步返回TTLockError (2.7.0版本新增)
	 + TTLockError返回参数增加：(操作成功后返回)
```
    {
        lockData：string, // 带管理员密码的字符串，用于数据更新, **该参数不能直接用于智能锁操作**
    }
``` 

###### 版本更新内容  
+ **2.7.0**  
	 1. 增加异步回调方式
	 2. callBack在未来版本中将仅返回断开连接操作，**请尽快调整为Promise模式** 
	 3. 增加deviceId参数及返回值  
	 4. 修复返回的lockData可直接用于蓝牙操作的问题 

+ **2.6.0**  
	1. 2.6.0版本新增


#### 27. 方法 获取智能锁锁开关状态(2.7.3) 

`function getLockStatus(lockData: string, disconnectCallback?: Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ lockData: 锁数据
+ disconnectCallback: 设备断连回调, 返回参数形式：`disconnectCallback(res: TTLockError)`
+ deviceId: 用于iOS设备优化，非必传，安卓设备不传 

###### 返回值
+ 异步返回TTLockError
	 + TTLockError：
```
    {
        lockStatus：LockStatus, // 智能锁状态，请参考“重要参数-6. 智能锁开关状态-LockStatus”
    }
``` 

###### 版本更新内容  
+ **2.7.3**  
	 1. 新增接口 


#### 28. 方法 WIFI锁扫描附近可用的WIFI列表(2.7.6) 

`function scanWifi(lockData: string, disconnectCallback?: Function, deviceId?: string): Promise<TTLockError>`

###### 参数
+ lockData: 锁数据
+ disconnectCallback: 设备断连回调, 返回参数形式：`disconnectCallback(res: TTLockError)`
+ deviceId: 用于iOS设备优化，非必传，安卓设备不传 

###### 返回值
+ 异步返回TTLockError
	 + TTLockError：
```
    {
        data?: {
            wifiList: Array<TTLockWIFI> // wifi锁附近的wifi列表
        }
    }
``` 

###### 版本更新内容  
+ **2.7.6**  
	 1. 新增接口 


#### 29. 方法 配置WIFI锁连接的WIFI(2.7.6) 

`function configWifi(wifiConfig: TTLockWIFIInfo, lockData: string, disconnectCallback?: Function, deviceId?: string): Promise<TTLockError>`

###### 参数
+ wifiConfig: WIFI配置参数
	 + TTLockWIFIInfo说明：
```
    {
        SSID: string, // SSID
        password: string, // WIFI密码
    }
```
+ lockData: 锁数据
+ disconnectCallback: 设备断连回调, 返回参数形式：`disconnectCallback(res: TTLockError)`
+ deviceId: 用于iOS设备优化，非必传，安卓设备不传 

###### 返回值
+ 异步返回TTLockError

###### 版本更新内容  
+ **2.7.6**  
	 1. 新增接口 


#### 30. 方法 配置WIFI锁连接的服务器(2.7.6) 

`function configServer(serverConfig: TTLockServerIPAddress, lockData: string, disconnectCallback?: Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ serverConfig: WIFI锁服务器配置参数
	 + TTLockServerIPAddress说明：
```
    {
        server?: string; // 服务器地址(地址与IP地址二选一, 首选)
        ipAddress?: string; // 服务器IP地址(地址与IP地址二选一)
        port: number; // 服务器端口地址
    }
```
+ lockData: 锁数据
+ disconnectCallback: 设备断连回调, 返回参数形式：`disconnectCallback(res: TTLockError)`
+ deviceId: 用于iOS设备优化，非必传，安卓设备不传 

###### 返回值
+ 异步返回TTLockError

###### 版本更新内容  
+ **2.7.6**  
	 1. 新增接口 


#### 31. 方法 配置WIFI锁静态IP地址(2.7.6) 

`function configIp(ipSetting: TTLockLocaleIPAddress, lockData: string, disconnectCallback?: Function, deviceId?: string):Promise<TTLockError>`

###### 参数
+ ipSetting: WIFI本地IP配置参数
	 + TTLockLocaleIPAddress说明：
```
    {
        useDHCP: boolean; // 是否使用DHCP获取地址
        ipAddress?: TTLockStaticIPAddress; // 固定IP地址
    }
```
	 + TTLockStaticIPAddress说明：
```
    {
        ipAddress: string; // 固定IP地址
        subnetMask: string; // 子网掩码
        router: string; // 默认网关
        dns1: string; // 首选DNS
        dns2: string; // 备用DNS
    }
```
+ lockData: 锁数据
+ disconnectCallback: 设备断连回调, 返回参数形式：`disconnectCallback(res: TTLockError)`
+ deviceId: 用于iOS设备优化，非必传，安卓设备不传 

###### 返回值
+ 异步返回TTLockError

###### 版本更新内容  
+ **2.7.6**  
	 1. 新增接口 


### 网关相关接口 

#### 1. 方法 连接网关设备接口 (2.6.0) 

`function connectGateway(deviceFromScan: TTLockGateway, disconnectCallback?: Function):Promise<TTLockError>`

###### 参数
+ deviceFromScan	-扫描到的蓝牙设备，请参考开启蓝牙网关扫描接口
+ disconnectCallback	-设备断开连接监控接口回调, 当设备断开连接时触发，返回参数形式：`disconnectCallback(res: TTLockError)`

###### 返回值
+ 异步返回TTLockError

###### 特殊说明
+ **添加网关时支持连续调用而不设置操作延迟**  

###### 版本更新内容 
+ **2.7.0**  
	 1. 修复部分错误码以抛出异常的方式返回的问题  
	 2. 修改部分文档描述错误问题

+ **2.6.0**  
	 1. 2.6.0版本新增 

#### 2. 方法 搜索网关设备附近可连接的wifi列表 (2.6.0) 

`function scanWiFiByGateway(deviceFromScan: TTLockGateway, disconnectCallback?: Function):Promise<TTLockError>`

###### 参数
+ deviceFromScan	-扫描到的蓝牙设备，请参考开启蓝牙网关扫描接口
+ disconnectCallback	-设备断开连接监控接口回调, 当设备断开连接时触发，返回参数形式：`disconnectCallback(res: TTLockError)` 

###### 返回值 
+ 异步返回TTLockError
	 + TTLockError返回参数增加：
```
    {
        data?: {
            wifiList: Array<TTLockWIFI> // 网关附近的wifi列表
        }
    }
```

###### 特殊说明
+ **添加网关时支持连续调用而不设置操作延迟**

###### 版本更新内容 
+ **2.7.0**  
	 1. 修复部分错误码以抛出异常的方式返回的问题  
	 2. 修改部分文档描述错误问题

+ **2.6.2**  
	 1. 兼容部分异常设备 

+ **2.6.0**  
	 1. 2.6.0版本新增 


#### 3. 方法 初始化网关 (2.6.0) 

`function initGateway(deviceFromScan: TTLockGateway, configuration: TTLockGatewayConfiguration, disconnectCallback?: Function):Promise<TTLockError>`

###### 参数
+ deviceFromScan	-扫描到的蓝牙设备，请参考开启蓝牙网关扫描接口
+ configuration		-网关配置参数
	 + TTLockGatewayConfiguration说明：
```
	{
		 type: PlugType, // 网关类型
		 SSID: string, // wifi名称, 如"HELLOWORLD", G3、G4网关传入空字符串, G2网关必传
		 wifiPwd: string, // wifi密码, 如"12345678", G3、G4网关传入空字符串, G2网关必传
		 uid: number; // 通通锁登录账号uid
		 password: string, // MD5加密的通通锁账号密码，32位
		 companyId: number, // 公司ID, 没有则填0
		 branchId: number, // 分组ID, 没有则填0
		 plugName: string, // 网关名称（最长50个字符）
         // 网关服务器参数配置, [serverIPAddress, server]至少填写一项，2.7.0开始优先使用server
         server?: string, // 网关服务器域名，如"plug.sciener.cn"
		 serverIPAddress?: string, // 网关服务器IP地址，如"109.119.109.119"(仅举例，非实际参数)
		 port: number, // 网关服务器端口号，如2999
         // 本地IP地址配置（部分网关不支持本地IP地址配置）
		 useLocalIPAddress: boolean, // 是否需要配置本地IP地址
		 useDHCP?: boolean, // 是否使用DHCP服务, useLocalIPAddress为true时必填
		 // 以下参数useLocalIPAddress = true且useDHCP = false时必填
		 ipAddress?: string, // 固定IP地址，如"109.119.109.119"(仅举例，非实际参数)
		 subnetMask?: string, // 子网掩码，如"109.119.109.119"(仅举例，非实际参数)
		 router?: string, // 默认网关，如"109.119.109.119"(仅举例，非实际参数)
		 dns1?: string, // 首选DNS，如"109.119.109.119"(仅举例，非实际参数)
		 dns2?: string, // 备用DNS，如"109.119.109.119"(仅举例，非实际参数)
	}
```
+ disconnectCallback	-设备断开连接监控接口回调, 当设备断开连接时触发，返回参数形式：`callback(res: TTLockError)` 

###### 返回值  
+ 异步返回TTLockError
	 + TTLockError返回参数增加：
```
    {
        data?: {
            firmware: string, // 固件版本号, 如"6.0.0.211124"
            hardware: string, // 硬件版本号, 如"1.6"
            modelNum: string, // 模块版本号, 如 "SN307"
        }
    }
```   

###### 特殊说明
+ **添加网关时支持连续调用而不设置操作延迟**

###### 版本更新内容  
+ **2.7.6**  
	 1. 修改参数要求，服务器地址必须填写
     2. 修改useLocalIPAddress参数描述

+ **2.7.4**  
	 1. 增加G3、G4网关支持

+ **2.7.0**  
	 1. 修复部分错误码以抛出异常的方式返回的问题  
	 2. 修改部分文档描述错误问题 

+ **2.6.0**  
	 1. 2.6.0版本新增  



## 返回errorCode说明
**括号内为中文描述及相关处理方案，实际操作中不会返回**

+ -3              -设备响应超时，通信失败(**2.6.0新增**)
+ -2              -操作未结束，等待下一次操作(**2.6.0新增**)
+ -1              -最后一次回调，断连不再进行设备回调(**2.6.0新增**)
+ 0               -OK (操作成功)
+ 1               -设备通信错误，操作失败，请重试(CRC error)
+ 2               -非管理员权限，无法操作(Not administrator, has no permission.)
+ 3               -管理员校验未通过(Wrong administrator password.)
+ 5               -智能锁处于设置状态(lock is in setting mode.)
+ 6               -设备未初始化(lock has no administrator.)
+ 7               -智能锁不在可初始化状态，请先摸亮锁或重置智能锁(Non-setting mode.)
+ 8               -动态码错误(invalid dynamic code.)
+ 10              -电池电量低(run out of battery)
+ 11              -初始化（重置）键盘密码失败(initialize keyboard password falied.)
+ 13              -电子钥匙失效，权重过低(invalid ekey, lock flag position is low.)
+ 14              -电子钥匙已过期(ekey expired)
+ 15              -密码长度错误，必须为4-9位的数字字符串(invalid password length.)
+ 16              -管理员密码与清空码相同(admin super password is same with delete password.)
+ 17              -电子钥匙未生效(ekey hasn't become effective.)
+ 18              -用户验证未通过，暂无操作权限(user not login)
+ 19              -操作失败，未定义的错误或设备不支持相关操作(Failed. Undefined error.)
+ 20              -密码已存在，无法添加(password already exists.)
+ 21              -密码不存在或未被使用过，无法操作(password not exists or never be used.)
+ 22              -存储空间不足(out of memory.)
+ 23              -无定义的错误(no defined error.)
+ 24              -卡号不存在(Card number not exist.)
+ 26              -指纹不存在(Finger print not exist.)
+ 27              -无效指令(Invalid command, 智能锁不支持该操作或参数不符合要求)
+ 28              -电子钥匙已冻结(lock frozen.)
+ 29              -无效字符串, 定制智能锁使用特定vendor, 请核对相关参数(invalid vendor string.)
+ 30              -门已反锁(普通用户不允许开锁)
+ 31              -记录不存在(record not exist)
+ 36              -指令已接收，正在处理中, 请稍候**2.7.6新增**
+ 37              -无效的SSID，智能锁无法使用该网络(WIFI锁配置SSID错误)**2.7.6新增**
+ 38              -WIFI密码错误**2.7.6新增**

+ 128             -网关操作失败**2.6.0新增**
+ 129             -指令已接收，正在处理中, 请稍候**2.6.0新增**（一般不返回）
+ 130             -无效的SSID，网关无法使用该网络**2.6.0新增**
+ 131             -WIFI密码错误**2.6.0新增**
+ 132             -处理已完成**2.6.0新增**（一般不返回）
+ 133             -无效指令**2.6.0新增**
+ 134             -指令超时**2.6.0新增**
+ 135             -设备未插入SIM卡**2.6.0新增**
+ 136             -设备无法连接网络**2.6.0新增**

+ 10000           -钥匙或锁时间不正确
+ 10001           -锁可能被重置，请重新添加
+ 10002           -设备连接超时，请确认是否在附近或稍后重试
+ 10003           -设备已断开连接
+ 10004           -数据发送失败，请稍后重试
+ 10005           -无效钥匙，请检查钥匙数据是否正确
+ 10006           -钥匙数据解析失败，请重试
+ 10007           -建立蓝牙连接失败或连接已中断
+ 10008           -停止蓝牙扫描失败
+ 10009           -不支持的设备类型
+ 10010           -锁未进入可添加模式，请先摸亮锁或重置智能锁
+ 10011           -网关未进入可添加模式，请重新通电后扫描(**2.7.0新增**)
+ 10012           -系统蓝牙功能未开启(**2.7.0新增**)
+ 10013           -系统蓝牙功能未开启或用户未授权予微信蓝牙权限(iOS)(**2.7.0新增**)
+ 10014           -用户未授权予微信蓝牙权限(iOS)(**2.7.0新增**)
+ 10015           -用户未授权予微信位置权限(安卓)(**2.7.0新增**)
+ 10016           -设备未扫描到可用WIFI(**2.7.0新增**)
+ 10017           -设备通信超时未响应(**2.7.0新增**)
+ 10018           -蓝牙特征值不存在(**2.7.0新增**)
+ 10019           -配置WIFI信息失败，请检查WIFI信息及网络状态(无效的WIFI信息或网络状态差)(**2.7.0新增**)
+ 10020           -配置远程服务器失败，请检查服务器配置信息及网络状态(**2.7.0新增**)
+ 10021           -设备未响应，请重试(**2.7.0新增**)
+ 10022           -操作已中断(**2.7.6新增**)

+ 10030           -启动蓝牙适配器失败
+ 10031           -停止设备扫描失败
+ 10032           -启用蓝牙特征值监控失败，请重试（蓝牙通信失败）
+ 10033           -数据发送失败
+ 10034           -设备通信错误(未正确返回数据)
+ 10035           -智能锁初始化失败
+ 10036           -搜索不到设备，已停止搜索，请确认是否在锁附近或稍后重试
+ 10037           -正在连接设备，无法中止，请稍候**2.6.0新增**
+ 10038           -微信基础库版本过低，请升级(**2.7.0新增**, 需2.14.1及其以上)
+ 11001           -设备暂不支持该操作
+ 11002           -设备或平台不支持蓝牙功能调试**2.0.2新增**
+ 11003           -参数错误**2.1.0新增**
+ 11004           -智能锁不支持该功能**2.1.0新增**
+ 11005           -非管理员用户，无权操作**2.1.0新增**
+ 11006           -无效的锁数据**2.1.0新增**
+ 11007           -无效的锁时间**2.1.0新增**
+ 11008           -无效的楼层编号列表**2.1.0新增**
+ 11009           -密码为4-9位数字字符串**2.1.0新增**
+ 11010           -时间不在有效期内**2.1.0新增**
+ 11011           -结束时间不能早于开始时间**2.1.1新增**
+ 11012           -无效的酒店信息**2.4.0新增**
+ 11013           -蓝牙正在操作中，请稍候再试**2.4.0新增**
+ 11014           -无效的楼栋楼层信息**2.4.0新增**
+ 11101           -服务器请求失败**2.8.0新增**
