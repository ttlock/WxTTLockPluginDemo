# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function getRemoteUnlockSwitchState(option: TTLockGetRemoteUnlockSwitchState): Promise<TTLockGetRemoteUnlockSwitchStateResult>
```  

### 功能描述   
 查询智能锁远程开关开启状态  
 接口仅支持三代智能锁操作  

### 版本支持   
 在线版最低支持版本： **2.3.0**   
 离线版最低支持版本： **1.3.0**  

### 参数说明  
 类型定义：TTLockGetRemoteUnlockSwitchState  
 |PARAMS                |TYPE               |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|-------------------|--------------|----------------|-----------|
 |lockData              |string             |Y             |IN              |**管理员**电子钥匙数据|
 |disconnectCallback    |TTLockCallback     |N             |OUT             |设备断开连接回调, 请参考[设备断连回调](#TTLockCallback)|  

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
 异步返回操作回调结果: [TTLockGetRemoteUnlockSwitchStateResult](#TTLockGetRemoteUnlockSwitchStateResult)  

#### <span name="TTLockGetRemoteUnlockSwitchStateResult">查询智能锁远程开关开启状态返回结果</span>  
 类型定义：TTLockGetRemoteUnlockSwitchStateResult, 扩展[TTLockError](#TTLockError), 以下仅列出补充参数   
 |NAME              |TYPE       |VERSION    |DEPRECATED     |DESCRIPTION|
 |------------------|-----------|-----------|---------------|-----------|
 |enable            |boolean    |3.1.0      |               |远程开关开启状态|
 |enabled           |boolean    |           |3.1.0          |远程开关开启状态, 3.1.0版本开始更名为enable, 该版本不返回该参数|
 |lockData          |string     |           |               |智能锁更新数据，用于上传服务器，**不可用于智能锁蓝牙操作**|
 |featureValue      |string     |2.3.1      |               |智能锁更新后特征值(完整数据)|
 |specialValue      |number     |           |2.3.1          |智能锁更新后特征值(低位数据，兼容低版本)|  

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
    1. 返回参数名称调整  

#### **3.0.0**  
    1. 增加option传参方式  
    2. 取消deviceId参数，降低因设备无法连接造成的失败率  
    3. 删除无效的lockData返回值  
