# 通通锁蓝牙模块通信插件接口v3.x - configWifiPowerSavingTime
[返回接口文档](../../../README.md)  
<br />

## 方法
```
function configWifiPowerSavingTime(option: TTLockConfigSavePower): Promise<TTLockError>
```  
<br />

## 功能描述
 设置wifi锁省电模式时间段  
 **3.1.0版本开始支持**  
<br />

## 参数说明 
 |PARAMS                |TYPE                                               |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|---------------------------------------------------|--------------|----------------|-----------|
 |option                |[TTLockConfigSavePower](#TTLockConfigSavePower)    |Y             |IN              |完整参数|
<br />

### <span name="TTLockConfigSavePower">设置wifi锁省电模式时间段完整参数 TTLockConfigSavePower</span>  
 |PARAMS                |TYPE                                               |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|---------------------------------------------------|--------------|----------------|-----------|
 |config                |[TTLock.SavePowerConfig](#TTLockSavePowerConfig)   |Y             |IN              |省电模式时间段配置信息|
 |lockData              |string                                             |Y             |IN              |**管理员**电子钥匙数据|
 |disconnectCallback    |[TTLockCallback](#TTLockCallback)                  |N             |OUT             |设备断开连接回调|
<br />  

### <span name="TTTLockSavePowerConfig">设置wifi锁省电模式时间段完整参数 TTLock.SavePowerConfig</span>  
 |PARAMS                |TYPE           |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|---------------|--------------|----------------|-----------|
 |type                  |number         |Y             |IN              |工作模式，1 -按周|
 |weekDays              |Array<number>  |Y             |IN              |省电模式开启日，传入1-7组成的整数数组，分别表示周一~周日|
 |startDate             |number         |Y             |IN              |开始分钟数|
 |endDate               |number         |Y             |IN              |结束分钟数|
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
 异步返回操作回调结果 [TTLockError](#TTLockError)  
<br />

### <span name="TTLockError">常规错误返回结果 TTLockError</span>  
 [更多信息](../对象类型说明/返回对象.md#TTLockError)
 |NAME                          |TYPE                       |VERSION    |DESCRIPTION|
 |------------------------------|---------------------------|-----------|-----------|
 |errorCode                     |[ERROR_CODE](#ERROR_CODE)  |           |通通锁常规错误码|
 |errorMsg                      |string                     |           |错误信息描述|
 |description                   |boolean                    |           |错误信息描述补充|
 |errCode                       |number                     |           |微信蓝牙接口返回错误码|
 |errMsg                        |string                     |           |微信蓝牙错误信息描述|
 |electricQuantity              |boolean                    |2.7.0      |设备电量|
<br />

## 版本更新内容
#### **3.1.0**  
    1. 新增接口  
<br />

## 固定参数补充说明  
### <span name="ERROR_CODE">ERROR_CODE 通通锁错误码</span>  
 [更多信息](../参数声明/错误码.md#ERROR_CODE)  