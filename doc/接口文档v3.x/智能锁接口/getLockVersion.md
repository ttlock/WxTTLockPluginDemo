# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function getLockVersion(option: TTLockGetVersion): Promise<TTLockGetVersionResult>
```  

### 功能描述   
 获取智能锁版本信息  
 接口操作完成后将更新option.deviceFromScan/deviceFromScan参数的lockVersion值  
 设备未初始化时，需摸亮智能锁后操作  

### 版本支持   
 在线版最低支持版本： **2.2.0**   
 离线版最低支持版本： **1.2.0**  

### 参数说明  
 类型定义：TTLockGetVersion  
 |PARAMS                |TYPE                       |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|---------------------------|--------------|----------------|-----------|
 |deviceFromScan        |TTLockFromScan / string    |Y             |IN,OUT          |[扫描到的智能锁信息](#TTLockFromScan)或服务器获取的电子钥匙信息lockData|
 |disconnectCallback    |TTLockCallback             |N             |OUT             |设备断开连接回调, 请参考[设备断连回调](#TTLockCallback)|  

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
 |lockVersion       |TTLockVersion      |2.7.0      |[智能锁版本信息](#TTLockVersion), 3.1.0之前将更新该数据, 3.1.0开始将不再更新原始数据|
 |electricQuantity  |number             |           |智能锁设备电量|
 |isTouch           |boolean            |2.7.0      |设备是否处于可触摸开锁状态|  

#### <span name="TTLockVersion">智能锁版本信息</span>  
 类型定义：[TTLockVersion](../对象类型说明/智能锁.md#TTLockVersion)  
 |PARAMS                |TYPE         |REQUIRED      |DESCRIPTION|
 |----------------------|-------------|--------------|-----------|
 |protocolVersion       |number       |Y             |协议版本号|
 |protocolType          |number       |Y             |智能锁协议类型|
 |scene                 |number       |Y             |场景值|
 |groupId               |number       |N             |应用商ID|
 |orgId                 |number       |N             |应用商子ID|  

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
 异步返回操作回调结果: [TTLockGetVersionResult](#TTLockGetVersionResult)  

#### <span name="TTLockGetVersionResult">获取智能锁版本信息返回结果</span>  
 类型定义：TTLockGetVersionResult, 扩展[TTLockError](#TTLockError), 以下仅列出补充参数   
 |NAME          |TYPE               |VERSION    |DESCRIPTION|
 |--------------|-------------------|-----------|-----------|
 |lockVersion   |TTLockVersion      |           |[智能锁版本信息](#TTLockVersion)|  

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
    1. 操作成功不再修改原始传入参数  

#### **3.0.0**  
    1. 增加option传参方式  
    2. 取消deviceId参数，降低因设备无法连接造成的失败率  
