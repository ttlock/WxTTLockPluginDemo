# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function getPassageMode(option: TTLockGetPassageMode): Promise<TTLockGetPassageModeResult>
```  

### 功能描述   
 查询智能锁常开模式配置  
 接口仅支持三代智能锁操作，智能锁需支持常开模式设置  

### 版本支持   
 在线版最低支持版本： **2.8.2**   
 离线版最低支持版本： **1.8.2**  

## 参数说明 
 |PARAMS                |TYPE                                               |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|---------------------------------------------------|--------------|----------------|-----------|
 |option                |[TTLockGetPassageMode](#TTLockGetPassageMode)      |Y             |IN              |完整参数|
 |lockData              |string                                             |Y             |IN              |**管理员**电子钥匙数据|
 |disconnectCallback    |[TTLockCallback](#TTLockCallback)                  |N             |OUT             |设备断开连接回调|
<br />

### <span name="TTLockGetPassageMode">查询常开模式配置完整参数 TTLockGetPassageMode</span>  
 |PARAMS                |TYPE                                               |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|---------------------------------------------------|--------------|----------------|-----------|
 |lockData              |string                                             |Y             |IN              |**管理员**电子钥匙数据|
 |disconnectCallback    |[TTLockCallback](#TTLockCallback)                  |N             |OUT             |设备断开连接回调|
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
 异步返回操作回调结果 [TTLockGetPassageModeResult](#TTLockGetPassageModeResult)  
<br />

### <span name="TTLockGetPassageModeResult">常开模式配置信息查询结果 TTLockGetPassageModeResult extends TTLockError</span>  
 返回结果为[TTLockError](#TTLockError)的扩展，以下仅列出补充参数  
 |NAME                          |TYPE                                                   |VERSION    |DESCRIPTION|
 |------------------------------|-------------------------------------------------------|-----------|-----------|
 |passageModeConfigList         |Array<[TTLockPassageModeData](#TTLockPassageModeData)> |           |常开模式配置信息|
<br />

### <span name="TTLockPassageModeData">常开模式配置信息 TTLockPassageModeData</span>  
 |NAME          |TYPE                                                   |VERSION    |DESCRIPTION|
 |--------------|-------------------------------------------------------|-----------|-----------|
 |type          |[TTLOCK_PASSAGE_WORKMODE](#TTLOCK_PASSAGE_WORKMODE)    |           |智能锁常开工作模式，1 -按周常开, 2 -按月常开|
 |weekOrDay     |number                                                 |           |常开日: 周模式下1-7,表示周一~周日;月模式下1-31,表示常开日期|
 |month         |number                                                 |           |月，保留位|
 |startDate     |number                                                 |           |常开时间开始分钟数|
 |endDate       |number                                                 |           |常开时间结束分钟数|
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

## 固定参数补充说明  
### <span name="TTLOCK_PASSAGE_WORKMODE">TTLOCK_PASSAGE_WORKMODE 常开工作模式</span>  
 [更多信息](../参数声明/智能锁参数.md#TTLOCK_PASSAGE_WORKMODE)  
 |VALUE         |VERSION    |DESCRIPTION|
 |--------------|-----------|-----------|
 |1             |           |按周循环|
 |2             |           |按月循环|
