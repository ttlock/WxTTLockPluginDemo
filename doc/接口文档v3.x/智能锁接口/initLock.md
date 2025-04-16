# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function initLock(option: TTLockInit): Promise<TTLockInitResult>
```  

### 功能描述   
 初始化蓝牙智能锁  
 接口仅支持三代智能锁操作  
 该接口**不写入酒店信息**，如需初始化酒店锁请在初始化完成后调用[setHotelData](./setHotelData.md)及[setHotelSector](./setHotelSector.md)接口进行酒店信息配置  

### 版本支持   
 在线版最低支持版本： **1.3.2**   
 离线版最低支持版本： **1.0.0**  

## 参数说明 
 类型定义：TTLockInit  
 |PARAMS                |TYPE                               |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|-----------------------------------|--------------|----------------|-----------|
 |deviceFromScan        |[TTLockFromScan](#TTLockFromScan)  |Y             |IN              |扫描到的智能锁信息|
 |disconnectCallback    |[TTLockCallback](#TTLockCallback)  |N             |OUT             |设备断开连接回调|
 |vendor                |string                             |N             |IN              |定制智能锁板约定字符串，**定制锁板必传**|
 |serverTime            |number                             |N             |IN              |服务器时间戳，用于校准智能锁时间，不传则默认从服务器获取时间戳，获取失败后取本地时间|
<br />

### <span name="TTLockFromScan">扫描到的智能锁设备 TTLockFromScan</span>
 [更多信息](../对象类型说明/智能锁.md#TTLockFromScan)  
 |NAME              |TYPE                               |VERSION    |DESCRIPTION|
 |------------------|-----------------------------------|-----------|-----------|
 |deviceType        |[TTDEVICE_TYPE](#TTDEVICE_TYPE)    |2.7.6      |设备类型|
 |type              |[TTLOCK_TYPE](#TTLOCK_TYPE)        |2.7.0      |智能锁类型|
 |deviceId          |string                             |           |蓝牙广播设备ID, 安卓设备与MAC地址相同，iOS为UUID格式|
 |rssi              |number                             |           |设备信号值|
 |isSettingMode     |boolean                            |           |智能锁是否处于可添加状态|
 |MAC               |string                             |2.7.0      |蓝牙设备MAC地址|
 |deviceName        |string                             |2.7.0      |智能锁名称|
 |updatedTime       |number                             |2.7.0      |设备扫描最后更新时间|
 |lockVersion       |[TTLockVersion](#TTLockVersion)    |2.7.0      |智能锁版本信息, 扫描时groupID和orgId固定返回1, 可通过[getLockVersion](./getLockVersion.md)接口进行更新|
 |electricQuantity  |number                             |           |设备电量|
 |isTouch           |boolean                            |2.7.0      |设备是否处于可触摸开锁状态|
<br />  

#### <span name="TTLockVersion">智能锁版本信息 TTLockVersion</span>  
 [更多信息](../对象类型说明/智能锁.md#TTLockVersion)
 |PARAMS                |TYPE         |REQUIRED      |DESCRIPTION|
 |----------------------|-------------|--------------|-----------|
 |protocolVersion       |number       |Y             |协议版本号|
 |protocolType          |number       |Y             |智能锁协议类型|
 |scene                 |number       |Y             |场景值|
 |groupId               |number       |N             |应用商ID|
 |orgId                 |number       |N             |应用商子ID|
 |logoUrl               |string       |N             |LOGO链接|
 |showAdminKbpwdFlag    |boolean      |N             |是否展示管理员密码|
<br />

#### <span name="TTLockCallback">设备断连回调</span>  
类型定义：TTLockCallback  
```
    (result: TTLockError) => any
```  
##### 回调方法参数说明  
 |PARAMS    |TYPE               |IN/OUT         |DESCRIPTION|
 |----------|-------------------|---------------|-----------|
 |result    |TTLockError        |OUT            |设备断连返回参数信息, 请参考[常规错误返回结果](#TTLockError)|  


## 返回值
 异步返回操作回调结果 [TTLockInitResult](#TTLockInitResult)  
<br />

### <span name="TTLockInitResult">初始化蓝牙智能锁返回结果 TTLockInitResult extends TTLockError</span>  
 返回结果为[TTLockError](#TTLockError)的扩展，以下仅列出补充参数  
 |NAME                          |TYPE           |VERSION    |DESCRIPTION|
 |------------------------------|---------------|-----------|-----------|
 |lockData                      |string         |           |初始化蓝牙智能锁数据，不建议直接用于开锁|
<br />

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
    1. 初始化时不再自动停止设备扫描  
    2. 扫描到的设备lockVersion参数中将不再返回groupId和orgId  
    3. 取消MAC地址填入操作

#### **3.0.3(离线版2.0.2)**  
    1. 修复部分智能锁操作异常返回循环校验码错误的问题  

#### **3.0.0**  
    1. 增加option传参方式  
    2. 取消deviceId参数，降低因设备无法连接造成的失败率  
    3. 允许传入服务器时间戳进行时间校准

## 固定参数补充说明  
## <span name="TTDEVICE_TYPE">TTDEVICE_TYPE 设备类型</span>  
 [更多信息](../参数声明/设备通用参数.md#TTDEVICE_TYPE)  
 |VALUE         |VERSION    |DESCRIPTION|
 |--------------|-----------|-----------|
 |1             |           |智能锁|
 |2             |           |网关|
 |99            |           |小程序不支持的设备类型|
<br />

## <span name="TTGATEWAY_TYPE">TTGATEWAY_TYPE 网关类型</span>  
 [更多信息](../参数声明/网关参数.md#TTGATEWAY_TYPE)  
 |VALUE         |VERSION    |DESCRIPTION|
 |--------------|-----------|-----------|
 |2             |           |G2网关（WIFI）|
 |3             |           |G3网关（有线）|
 |4             |           |G4网关（4G网关）|
 |-1            |           |不支持的智能设备|  
