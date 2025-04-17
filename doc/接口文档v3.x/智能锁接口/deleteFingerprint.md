# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function deleteFingerprint(option: TTLockDeleteFingerprint): Promise<TTLockError>
```  

### 功能描述   
 删除指纹  
 接口仅支持三代智能锁操作  

### 版本支持   
 在线版最低支持版本： **2.0.0**   
 离线版最低支持版本： **1.0.0**  

### 参数说明  
 类型定义：TTLockDeleteFingerprint  
 |PARAMS                |TYPE               |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|-------------------|--------------|----------------|-----------|
 |fingerprintNum        |string             |Y             |IN              |指纹编号|
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
 异步返回操作回调结果: [TTLockError](#TTLockError)  

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
    1. 修改指纹编号传入类型，弱化参数限制  

#### **3.0.0**  
    1. 增加option传参方式  
    2. 取消deviceId参数，降低因设备无法连接造成的失败率  
