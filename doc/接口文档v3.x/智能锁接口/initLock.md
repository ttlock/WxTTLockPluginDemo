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

### 特别说明
 1. 初始化操作为本地操作，不与服务器交互，需在初始化成功后调用远程接口进行数据同步以防止数据丢失  
 2. **若未上传服务器可能导致智能锁数据丢失，只能物理重置智能锁**  
    重置方法：打开智能锁背板 -> 长按重置键 -> 输入初始化密码"000#"  
 3. 该接口**不写入酒店信息**, 如需初始化酒店锁请在初始化完成后调用设置酒店信息等相关接口进行操作   

### 参数说明  
 类型定义：TTLockInit  
 |PARAMS                |TYPE               |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|-------------------|--------------|----------------|-----------|
 |deviceFromScan        |TTLockFromScan     |Y             |IN              |[扫描到的智能锁信息](#TTLockFromScan)|
 |disconnectCallback    |TTLockCallback     |N             |OUT             |设备断开连接回调, 请参考[设备断连回调](#TTLockCallback)|
 |vendor                |string             |N             |IN              |定制智能锁板约定字符串，**定制锁板必传**|
 |serverTime            |number             |N             |IN              |服务器时间戳，用于校准智能锁时间，不传则取本地时间|  

#### <span name="TTLockFromScan">扫描到的智能锁设备</span>  
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
 |lockVersion       |TTLockVersion      |2.7.0      |[智能锁版本信息](#TTLockVersion), 3.1.0开始可跳过更新锁版本信息直接初始化|
 |electricQuantity  |number             |           |智能锁设备电量|
 |isTouch           |boolean            |2.7.0      |设备是否处于可触摸开锁状态|  

#### <span name="TTLockVersion">智能锁版本信息</span>  
 类型定义：[TTLockVersion](../对象类型说明/智能锁.md#TTLockVersion)  
 |PARAMS                |TYPE         |REQUIRED      |DESCRIPTION|
 |----------------------|-------------|--------------|-----------|
 |protocolVersion       |number       |Y             |协议版本号|
 |protocolType          |number       |Y             |智能锁协议类型|
 |scene                 |number       |Y             |场景值|
 |groupId               |number       |N             |应用商ID, 3.1.0开始为非必传|
 |orgId                 |number       |N             |应用商子ID, 3.1.0开始为非必传|  

#### <span name="TTLockCallback">设备断连回调</span>  
 类型定义：TTLockCallback  
```
    (result: TTLockError) => any
```  
##### 回调方法参数说明  
 |PARAMS    |TYPE               |IN/OUT         |DESCRIPTION|
 |----------|-------------------|---------------|-----------|
 |result    |TTLockError        |OUT            |设备断连返回参数信息, 请参考[常规错误返回结果](#TTLockError)|  

### 返回值  
 异步返回操作回调结果: [TTLockInitResult](#TTLockInitResult)  

#### <span name="TTLockInitResult">初始化蓝牙智能锁返回结果</span>  
 类型定义：TTLockInitResult, 扩展[TTLockError](#TTLockError), 以下仅列出补充参数   
 |NAME          |TYPE           |VERSION    |DESCRIPTION|
 |--------------|---------------|-----------|-----------|
 |lockData      |string         |           |初始化蓝牙智能锁数据，获取后请及时同步服务器，否则可能导致智能锁丢失，不建议直接用于开锁|  

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
 6. [设置酒店锁信息](./setHotelData.md)  
 7. [设置酒店锁使用扇区](./setHotelSector.md)  
 8. [设置梯控工作模式](./setLiftWorkMode.md)  
 9. [设置梯控关联楼层](./setLiftControlableFloors.md)  
 10. [设置取电开关工作模式](./setPowerSaverWorkMode.md)  
 11. [设置取电开关关联的智能锁](./setPowerSaverControlableLock.md)  

## 版本更新内容  
#### **3.1.0**  
    1. 初始化时不再自动停止设备扫描  
    2. 扫描到的设备lockVersion参数中将不再返回groupId和orgId  
    3. 取消MAC地址填入操作  
    4. 取消从服务器获取锁时间，请通过serverTime进行锁时间设置  
    5. 增加初始化非完整密码锁支持  

#### **3.0.3(离线版2.0.2)**  
    1. 修复部分智能锁操作异常返回循环校验码错误的问题  

#### **3.0.0**  
    1. 增加option传参方式  
    2. 取消deviceId参数，降低因设备无法连接造成的失败率  
    3. 允许传入服务器时间戳进行时间校准  