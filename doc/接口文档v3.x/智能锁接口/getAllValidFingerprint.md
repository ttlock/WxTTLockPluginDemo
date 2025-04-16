# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function getAllValidFingerprint(option: TTLockGetAllValidFingerprint): Promise<TTLockGetAllValidFingerprintResult>
```  

### 功能描述   
 读取智能锁内全部有效指纹  
 接口仅支持三代智能锁操作  

### 版本支持   
 在线版最低支持版本： **2.8.2**   
 离线版最低支持版本： **1.8.2**  

## 参数说明 
 |PARAMS                |TYPE                                                           |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|---------------------------------------------------------------|--------------|----------------|-----------|
 |option                |[TTLockGetAllValidFingerprint](#TTLockGetAllValidFingerprint)  |Y             |IN              |读取智能锁有效指纹完整参数|
 |lockData              |string                                                         |Y             |IN              |**管理员**电子钥匙数据|
 |disconnectCallback    |[TTLockCallback](#TTLockCallback)                              |N             |OUT             |设备断开连接回调|
<br />

### <span name="TTLockGetAllValidFingerprint">读取智能锁有效指纹完整参数 TTLockGetAllValidFingerprint</span>  
 |PARAMS                |TYPE                               |REQUIRED       |IN/OUT          |DESCRIPTION|
 |----------------------|-----------------------------------|---------------|----------------|-----------|
 |lockData              |string                             |Y              |IN              |**管理员**电子钥匙数据|
 |disconnectCallback    |[TTLockCallback](#TTLockCallback)  |N              |OUT             |设备断开连接回调|
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
 异步返回操作回调结果 [TTLockGetAllValidFingerprintResult](#TTLockGetAllValidFingerprintResult)  
<br />

### <span name="TTLockGetAllValidFingerprintResult">读取智能锁全部有效指纹返回结果 TTLockGetAllValidFingerprintResult extends TTLockError</span>  
 返回结果为[TTLockError](#TTLockError)的扩展，以下仅列出补充参数  
 |NAME              |TYPE                                                       |VERSION    |DESCRIPTION|
 |------------------|-----------------------------------------------------------|-----------|-----------|
 |fingerprintList   |Array<[TTLockValidFingerprint](#TTLockValidFingerprint)>   |           |有效指纹列表|
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

### <span name="TTLockValidFingerprint">智能锁内有效指纹记录信息 TTLockValidFingerprint</span>  
 |NAME          |TYPE           |VERSION    |DESCRIPTION|
 |--------------|---------------|-----------|-----------|
 |fingerprintNo |number         |           |指纹号|
 |startDate     |number         |           |指纹有效期开始时间|
 |endDate       |string         |           |指纹有效期结束时间|
<br />

## 相关链接  
 1. [集成方法](../../../README.md)  
 2. [接口文档](../接口文档.md)  
 3. [版本更新说明](../../版本更新说明.md)  
 4. [错误码说明](../参数声明/错误码.md)  
 5. [常见问题及相关处理方法](../常见问题.md)  

## 版本更新内容  
#### **3.0.0**  
    1. 增加option传参方式  
    2. 取消deviceId参数，降低因设备无法连接造成的失败率  
