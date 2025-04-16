# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function setLockSoundWithSoundVolume(option: TTLockSetLockSoundWithSoundVolume): Promise<TTLockError>
```  

### 功能描述   
 设置智能锁音量  
 接口仅支持三代智能锁操作，智能锁需支持音量设置  

### 版本支持   
 在线版最低支持版本： **2.8.4**   
 离线版最低支持版本： **1.8.4**  

## 参数说明 
 |PARAMS                |TYPE                                                                       |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|---------------------------------------------------------------------------|--------------|----------------|-----------|
 |option                |[TTLockSetLockSoundWithSoundVolume](#TTLockSetLockSoundWithSoundVolume)    |Y             |IN              |完整参数|
 |soundVolume           |[TTLOCK_SOUND_VOLUME](#TTLOCK_SOUND_VOLUME)                                |Y             |IN              |智能锁音量设置等级：-1 -开启; 0 -关闭; >=1 音量等级|
 |lockData              |string                                                                     |Y             |IN              |**管理员**电子钥匙数据|
 |disconnectCallback    |[TTLockCallback](#TTLockCallback)                                          |N             |OUT             |设备断开连接回调|
<br />

### <span name="TTLockSetLockSoundWithSoundVolume">设置智能锁音量完整参数 TTLockSetLockSoundWithSoundVolume</span>  
 |PARAMS                |TYPE                                                               |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|-------------------------------------------------------------------|--------------|----------------|-----------|
 |soundVolume           |[TTLOCK_SOUND_VOLUME](#TTLOCK_SOUND_VOLUME)                        |Y             |IN              |智能锁音量设置等级：-1 -开启; 0 -关闭; >=1 音量等级|
 |lockData              |string                                                             |Y             |IN              |**管理员**电子钥匙数据|
 |disconnectCallback    |[TTLockCallback](#TTLockCallback)                                  |N             |OUT             |设备断开连接回调|
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

#### **离线版1.8.6**  
    1. 修复锁声音无法设置为禁用的问题  

## 固定参数补充说明  
### <span name="TTLOCK_SOUND_VOLUME">TTLOCK_SOUND_VOLUME 智能锁音量等级设置</span>  
 [更多信息](../参数声明/智能锁参数.md#TTLOCK_SOUND_VOLUME)  
 |VALUE         |VERSION    |DESCRIPTION|
 |--------------|-----------|-----------|
 |-1            |           |开启锁声音提示|
 |0             |           |关闭锁声音提示|
 |1             |           |一级|
 |2             |           |二级|
 |3             |           |三级|
 |4             |           |四级|
 |5             |           |五级|  
