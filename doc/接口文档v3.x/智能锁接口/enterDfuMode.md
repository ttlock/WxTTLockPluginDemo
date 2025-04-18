# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function enterDfuMode(option: TTLockEnterDfuMode): Promise<TTLockEnterDfuModeResult>
```  

### 功能描述   
 智能锁固件升级  
 接口仅支持三代智能锁操作，智能锁需已配置5G Telink(泰凌微)蓝牙模块  
 智能锁升级自动同步服务器，但接口内部不自动校准智能锁时间  

### 版本支持   
 在线版最低支持版本： **2.9.0**   
 离线版最低支持版本： **2.0.0**  

### 参数说明  
 类型定义：TTLockEnterDfuMode  
 |PARAMS                |TYPE                           |REQUIRED       |IN/OUT          |DESCRIPTION|
 |----------------------|-------------------------------|---------------|----------------|-----------|
 |dfuPackageInfo        |TTLock.DfuPackageInfo          |Y              |IN              |[固件升级必备信息](TTLockDfuPackageInfo)|
 |lockData              |string                         |Y              |IN              |**管理员**电子钥匙数据|
 |callback              |TTLockEnterDfuModeCallback     |N              |OUT             |[中间步骤回调](#TTLockEnterDfuModeCallback)|
 |disconnectCallback    |TTLockCallback                 |N              |OUT             |[设备断开连接回调](#TTLockCallback)|  

#### <span name="TTLockDfuPackageInfo">固件升级必备信息</span>  
 类型定义：TTLock.DfuPackageInfo  
 |PARAMS                |TYPE           |REQUIRED       |IN/OUT          |DESCRIPTION|
 |----------------------|---------------|---------------|----------------|-----------|
 |clientId              |string         |Y              |IN              |开放平台应用client_id，通过开放平台接口获取|
 |accessToken           |string         |Y              |IN              |用户认证令牌，通过开放平台接口获取|
 |lockId                |number         |Y              |IN              |智能锁ID|  

#### <span name="TTLockEnterDfuModeCallback">中间步骤回调</span>  
 类型定义：TTLockEnterDfuModeCallback  
```
    (result: TTLockEnterDfuModeResult) => any
```  
##### 回调方法参数说明  
 |PARAMS            |TYPE                       |IN/OUT         |DESCRIPTION|
 |------------------|---------------------------|---------------|-----------|
 |result            |TTLockEnterDfuModeResult   |OUT            |[操作中间步骤结果](#TTLockEnterDfuModeResult)|  

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
 异步返回操作回调结果: [TTLockEnterDfuModeResult](#TTLockEnterDfuModeResult)  

#### <span name="TTLockEnterDfuModeResult">固件升级返回结果及中间步骤</span>  
 类型定义：TTLockEnterDfuModeResult, 扩展[TTLockError](#TTLockError), 以下仅列出补充参数   
 |NAME          |TYPE       |VERSION    |DESCRIPTION|
 |--------------|-----------|-----------|-----------|
 |type          |number     |           |结果类型：1 -智能锁升级准备中; 2 -固件升级中(请勿打断); 3 -固件升级完成，正在获取新的所数据; 4 -操作成功; 5 -固件升级成功，但同步服务器失败|
 |progress      |number     |           |固件升级进度|
 |lockData      |string     |           |智能锁更新数据，操作成功后用于上传服务器更新数据，**不可用于蓝牙操作**|  

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
