# 通通锁蓝牙模块通信插件接口  

## 方法  
```
    function startScanBleDevice(callback?: TTLockScanCallback, failCallback?: TTLockCallback): Promise<TTLockError>
```  

### 功能描述   
 扫描周围的智能锁设备  

### 版本支持   
 在线版最低支持版本： **1.0.0**   
 离线版最低支持版本： **1.0.0**  

### 权限说明   
 1. 需开启小程序【蓝牙】授权
 2. 需开启系统【蓝牙】开关  
 3. 需开启系统【位置信息】开关（安卓）
 4. 需授权微信【蓝牙】权限  
 5. 需授权微信【附近设备】权限（安卓）
 6. 需授权微信【精确位置】权限（安卓），并设置为 **始终允许** 。若设置为 “每次使用中询问” 可能导致操作失败  

### 参数说明  
 |PARAMS            |TYPE                   |REQUIRED      |IN/OUT          |DESCRIPTION|
 |------------------|-----------------------|--------------|----------------|-----------|
 |callback          |TTLockScanCallback     |Y             |OUT             |智能锁扫描成功回调，可能回调多次, 请参考[设备扫描回调](#TTLockScanCallback)|
 |failCallback      |TTLockCallback         |Y             |OUT             |智能锁扫描失败或未扫描到设备回调, 请参考[设备扫描失败回调](#TTLockCallback)|  
 

#### <span name="TTLockScanCallback">成功扫描到设备回调</span>  
成功扫描到智能锁的回调，接口可能返回多次，deviceFromScanList**为当前扫描状态下周围锁信息列表, 以添加状态、蓝牙信号强度排序**  
 类型定义：TTLockScanCallback  
```
    (deviceFromScan: TTLockFromScan | null, deviceFromScanList: Array<TTLockFromScan>) => any
```  

#### 回调方法参数说明
 |PARAMS                    |TYPE                       |IN/OUT         |DESCRIPTION|
 |--------------------------|---------------------------|---------------|-----------|
 |deviceFromScan            |TTLockFromScan / null      |OUT            |扫描到的单把智能锁(可能为空值), 请参考[智能锁扫描信息](#TTLockFromScan)|
 |deviceFromScanList        |Array<TTLockFromScan>      |OUT            |扫描到的智能锁列表, 请参考[智能锁扫描信息](#TTLockFromScan)|  

##### <span name="TTLockFromScan">扫描到的智能锁设备</span>  
 类型定义：[TTLockFromScan](../对象类型说明/智能锁.md#TTLockFromScan)  
 |NAME              |TYPE               |VERSION    |DESCRIPTION|
 |------------------|-------------------|-----------|-----------|
 |deviceType        |number             |2.7.6      |[设备类型](../参数声明/设备通用参数.md#TTDEVICE_TYPE)|
 |type              |number             |2.7.0      |[智能锁类型](../参数声明/智能锁参数.md#TTLOCK_TYPE)|
 |deviceId          |string             |           |蓝牙广播设备ID, 安卓设备与MAC地址相同，iOS为UUID格式|
 |rssi              |number             |           |设备信号值, 0表示该设备已掉线|
 |isSettingMode     |boolean            |           |设备是否处于可添加状态|
 |MAC               |string             |2.7.0      |蓝牙设备MAC地址|
 |deviceName        |string             |2.7.0      |设备蓝牙名称|
 |updatedTime       |number             |2.7.0      |设备扫描最后更新时间|
 |lockVersion       |TTLockVersion      |2.7.0      |[智能锁版本信息](#TTLockVersion), 3.1.0之前可通过[getLockVersion](../智能锁接口/getLockVersion.md)接口进行更新, 3.1.0开始可跳过该接口直接初始化|
 |electricQuantity  |number             |           |智能锁设备电量|
 |isTouch           |boolean            |2.7.0      |设备是否处于可触摸开锁状态|  

##### <span name="TTLockVersion">智能锁版本信息</span>  
 类型定义：[TTLockVersion](../对象类型说明/智能锁.md#TTLockVersion)  
 |PARAMS                |TYPE         |REQUIRED      |DESCRIPTION|
 |----------------------|-------------|--------------|-----------|
 |protocolVersion       |number       |Y             |协议版本号|
 |protocolType          |number       |Y             |智能锁协议类型|
 |scene                 |number       |Y             |场景值|
 |groupId               |number       |N             |应用商ID, 3.1.0之前扫描智能锁固定返回1, 3.1.0开始扫描不再返回|
 |orgId                 |number       |N             |应用商子ID, 3.1.0之前扫描智能锁固定返回1, 3.1.0开始扫描不再返回|  

#### <span name="TTLockCallback">设备扫描失败回调</span>  
 3.0.8及其以前：设备扫描失败回调  
 3.1.0版本：设备扫描开启失败回调或未扫描到任意设备回调  
    1. 若因前者触发：触发时关闭蓝牙扫描  
    2. 若因后者触发：可能为未开启【附近设备】权限导致或设备未扫描到，触发时不会关闭蓝牙扫描  
 类型定义：TTLockCallback  
```
    (res: TTLockError) => any
```  

#### 回调方法参数说明
 |PARAMS        |TYPE               |IN/OUT         |DESCRIPTION|
 |--------------|-------------------|---------------|-----------|
 |res           |TTLockError        |OUT            |设备扫描失败或未扫描到设备结果, 请参考[常规错误返回结果](#TTLockError)|  


### 返回值  
 异步返回智能锁扫描回调结果: [TTLockError](#TTLockError)  
 当返回操作成功后，callback仍会多次回调  
 3.1.0改动：设备扫描开启后立即返回回调结果，部分蓝牙设备因未开启【附近设备】权限导致的失败将在之后回调failCallback，但不关闭扫描  

#### <span name="TTLockError">常规错误返回结果</span>  
 类型定义：[TTLockError](../对象类型说明/返回对象.md#TTLockError)   
 |NAME              |TYPE       |VERSION    |DEPRECATED     |DESCRIPTION|
 |------------------|-----------|-----------|---------------|-----------|
 |errorCode         |number     |           |               |[通通锁常规错误码](../参数声明/错误码.md)|
 |errorMsg          |string     |           |               |错误信息描述|
 |description       |boolean    |           |               |错误信息描述补充|
 |electricQuantity  |boolean    |2.7.0      |               |设备电量|
 |errCode           |number     |           |3.1.0          |微信蓝牙接口返回错误码|
 |errMsg            |string     |           |3.1.0          |微信蓝牙错误信息描述|
 |deviceId          |boolean    |2.7.0      |3.1.0          |蓝牙设备ID|  

## 相关链接  
 1. [集成方法](../../../README.md)  
 2. [接口文档](../接口文档.md)  
 3. [版本更新说明](../../版本更新说明.md)  
 4. [错误码说明](../参数声明/错误码.md)  
 5. [常见问题及相关处理方法](../常见问题.md)  

## 版本更新内容  
#### **3.1.0**  
    1. 设备扫描开启后立即返回方法结果，部分蓝牙设备因未开启【附近设备】权限导致的失败将在之后回调failCallback，但不关闭扫描  



