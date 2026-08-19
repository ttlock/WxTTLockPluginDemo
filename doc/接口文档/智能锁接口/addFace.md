# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function addFace(option: TTLockAddFace): Promise<TTLockError>
```  

### 功能描述   
 录入人脸，人脸录入完成后自动修改人脸有效期  
 接口仅支持配备人脸模组的三代智能锁操作（智能锁特征值需支持人脸）  

### 版本支持   
 在线版最低支持版本： **3.2.0**   
 离线版最低支持版本： **2.2.0**  

### 参数说明  
 类型定义：TTLockAddFace  
 |PARAMS                |TYPE                       |REQUIRED   |IN/OUT          |DESCRIPTION|
 |----------------------|---------------------------|-----------|----------------|-----------|
 |startDate             |number                     |Y          |IN              |人脸有效期开始时间，生效值精确到分钟|
 |endDate               |number                     |Y          |IN              |人脸有效期结束时间，生效值精确到分钟|
 |lockData              |string                     |Y          |IN              |**管理员**电子钥匙数据|
 |callback              |TTLockAddFaceCallback      |N          |OUT             |中间步骤回调, 请参考[中间步骤回调](#TTLockAddFaceCallback)|
 |disconnectCallback    |TTLockCallback             |N          |OUT             |设备断开连接回调, 请参考[设备断连回调](#TTLockCallback)|  

#### <span name="TTLockAddFaceCallback">中间步骤回调</span>  
 类型定义：TTLockAddFaceCallback  
```
    (result: TTLockError) => any
```  
##### 回调方法参数说明  
 |PARAMS    |TYPE               |IN/OUT         |DESCRIPTION|
 |----------|-------------------|---------------|-----------|
 |result    |TTLockError        |OUT            |操作中间步骤回调, result.data请参考[添加人脸返回结果及中间步骤](#TTLockAddFaceResult)|  

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
 异步返回操作回调结果: [TTLockError](#TTLockError), result.data请参考[添加人脸返回结果及中间步骤](#TTLockAddFaceResult)  

#### <span name="TTLockAddFaceResult">添加人脸返回结果及中间步骤</span>  
 类型定义：TTLockError.data, 扩展[TTLockError](#TTLockError), 以下仅列出data内补充参数   
 |NAME              |TYPE       |VERSION    |DEPRECATED     |DESCRIPTION|
 |------------------|-----------|-----------|---------------|-----------|
 |type              |number     |           |               |结果类型：1-人脸录入完成，操作结束; 2-已进入添加模式，请在设备上录入人脸; 3-录入人脸步骤回调; 4-人脸已录入，正在修改有效期;|
 |faceNumber        |string     |           |               |人脸编号, type为1/4时返回|
 |faceErrorCode     |number     |           |               |人脸采集错误码, type为3时返回, 0表示无异常, 请参考[人脸采集错误码](#TTLockFaceErrorCode)|  

#### <span name="TTLockFaceErrorCode">人脸采集错误码</span>  
 |CODE              |DESCRIPTION|
 |------------------|-----------|
 |0                 |采集正常，无异常|
 |1                 |未检测到人脸|
 |2                 |人脸太靠近上边沿|
 |3                 |人脸太靠近下边沿|
 |4                 |人脸太靠近左边沿|
 |5                 |人脸太靠近右边沿|
 |6                 |人脸距离太远|
 |7                 |人脸距离太近|
 |8                 |眉毛遮挡|
 |9                 |眼睛遮挡|
 |10                |脸部遮挡|
 |11                |录入人脸方向错误|
 |12                |闭眼模式检测到睁眼|
 |13                |闭眼状态|
 |14                |闭眼模式检测中，无法检测到睁闭眼状态|
 |15                |需左转头|
 |16                |需右转头|
 |17                |需抬头|
 |18                |需低头|
 |19                |需向左歪头|
 |20                |需向右歪头|

#### <span name="TTLockError">常规错误返回结果</span>  
 类型定义：[TTLockError](../对象类型说明/返回对象.md#TTLockError)   
 |NAME              |TYPE       |VERSION                |DEPRECATED             |DESCRIPTION|
 |------------------|-----------|-----------------------|-----------------------|-----------|
 |errorCode         |number     |                       |                       |[通通锁常规错误码](../参数声明/错误码.md)|
 |errorMsg          |string     |                       |                       |错误信息描述|
 |description       |boolean    |                       |                       |错误信息描述补充|
 |electricQuantity  |boolean    |2.7.0 & offline-1.7.0  |                       |设备电量|
 |errCode           |number     |                       |3.1.0 & offline-2.1.0  |微信蓝牙接口返回错误码|
 |errMsg            |string     |                       |3.1.0 & offline-2.1.0  |微信蓝牙错误信息描述|
 |deviceId          |boolean    |2.7.0 & offline-1.7.0  |3.1.0 & offline-2.1.0  |蓝牙设备ID|  

## 相关链接  
 1. [集成方法](../../../README.md)  
 2. [接口文档](../接口文档.md)  
 3. [版本更新说明](../../版本更新说明.md)  
 4. [错误码说明](../参数声明/错误码.md)  
 5. [常见问题及相关处理方法](../常见问题.md)  

## 版本更新内容  
#### **3.2.0 & offline-2.2.0**  
    1. 新增接口  
