# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function controlLock(option: TTLockControl): Promise<TTLockControlResult>
```  

### 功能描述   
 控制智能锁开锁/闭锁  
 接口仅支持三代智能锁操作  
    1. 智能锁开锁成功后将自动校准一次锁时间  
    2. 如因锁时间不正确导致开锁失败，接口内部将进行一次锁时间校准后重新开锁
    3. **梯控开锁**时floorList传入需要点亮的楼层编号列表，**有且至少传入一个楼层编号**，如[1,2,3]，单个楼层编号为[1, 127]**闭区间**的正整数，**非梯控开锁时，该参数不填**  

### 版本支持   
 在线版最低支持版本： **1.0.0**   
 离线版最低支持版本： **1.0.0**  

### 参数说明  
 类型定义：TTLockControl  
 |PARAMS                |TYPE               |REQUIRED   |IN/OUT          |DESCRIPTION|
 |----------------------|-------------------|-----------|----------------|-----------|
 |controlAction         |number             |Y          |IN              |[控制智能锁方式](../参数声明/智能锁参数.md#TTLOCK_CONTROL_TYPE)，3 -开锁, 6 -闭锁|
 |lockData              |string             |Y          |IN              |**管理员**电子钥匙数据|
 |disconnectCallback    |TTLockCallback     |N          |OUT             |设备断开连接回调, 请参考[设备断连回调](#TTLockCallback)|  
 |floorList             |Array<number>      |N          |IN              |梯控开启楼层号列表, **梯控开锁时必传，非梯控开锁时不传**, 取值范围[1, 127], 整数, 不可重复|
 |serverTime            |number             |N          |IN              |服务器时间戳，若不传入该参数，则使用本地时间进行校准|  

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
 异步返回操作回调结果: [TTLockControlResult](#TTLockControlResult)  

#### <span name="TTLockControlResult">控制智能锁返回结果</span>  
 类型定义：TTLockControlResult, 扩展[TTLockError](#TTLockError), 以下仅列出补充参数   
 |NAME              |TYPE       |VERSION    |DESCRIPTION|
 |------------------|-----------|-----------|-----------|
 |uniqueid          |number     |           |控制智能锁记录ID(唯一标识)|
 |lockTime          |number     |           |当前智能锁锁时间戳|
 |controlAction     |number     |           |[控制智能锁方式](../参数声明/智能锁参数.md#TTLOCK_CONTROL_TYPE)，3 -开锁, 6 -闭锁|  

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
    1. 为压缩插件体积，取消在插件内直接获取服务器时间，请通过外部接口获取并传入  
    2. 删除noCorrectAfterUnlock参数

#### **3.0.5**  
    1. 设备断网或弱网时跳过权限验证  

#### **3.0.4**  
    1. 设备操作结束后200ms无操作将主动断开设备连接  

#### **3.0.2(离线版2.0.1)**  
    1. 修复S503智能锁无法正常开锁的问题  
    2. 修改连接方式，取消安卓设备扫描设备的要求  

#### **3.0.0**  
    1. 增加option传参方式  
    2. 取消deviceId参数，降低因设备无法连接造成的失败率  
    3. 允许传入服务器时间戳，通过请求服务器时间进行时间校准
    4. 允许在开锁成功后跳过服务器时间校准，通过外部逻辑自行实现相关操作  