# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function addICCard(option: TTLockAddICCard): Promise<TTLockAddICCardResult>
```  

### 功能描述   
 向智能锁内添加IC卡  
 接口仅支持三代智能锁操作  

### 版本支持   
 在线版最低支持版本： **2.0.0**   
 离线版最低支持版本： **1.0.0**  

## 参数说明 
 |PARAMS                |TYPE                                                   |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|-------------------------------------------------------|--------------|----------------|-----------|
 |option                |[TTLockAddICCard](#TTLockAddICCard)                    |Y             |IN              |全部参数|
 |startDate             |number                                                 |Y             |IN              |IC卡有效期开始时间，生效值精确到分钟|
 |endDate               |number                                                 |Y             |IN              |IC卡有效期结束时间，生效值精确到分钟|
 |lockData              |string                                                 |Y             |IN              |**管理员**电子钥匙数据|
 |callback              |[TTLockAddICCardCallback](#TTLockAddICCardCallback)    |N             |OUT             |中间步骤回调|
<br />

### <span name="TTLockAddICCard">添加IC卡全部参数 TTLockAddICCard</span>  
 |PARAMS                |TYPE                                                   |REQUIRED       |IN/OUT          |DESCRIPTION|
 |----------------------|-------------------------------------------------------|---------------|----------------|-----------|
 |startDate             |number                                                 |Y              |IN              |IC卡有效期开始时间，生效值精确到分钟|
 |endDate               |number                                                 |Y              |IN              |IC卡有效期结束时间，生效值精确到分钟|
 |lockData              |string                                                 |Y              |IN              |**管理员**电子钥匙数据|
 |callback              |[TTLockAddICCardCallback](#TTLockAddICCardCallback)    |N              |OUT             |中间步骤回调|
 |disconnectCallback    |[TTLockCallback](#TTLockCallback)                      |N              |OUT             |设备断开连接回调|
<br />

### <span name="TTLockAddICCardCallback">中间步骤回调 TTLockAddICCardCallback</span>  
```
(result: TTLockAddICCardResult) => any
```  
#### 回调方法参数说明
 |PARAMS            |TYPE                                               |IN/OUT         |DESCRIPTION|
 |------------------|---------------------------------------------------|---------------|-----------|
 |result            |[TTLockAddICCardResult](#TTLockAddICCardResult)    |OUT            |操作中间步骤回调|
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
 异步返回操作回调结果 [TTLockAddICCardResult](#TTLockAddICCardResult)  
<br />

### <span name="TTLockAddICCardResult">添加IC卡返回结果及中间步骤 TTLockAddICCardResult extends TTLockError</span>  
 返回结果为[TTLockError](#TTLockError)的扩展，以下仅列出补充参数  
 |NAME          |TYPE       |VERSION    |DESCRIPTION|
 |--------------|-----------|-----------|-----------|
 |type          |number     |           |结果类型, 1 -IC卡添加完成，操作结束， 2 -已进入添加模式，请在锁上刷卡， 3 -IC卡数据已添加，正在修改有效期|
 |cardNum       |number     |           |IC卡卡号|
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
#### **3.0.0**  
    1. 增加option传参方式  
    2. 取消deviceId参数，降低因设备无法连接造成的失败率  
