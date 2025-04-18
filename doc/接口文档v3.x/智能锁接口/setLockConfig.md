# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function setLockConfig(option: TTLockSetLockConfig): Promise<TTLockSetLockConfigResult>
```  

### 功能描述   
 设置智能锁开关设置状态  
 接口仅支持三代智能锁操作  
 **lockConfigType及lockConfigs均不返回智能锁不支持的属性**  
 非wifi锁省电模式开关参数也可设置，请通过特征值进行判断  

### 版本支持   
 在线版最低支持版本： **2.5.0**   
 离线版最低支持版本： **1.5.0**  

### 参数说明  
 类型定义：TTLockSetLockConfig  
 |PARAMS                |TYPE               |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|-------------------|--------------|----------------|-----------|
 |configType            |number             |Y             |IN              |[开关配置属性](#TTLOCK_SWITCH_CONFIG_TYPE)|
 |switchOn              |boolean            |Y             |IN              |是否开启智能锁开关|
 |lockData              |string             |Y             |IN              |**管理员**电子钥匙数据|
 |disconnectCallback    |TTLockCallback     |N             |OUT             |设备断开连接回调, 请参考[设备断连回调](#TTLockCallback)|  

#### <span name="TTLOCK_SWITCH_CONFIG_TYPE">开关配置属性</span>  
 类型定义：[TTLOCK_SWITCH_CONFIG_TYPE](../参数声明/智能锁参数.md#TTLOCK_SWITCH_CONFIG_TYPE)   
 |VALUE         |VERSION    |DESCRIPTION|
 |--------------|-----------|-----------|
 |1             |           |防撬开关|
 |2             |           |长按重置智能锁按键|
 |4             |           |智能锁反锁开关|
 |16            |           |左右开门设置 1 -左开门， 0 -右开门|
 |32            |           |常开模式下自动开锁|
 |128           |3.1.0      |wifi锁省电模式开关，(非wifi锁也支持该参数配置，请通过特征值判断)|  

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
 异步返回操作回调结果: [TTLockSetLockConfigResult](#TTLockSetLockConfigResult)  

#### <span name="TTLockSetLockConfigResult">智能锁开关配置状态设置结果</span>  
 类型定义：TTLockSetLockConfigResult, 扩展[TTLockError](#TTLockError), 以下仅列出补充参数   
 |NAME              |TYPE                                       |VERSION    |DESCRIPTION|
 |------------------|-------------------------------------------|-----------|-----------|
 |lockConfigType    |number                 |           |已开启的[开关配置属性](#TTLOCK_SWITCH_CONFIG_TYPE)|
 |lockConfigs       |TTLock.SwitchConfig    |           |开关配置属性实际开启状态解析数据, [参考信息](#TTLockSwitchConfig)|  

#### <span name="TTLockSwitchConfig">智能锁开关配置状态解析结果</span>  
 类型定义：TTLock.SwitchConfig   
 **未查询或不支持的智能锁属性均不返回**
 **非wifi锁支持wifi省电模式配置，请通过特征值综合判断**  
 |NAME                          |TYPE     |VERSION    |DESCRIPTION|
 |------------------------------|---------|-----------|-----------|
 |tamperAlert                   |boolean  |           |是否打开防撬警报|
 |resetButton                   |boolean  |           |使能/禁用长按重置按键重置智能锁|
 |privacyLock                   |boolean  |           |使能/禁用反锁开关|
 |unlockDirection               |boolean  |           |左右开门设置(true为左开门，false为右开门)|
 |pasageModeAutoUnlockSetting   |boolean  |           |使能/禁用常开模式下自动开锁|
 |wifiPowerSavingMode           |boolean  |3.1.0      |wifi锁省电模式(部分非wifi锁支持该设置，但不生效)|  

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
    1. 增加wifi锁省电模式开关设置  
    2. 返回参数名称调整  

#### **3.0.0**  
    1. 增加option传参方式  
    2. 取消deviceId参数，降低因设备无法连接造成的失败率  