# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function connectGateway(option: TTLockConnectGateway): Promise<TTLockError>
```  

### 功能描述   
 连接智能网关设备  

### 版本支持   
 在线版最低支持版本： **2.6.0**   
 离线版最低支持版本： **1.6.0**  

### 参数说明  
 类型定义：TTLockConnectGateway  
 |PARAMS                |TYPE                   |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|-----------------------|--------------|----------------|-----------|
 |deviceFromScan        |TTGatewayFromScan      |Y             |IN              |扫描到的网关设备信息, 请参考[蓝牙网关设备扫描值](#TTGatewayFromScan)|
 |disconnectCallback    |TTLockCallback         |N             |OUT             |设备断开连接回调, 请参考[设备断连回调](#TTLockCallback)|  

#### <span name="TTGatewayFromScan">扫描到的网关设备</span>
 类型定义：[TTGatewayFromScan](../对象类型说明/网关.md#TTGatewayFromScan)  
 |NAME              |TYPE               |VERSION    |DEPRECATED     |DESCRIPTION|
 |------------------|-------------------|-----------|---------------|-----------|
 |deviceType        |number             |2.7.6      |               |[设备类型](../参数声明/设备通用参数.md#TTDEVICE_TYPE)|
 |type              |number             |2.7.0      |               |[网关类型](../参数声明/网关参数.md#TTGATEWAY_TYPE)|
 |deviceId          |string             |           |               |蓝牙广播设备ID, 安卓设备与MAC地址相同，iOS为UUID格式|
 |rssi              |number             |           |               |设备信号值, 0表示该设备已掉线|
 |isSettingMode     |boolean            |           |               |设备是否处于可添加状态|
 |MAC               |string             |2.7.0      |               |蓝牙设备MAC地址|
 |deviceName        |string             |2.7.0      |               |设备蓝牙名称|
 |updatedTime       |number             |2.7.0      |               |设备扫描最后更新时间|
 |isGateway         |boolean            |           |3.1.0          |设备是否为网关设备|  

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
 异步返回智能锁扫描回调结果: [TTLockError](#TTLockError)  

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
#### **3.0.0**  
    1. 增加option传参方式  
