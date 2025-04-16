# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function getLockVersion(option: TTLockGetVersion | string): Promise<TTLockGetVersionResult>
```  

### 功能描述   
 获取智能锁版本信息  
 接口操作完成后将更新option.deviceFromScan/deviceFromScan参数的lockVersion值  
 设备未初始化时，需摸亮智能锁后操作  

### 版本支持   
 在线版最低支持版本： **2.2.0**   
 离线版最低支持版本： **1.2.0**  

## 参数说明 
 |PARAMS                |TYPE                                   |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|---------------------------------------|--------------|----------------|-----------|
 |option                |[TTLockGetVersion](#TTLockGetVersion)  |Y             |IN,OUT          |初始化蓝牙智能锁全部参数|
 |deviceFromScan        |[TTLockFromScan](#TTLockFromScan)      |Y             |IN,OUT          |扫描到的智能锁信息|
 |macOrLockData         |string                                 |Y             |IN              |智能锁MAC地址或锁数据|
 |disconnectCallback    |[TTLockCallback](#TTLockCallback)      |N             |OUT             |设备断开连接回调|
<br />

### <span name="TTLockInit">初始化蓝牙智能锁全部参数 TTLockInit</span>  
 |PARAMS                |TYPE                               |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|-----------------------------------|--------------|----------------|-----------|
 |deviceFromScan        |[TTLockFromScan](#TTLockFromScan)  |Y             |IN,OUT          |扫描到的智能锁信息|
 |disconnectCallback    |[TTLockCallback](#TTLockCallback)  |N             |OUT             |设备断开连接回调|
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
 |lockVersion       |[TTLockVersion](#TTLockVersion)    |2.7.0      |智能锁版本信息, **操作结束后该参数将更新**|
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
 |groupId               |number       |Y             |应用商ID|
 |orgId                 |number       |Y             |应用商子ID|
 |logoUrl               |string       |N             |LOGO链接|
 |showAdminKbpwdFlag    |boolean      |N             |是否展示管理员密码|
<br />

### <span name="TTLockCallback">设备断开连接 TTLockCallback</span>  
```
(res: TTLockError) => any
```  
#### 回调方法参数说明
 |PARAMS                    |TYPE                           |IN/OUT         |DESCRIPTION|
 |--------------------------|-------------------------------|---------------|-----------|
 |res                       |[TTLockError](#TTLockError)    |OUT            |设备断开连接错误信息|
<br />

## 返回值
 异步返回操作回调结果 [TTLockGetVersionResult](#TTLockGetVersionResult)  
 **接口操作完成后将更新option.deviceFromScan/deviceFromScan参数的lockVersion值**  
<br />

### <span name="TTLockGetVersionResult">获取智能锁版本信息返回结果 TTLockGetVersionResult extends TTLockError</span>  
 返回结果为[TTLockError](#TTLockError)的扩展，以下仅列出补充参数  
 |NAME                          |TYPE                               |VERSION    |DESCRIPTION|
 |------------------------------|-----------------------------------|-----------|-----------|
 |lockVersion                   |[TTLockVersion](#TTLockVersion)    |           |智能锁版本信息|
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
    1. 操作成功不再修改原始传入参数  

#### **3.0.0**  
    1. 增加option传参方式  
    2. 取消deviceId参数，降低因设备无法连接造成的失败率  


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
