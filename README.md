# 通通锁蓝牙模块通信插件接口说明文档 (version: 2.x)

## 说明
 通通锁蓝牙模块通信插件是基于微信小程序接口开发的蓝牙模块插件，使用时需配合通通锁开放平台接口或相关本地开发包使用。  
 小程序后台可通过搜索“**通通锁**”或小程序appid进行搜索  
 在线版appid: **wx43d5971c94455481** (免费使用)  
 离线版appid: **wxc788856964635783** (付费使用)  
 
 [通通锁开放平台](https://open.ttlock.com/)  
 **2.x版本接口适配开放平台Cloud API V3版本接口，相对1.x版本的接口有很大改动，升级时请特别注意**    
 **2.x版本不再兼容1.x版本接口**

1. 添加智能锁：调用开放平台/oauth2/token接口登录 -> 小程序initLock接口 -> 开放平台锁初始化接口/v3/lock/initialize  
    **注意：若未上传服务器可能导致智能锁数据丢失，只能物理重置智能锁**  
2. 开锁：调用获取锁的普通钥匙列表(其余获取钥匙的接口均可) -> 小程序controlLock接口开锁  
    **注意：小程序接口不主动上传操作记录，如需上传请自行调用开放平台接口上传记录**  
3. 校准锁时间：调用获取锁的普通钥匙列表(其余获取钥匙的接口均可) -> 获取服务器时间 -> 小程序setLockTime接口校准锁时间  
4. 小程序插件单个接口内部自动连接和断开设备，无需额外连接蓝牙操作，但**两个蓝牙接口调用之间需要设置一定的延迟时间**，否则可能出现“启用蓝牙特征值监控失败，请重试”或“锁连接已断开”等错误，具体可参考demo
5. 初始化设备时**请勿使用真机调试模式**，否则可能导致设备意外断连，**调试时请使用预览模式并打开手机端开发调试**


## 重要参数
#### 1. 变量 锁蓝牙模块的uuid  

`LOCK_BLE_UUID`

###### 版本更新内容
+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动  


#### 2. 变量 三代锁  

`LOCK_TYPE_V3`  

###### 版本更新内容
+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动  


#### 3. 变量 控制锁类型-开锁  

`CONTROL_ACTION_OPEN` 

###### 说明
+ 控制锁类型，固定值3，用于开锁/闭锁接口传参

###### 版本更新内容
+ **2.0.0**  
	 1. 2.0.0版本新增，开锁/闭锁接口参数类型  



#### 4. 变量 控制锁类型-闭锁  

`CONTROL_ACTION_CLOSE` 

###### 说明
+ 控制锁类型，固定值6，用于开锁/闭锁接口传参

###### 版本更新内容
+ **2.0.0**  
	 1. 2.0.0版本新增，开锁/闭锁接口参数类型  



#### 5. 变量 锁记录类型-全部读取  

`RECORD_TYPE_ALL` 

###### 说明
+ 锁记录类型，固定值1，用于读取锁操作记录传参，表示读取全部操作记录

###### 版本更新内容
+ **2.0.0**  
	 1. 2.0.0版本新增


#### 6. 变量 锁记录类型-未读取的操作记录  

`RECORD_TYPE_NEW` 

###### 说明
+ 锁记录类型，固定值2，用于读取锁操作记录传参，表示读取锁内未读取的操作记录

###### 版本更新内容
+ **2.0.0**  
	 1. 2.0.0版本新增

#### 7. 变量 锁开关配置属性类型

```
	LockConfigType = {
		TAMPER_ALERT = 0x01,   // 使能/禁用防撬开关
		RESET_BUTTON = 0x02,   // 使能/禁用重置按键
		PRIVACY_LOCK = 0x04,    // 使能/禁用反锁开关
		UNLOCK_DIRECTION = 0x10,  // 左右开门设置
		PASAGE_MODE_AUTO_UNLOCK_SETTING = 0x20,  // 使能/禁用常开模式自动开锁
	}
```

###### 说明
+ 锁开关配置属性类型，文档中未说明的类型为当前不支持的类型，传入时可通过

###### 版本更新内容
+ **2.5.0**  
	 1. 2.5.0版本新增


## 主要接口
#### 1. 方法 获取当前锁类型

`function getLockType(lockVersion)`  

###### 参数
+ lockVersion：为锁版本信息json,添加锁时会返回该字段  

###### 返回值
+ 0 -不开放或已不支持的锁类型 3 -二代门锁 4 -二代锁(带永久密码功能) 5 -三代锁  

###### 版本更新内容
+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动  



#### 2. 方法 判断设备是否允许远程开锁

`function isRemoteUnlockEnabled(specialValue: Number|String)`  

###### 参数
+ specialValue:锁的特征值, 2.4.1版本开始支持传入featureValue

###### 返回值
+ Boolean

###### 版本更新内容
+ **2.4.1**  
	 1. 参数specialValue支持传入featureValue

+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动   



#### 3. 方法 设置是否打开调试日志

`function setShowLog(showLog: Boolean)`

###### 参数
+ showLog: 是否打印调试日志，默认为false

###### 返回值
+ 无

###### 版本更新内容
+ **2.0.1**  
	 1. 修复调试默认值与文档说明不符的问题

+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动 



#### 4. 方法 获取当前设备mac地址

`function getDeviceMacAddress(deviceFromWx: Object)`

###### 参数
+ deviceFromWx: 对象为微信小程序 蓝牙扫描接口返回的device对象

###### 返回值
+ lockMac: String || null   -返回当前锁的mac地址, 格式`AA:AA:AA:BB:BB:BB`, 参数错误时返回null

###### 版本更新内容
+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动 



#### 5. 方法 扫描蓝牙设备接口

`function startScanBleDevice(callBack: Function, failCallback: Function)`

###### 参数
+ callBack扫描接口成功获取设备回调, 扫描成功该方法可能执行多次，请不要在该循环执行添加锁等操作，返回参数信息`callback(BleDevice: Option, BleDeviceList: Array)`
	 + BleDevice为扫描到的单把锁信息, 同一把锁可能返回多次, 说明:
```
	{
		 lockName: "",   -锁蓝牙名称
		 deviceId: "",   -锁ID
		 rssi: 0,        -蓝牙当前信号强度, 该参数, 1.3.0版本新增特殊返回值0, 表示该设备已掉线
		 lockMac: "",    -当前的锁MAC值
		 protocolType: 0,      -锁协议类型
		 protocolVersion: 0,   -锁协议版本
		 scene: 0,             -场景值
		 isSettingMode: false，-是否是可初始化模式，只有处于可初始化模式才能初始化锁, 1.3.0版本以前无蓝牙超时处理, 设备超时无回调
		 electricQuantity: 0,  -电池电量
	}
```
	 + BleDeviceList说明: 1.3.0版本新增, **为当前扫描状态下周围锁信息列表, 以添加状态、蓝牙信号强度排序**, 参数信息参考BleDevice

+ failCallback: 1.3.0版本新增,用于开启蓝牙扫描失败回调, 返回参数形式：`failCallBack(err: Option)`

	 + err说明：
```
	{
		 errorCode: 错误码,
		 errorMsg: 错误信息,
		 description: 蓝牙失败原因描述
	}
```

###### 返回值
+ 在callBack和failCallback回调中返回

###### 版本更新内容
+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动 



#### 6. 方法 停止扫描蓝牙设备接口

`function stopScanBleDevice(callBack: Function, failCallback: Function)`

###### 参数
+ callback为蓝牙停止扫描成功接口回调, 返回参数形式：`callback(res: Option)`
	 + res说明：
```
	{
		 errorCode: 0,           -错误码
		 errorMsg: "操作成功"    -错误信息
	}
```

+ failCallback -蓝牙停止扫描失败接口回调, 返回参数形式：`failCallback(err: Option)`
	 + err说明：
```
	{
		 errorCode: 错误码,
		 errorMsg: 错误信息,
		 description: 蓝牙失败原因描述
	}
```

###### 返回值
+ 在callBack和failCallback回调中返回

###### 版本更新内容
+ **2.0.0**  
	 1. 沿用1.4.1版本，无特殊改动 



#### 7. 方法 初始化锁

`function initLock(device: Object, callBack: Function, vendor: String)`

###### 参数
+ device为蓝牙扫描接口startScanBleDevice方法返回的单个对象, 仅isSettingMode=true的锁可进行初始化
+ callBack为蓝牙停止扫描成功接口回调, 返回参数形式：`callback(initLockResult: Option)`
	 + initLockResult说明：
```
	{
		 errorCode: 0 		-错误码
		 errorMsg:"",			-错误信息
		 lockData:"" 			-为锁初始化数据的字符串，对应于开放平台服务器锁初始化接口(V3)中的lockData字段
	}
```
+ verdor **2.1.0版本新增**, 为定制智能锁板约定字符串, **常规智能锁不传入该值**
+ 该接口不写入酒店信息，需初始化酒店锁请在初始化完成后额外调用“设置酒店信息”及“设置酒店锁扇区”接口

###### 返回值
+ 在callBack回调中返回  

###### 版本更新内容
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



#### 8. 方法 重置锁

`function resetLock(lockData: String, callBack: Function)`

###### 参数
+ lockData: **管理员**钥匙数据字符串
+ callBack：锁重置结果回调(由调用者传入，传入方法需有一个返回数据对象)，返回参数形式：`callback(resetLockResult: Option)`
	 + resetLockResult说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: ""    -错误信息
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
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



#### 9. 方法 蓝牙开锁/闭锁接口

`function controlLock(controlAction: Number, lockData: String, callBack: Function, floorList: Array)`

###### 参数
+ controlAction: 操作类型，3 -蓝牙开锁，6 -蓝牙闭锁，**目前仅支持3和6**，可使用参数CONTROL_ACTION_OPEN和CONTROL_ACTION_CLOSE
+ lockData: 钥匙数据字符串
+ callBack：钥匙开锁/闭锁后的回调(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容 返回参数形式：`callBack(controlLockResult: Option)`
	 + controlLockResult说明：
```
	{
		 lockTime: 锁中当前时间的时间戳, (!!仅在开锁成功后返回)
		 errorCode: 0,	 		-错误码
		 errorMsg: "",			-错误提示
		 battery: 12,			-锁电量 范围 0-100, (!!仅在开锁成功后返回)
		 controlAction: 3,			-操作类型
		 uniqueid: 123456789		-唯一标识
	}
```
+ floorList: **非必填**仅在梯控开锁时传入需要点亮的楼层编号列表,**有且至少传入一个楼层编号**，如[1,2,3]，单个楼层编号为[1, 127]**闭区间**的正整数，**非梯控开锁时，该参数不填**

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
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


#### 10. 方法 设置锁时间

`function setLockTime(timestamp: Number, lockData: String, callBack: Function)`

###### 参数
+ timestamp: 当前时间戳
+ lockData: 钥匙数据字符串
+ callBack：钥匙开门后的回调(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(setLockTimeResult: Option)`

	 + setLockTimeResult说明：
```
	{
		 errorCode: 0,   -错误码 
		 errorMsg: ""    -错误信息
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
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


#### 11. 方法 读取锁内操作记录

`function getOperationLog(logType: Number, lockData: String, callBack: Function)`

###### 参数
+ logType: 记录类型，1 -ALL 锁内所有记录， 2 -NEW 锁内未读取的记录
+ lockData: 钥匙数据字符串
+ callBack：读取操作记录的回调(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码（1.3.2版本新增） 
		 errorMsg: ""    -错误信息（1.3.2版本新增）
		 log:   -锁内操作记录的json字符串
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
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



#### 12. 方法 添加密码

`function createCustomPasscode(passcode: String, startDate: Number, endDate: Number, lockData: String, callBack: Function)`

###### 参数
+ passcode: 添加的密码字符串，由0-9组成的4-9位长度数字字符串，如"0123456"
+ startDate: 密码有效期开始时间，整点的时间戳
+ endDate: 密码有效期结束时间，整点时间戳
+ lockData: 锁数据字符串
+ callBack：添加密码的回调(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码（1.3.2版本新增） 
		 errorMsg: ""    -错误信息（1.3.2版本新增）
		 passcode:   -写入锁内的密码
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
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



#### 13. 方法 修改密码

`function modifyPasscode(originalCode: String, newCode: String, startDate: Number, endDate: Number, lockData: String, callBack: Function)`

###### 参数
+ originalCode: 待修改的原始密码字符串, 由0-9组成的4-9位长度数字字符串，如"0123456"
+ newCode: 修改后的密码字符串，由0-9组成的4-9位长度数字字符串，如"0123456"
+ startDate: 新密码有效期开始时间，整点的时间戳
+ endDate: 新密码有效期结束时间，整点时间戳
+ lockData: 锁数据字符串
+ callBack：修改密码的回调(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: ""    -错误信息
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
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



#### 14. 方法 删除密码

`function deletePasscode(passcode: String, lockData: String, callBack: Function)`

###### 参数
+ passcode: 待删除的密码字符串，由0-9组成的4-9位长度数字字符串，如"0123456"
+ lockData: 锁数据字符串
+ callBack：删除密码的回调(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: ""    -错误信息
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
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


#### 15. 方法 添加指纹

`function addFingerprint(startDate: Number, endDate: Number, lockData: String, callBack: Function)`

###### 参数
+ startDate: 指纹有效期开始时间，时间戳，精确到分钟
+ endDate: 指纹有效期结束时间，时间戳，精确到分钟
+ lockData: 锁数据字符串
+ callBack：添加指纹的回调(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: "",    -错误信息
		 type: 1,     -回调类型, 当type为1时表示回调: 1 -指纹完成添加，操作结束; 2 -已进入添加模式; 3 -录入指纹步骤回调; 未返回 -操作失败，errorCode不为0
		 fingerprintNum: 1234567890,   -添加成功的指纹号，仅type=1时返回
		 totalCount: 3,   -录入指纹的总次数，仅type=2时返回
		 description: "已进入添加模式",    -操作描述
		 currentCount: 1    -当前录入指纹的次数, 仅type=3时返回
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
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



#### 16. 方法 修改指纹有效期

`function modifyFingerprintValidityPeriod(startDate: Number, endDate: Number, fingerprintNum: Number, lockData: String, callBack: Function)`

###### 参数
+ startDate: 指纹有效期开始时间，时间戳，精确到分钟
+ endDate: 指纹有效期结束时间，时间戳，精确到分钟
+ fingerprintNum: 待修改的指纹号
+ lockData: 锁数据字符串
+ callBack：修改指纹的回调(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: "",    -错误信息
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
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



#### 17. 方法 删除指纹

`function deleteFingerprint(fingerprintNum: Number, lockData: String, callBack: Function)`

###### 参数
+ fingerprintNum: 待删除的指纹号
+ lockData: 锁数据字符串
+ callBack：修改指纹的回调(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: "",    -错误信息
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
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



#### 18. 方法 添加IC卡

`function addICCard(startDate: Number, endDate: Number, lockData: String, callBack: Function)`

###### 参数
+ startDate: IC卡有效期开始时间，精确到分钟的时间戳
+ endDate: IC卡有效期结束时间，精确到分钟的时间戳
+ lockData: 锁数据字符串
+ callBack：添加IC卡的回调(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: "",    -错误信息
		 type: 1,     -回调类型, 当type为1时表示回调: 1 -IC卡完成添加，操作结束; 2 -已进入添加模式; 未返回 -操作失败，errorCode不为0
		 cardNum: 123456,   -添加成功的IC卡号，仅type=1时返回
		 description: "已进入添加模式",    -操作描述
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
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



#### 19. 方法 修改IC卡有效期

`function modifyICCardValidityPeriod(startDate: Number, endDate: Number, cardNum: Number, lockData: String, callBack: Function)`

###### 参数
+ startDate: 新IC卡有效期开始时间，精确到分钟的时间戳
+ endDate: 新IC卡有效期结束时间，精确到分钟的时间戳
+ cardNum: 待修改的IC卡卡号, 如123456
+ lockData: 锁数据字符串
+ callBack：修改IC卡有效期的回调(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: "",    -错误信息
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
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



#### 20. 方法 删除IC卡

`function deleteICCard(cardNum: Number, lockData: String, callBack: Function)`

###### 参数
+ cardNum: 待删除的IC卡卡号, 如123456
+ lockData: 锁数据字符串
+ callBack：删除IC卡的回调(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: "",    -错误信息
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
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



#### 21. 方法 解析智能锁特征值

`function parseSpecialValues(specialValue: Number|String)`

###### 参数
+ specialValue: 智能锁特征值, 2.4.1版本支持传入featureValue

###### 返回值
+ JsonObject
	1. passcode:Boolean 是否支持密码
	2. ICCard:Boolean 是否支持IC卡
	3. fingerprint:Boolean 是否支持指纹
	4. wristband:Boolean 是否支持手环
	5. autoLock:Boolean 是否支持自动闭锁
	6. delPasscode:Boolean 是否支持删除密码功能
	7. mngPasscode:Boolean 是否支持密码管理功能
	8. locking:Boolean 是否支持闭锁功能
	9. passcodeVisible:Boolean 是否支持密码显示或隐藏功能
	10. gatewayUnlock:Boolean 是否支持网关开锁
	11. gatewayFreeze:Boolean 是否支持网关冻结、解冻
	12. cyclePasscode:Boolen 是否支持循环密码功能
	13. doorSensor:Boolean 门磁
	14. remoteUnlockSwitch:Boolean 远程开锁设置
	15. audioSwitch:Boolean 支持启用或禁用语音提示管理
	16. NBIoT:Boolean 是否支持NB-ioT
	17. getAdminPasscode:Boolean 是否支持读取管理员密码
	18. hotelCard:Boolean 是否支持酒店锁卡系统
	19. noClock:Boolean 锁没有时钟芯片
	20. noBleUnlock:Boolean 不支持蓝牙开锁
	21. passageMode:Boolean 是否支持常开模式
	22. autoLockInPassageMode:Boolean 常开模式下是否支持关闭自动闭锁
	23. wirelessKeypad:Boolean 无线键盘
	24. lightTimeSetting:Boolean 照明灯时间配置
	25. hotelCardBlacklist:Boolean 允许酒店挂失功能
	26. IDCard:Boolean 身份证开锁
	27. tamperSwitch:Boolean 防撬开关
	28. resetButton:Boolean 重置键配置
	29. privacyLock:Boolean 反锁功能
	30. deadLock:Boolean 死锁功能
	31. cyclicCardOrFingerprint:Boolean 循环指纹或循环IC卡功能
	32. unlockDirection: Boolean 是否支持左右开门设置（**2.5.0版本新增**）
	33. fingerVein:Boolean 指静脉
	34. ble5G:Boolean 5G蓝牙
	35. NBAwake:Boolean NB激活配置

###### 版本更新内容 
+ **2.5.0**  
  1. 增加是否支持左右开门设置返回值

+ **2.4.1**  
  1. 支持传入featureValue特征值 

+ **2.1.0**
	 1. 2.1.0版本新增



#### 22. 方法 获取锁版本号

`function getLockVersion(lockMac: String, callBack: Function)`

###### 参数
+ lockMac: String  -目标锁的mac地址, 格式`AA:AA:AA:BB:BB:BB`
+ callBack：(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: "",    -错误信息
		 lockVersion: {		-锁版本信息（errorCode = 0 时返回）
			 protocolType: -协议类型
			 protocolVersion：	-协议版本
			 scene：	-场景值
			 groupId： 		-应用商ID
			 orgId：		-应用商子ID
		 }
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
+ **2.2.0**  
	1. 2.2.0版本新增


#### 23. 方法 设置远程开锁开关状态

`function setRemoteUnlockSwitchState(enable: Boolean, lockData: String, callBack: Function)`

###### 参数
+ enable: Boolean  -是否开启远程开锁开关
+ lockData: String	-管理员锁数据
+ callBack：(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: "",    -错误信息
		 electricQuantity: 45,		-锁电量
		 lockData: "...",		-状态修改成功后返回的锁数据，用于锁数据更新
		 specialValue: 48645,		-修改后锁特征值
		 featureValue: "AABBCCDD"		-修改后的锁扩展特征值（2.3.1版本新增）
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
+ **2.3.1**  
	1. 修复部分情况下返回的lockData和specialValue不正确的问题
	2. 增加扩展特征值featureValue参数 

+ **2.3.0**  
	1. 2.3.0版本新增


#### 24. 方法 获取远程开锁开关状态

`function getRemoteUnlockSwitchState(lockData: String, callBack: Function)`

###### 参数
+ lockData: String	-管理员锁数据
+ callBack：(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: "",    -错误信息
		 enabled: true,		-是否已开启远程开锁
		 electricQuantity: 45,		-锁电量
		 lockData: "...",		-状态修改成功后返回的锁数据，用于锁数据更新
		 specialValue: 48645,		-修改后锁特征值
		 featureValue: "AABBCCDD"		-修改后的锁扩展特征值（2.3.1版本新增）
	}
```

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
+ **2.3.1**  
	1. 修复部分情况下返回的lockData和specialValue不正确的问题
	2. 增加扩展特征值featureValue参数 
	
+ **2.3.0**  
	1. 2.3.0版本新增


#### 25. 方法 设置酒店信息（该接口不在demo中使用）

`function setHotelData(hotelData: Object, lockData: String, callBack: Function)`

###### 参数
+ hotelData: Object		-待设置的酒店信息 
``` 
	{
		hotelInfo: String	-通过开放平台接口或相关jar包获取的酒店信息串, 必传
		buildingNumber: Number -楼栋号，[0, 254]的正整数，必传
		floorNumber: Number -楼层号，[0, 255]的正整数，普通酒店锁传入
	}
``` 
+ lockData: String	-管理员锁数据
+ callBack：(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: "",    -错误信息
	}
```

###### 特殊说明
+ **该接口仅用于酒店方案智能锁配置，在锁初始化完成后调用**

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
+ **2.4.0**  
	1. 2.4.0版本新增


#### 26. 方法 设置酒店锁扇区（该接口不在demo中使用）

`function setHotelSector(sectors: Array, lockData: String, callBack: Function)`

###### 参数
+ sectors: Array	-待配置锁扇区, 传入1-16组成的数组，如[1, 3, 6]代表1、3、6号扇区可用，**该数组不能为空**
+ lockData: String	-管理员锁数据
+ callBack：(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: "",    -错误信息
	}
```

###### 特殊说明
+ **该接口仅用于酒店方案智能锁配置，在锁初始化完成后调用**
+ **酒店扇区配置后，如卡片写入正常数据缺无法开锁，请将锁断电后重新通电后重新开锁**

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
+ **2.4.0**  
	1. 2.4.0版本新增 

#### 27. 方法 设置锁开关配置

`function setLockConfig(TTLockConfigType: Number, switchOn: Boolean, lockData: String, callBack: Function)`

###### 参数
+ TTLockConfigType: Number	-需要获取的开关配置类型，支持类型见本文档“重要参数-7 变量 锁开关配置属性类型”，
+ switchOn: Boolean	-是否设置开关为开启状态，true为使能，false为禁用（左右开门设置时传入true为左开门，false为右开门）
+ lockData: String	-管理员锁数据
+ callBack：(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: "",    -错误信息
		 electricQuantity: 45,		-锁电量
		 lockConfigType: 3,		-开关配置属性实际开启状态
		 lockConfigs：{			-开关使能状态（未查询或锁不支持的属性均不返回）
		 	tamperAlert: true,		-使能/禁用防撬开关
			resetButton: false,   	-使能/禁用重置按键
			privacyLock: false,    	-使能/禁用反锁开关
			unlockDirection: false,  -左右开门设置（true为左开门，false为右开门)
			pasageModeAutoUnlockSetting: true,  -使能/禁用常开模式自动开锁
		 }
	}
```

###### 特殊说明
+ lockConfigType及lockConfigs均不返回智能锁不支持的属性
+ 支持同时设置多个属性时，如需同时重置按键属性和防撬开关配置属性时，TTLockConfigType传入`LockConfigType.RESET_BUTTON | LockConfigType.TAMPER_ALERT`

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
+ **2.5.0**  
	1. 2.5.0版本新增


#### 28. 方法 获取锁开关配置

`function getLockConfig(TTLockConfigType: Number, switchOn: Boolean, lockData: String, callBack: Function)`

###### 参数
+ TTLockConfigType: Number	-需要获取的开关配置类型，支持类型见本文档“重要参数-7 变量 锁开关配置属性类型”
+ lockData: String	-管理员锁数据
+ callBack：(由调用者传入，传入方法需有一个返回数据对象)，以下为回调中返回的数据对象内容，返回参数形式：`callback(result: Option)`

	 + result说明：
```
	{
		 errorCode: 0,   -错误码
		 errorMsg: "",    -错误信息
		 electricQuantity: 45,		-锁电量
		 lockConfigType: 3,		-开关配置属性实际开启状态
		 lockConfigs：{			-开关使能状态（未查询或锁不支持的属性均不返回）
		 	tamperAlert: true,		-使能/禁用防撬开关
			resetButton: false,   	-使能/禁用重置按键
			privacyLock: false,    	-使能/禁用反锁开关
			unlockDirection: false,  -左右开门设置（true为左开门，false为右开门)
			pasageModeAutoUnlockSetting: true,  -使能/禁用常开模式自动开锁
		 }
	}
```

###### 特殊说明
+ lockConfigType及lockConfigs均不返回智能锁不支持的属性
+ 支持同时获取多个属性时，如需同时获取重置按键属性和防撬开关配置属性时，TTLockConfigType传入`LockConfigType.RESET_BUTTON | LockConfigType.TAMPER_ALERT`

###### 返回值
+ 在callBack回调中返回

###### 版本更新内容
+ **2.5.0**  
	1. 2.5.0版本新增


## 返回errorCode说明
**括号内为中文描述及相关处理方案，实际操作中不会返回**

+ 0               -OK (操作成功)
+ 1               -CRC error(CRC校验出错，请重试)
+ 2               -Not administrator, has no permission.
+ 3               -Wrong administrator password.
+ 5               -lock is in setting mode
+ 6               -lock has no administrator
+ 7               -Non-setting mode
+ 8               -invalid dynamic code
+ 10              -run out of battery
+ 11              -initialize keyboard password failed
+ 13              -invalid ekey, lock flag position is low
+ 14              -ekey expired
+ 15              -invalid password length
+ 16              -admin super password is same with delete password
+ 17              -ekey hasn't become effective
+ 18              -user not login
+ 19              -Failed. Undefined error.
+ 20              -password already exists.
+ 21              -password not exists or never be used
+ 22              -out of memory
+ 23              -no defined error
+ 24              -Card number not exist.
+ 26              -Finger print not exist.
+ 27              -Invalid command(智能锁不支持该操作或参数不符合要求)
+ 28              -lock frozen
+ 29              -invalid vendor string
+ 30              -门已反锁
+ 31              -record not exist
+ 10000           -钥匙或者锁时间不正确
+ 10001           -锁可能被重置，请重新添加
+ 10002           -锁连接超时，请确认是否在锁附近或者稍后重试
+ 10003           -锁连接已断开
+ 10004           -蓝牙数据发送失败，请稍后重试
+ 10005           -无效钥匙，请检查钥匙数据是否正确
+ 10006           -钥匙数据解析失败，请重试
+ 10007           -建立蓝牙连接失败或连接已中断
+ 10008           -停止蓝牙扫描失败
+ 10009           -不支持的锁类型
+ 10010           -锁未进入可添加模式
+ 10030           -启动蓝牙适配器失败
+ 10031           -停止蓝牙扫描失败
+ 10032           -启用蓝牙特征值监控失败，请重试
+ 10033           -蓝牙通信失败，请重试
+ 10034           -设备通信错误
+ 10035           -锁初始化失败
+ 10036           -搜索不到设备，已停止搜索，请确认是否在锁附近或稍后重试
+ 11001           -暂不支持该操作
+ 11002           -设备或平台不支持蓝牙功能调试**2.0.2新增**
+ 11003           -参数错误**2.1.0新增**
+ 11004           -智能锁不支持该操作**2.1.0新增**
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