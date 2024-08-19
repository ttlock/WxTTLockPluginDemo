# 通通锁蓝牙模块通信插件接口v3.x - controlLock
[返回接口文档](../../../README.md)  
<br />

## 方法
```
function controlLock(option: TTLockControl): Promise<TTLockControlResult>
function controlLock(
    controlAction: TTLOCK_CONTROL_TYPE,
    lockData: string,
    disconnectCallback?: TTLockCallback,
    floorList?: Array<number>
): Promise<TTLockControlResult>
```  
<br />

## 功能描述
 控制智能锁开锁/闭锁  
 接口仅支持三代智能锁操作  
    1. 智能锁开锁成功后将自动校准一次锁时间  
    2. 如因锁时间不正确导致开锁失败，接口内部将进行一次锁时间校准后重新开锁
    3. **梯控开锁**时floorList传入需要点亮的楼层编号列表，**有且至少传入一个楼层编号**，如[1,2,3]，单个楼层编号为[1, 127]**闭区间**的正整数，**非梯控开锁时，该参数不填**
 **1.0.0版本开始支持**  
 **离线版1.0.0版本开始支持**  
 **3.0.0版本支持option调用模式**
<br />

## 参数说明 
 |PARAMS                |TYPE                                           |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|-----------------------------------------------|--------------|----------------|-----------|
 |option                |[TTLockControl](#TTLockControl)                |Y             |IN              |控制智能锁全部参数|
 |controlAction         |[TTLOCK_CONTROL_TYPE](#TTLOCK_CONTROL_TYPE)    |Y             |IN              |控制智能锁方式，3 -开锁, 6 -闭锁|
 |lockData              |string                                         |Y             |IN              |智能锁数据/用户电子钥匙数据|
 |disconnectCallback    |[TTLockCallback](#TTLockCallback)              |N             |OUT             |设备断开连接回调|
 |floorList             |Array<number>                                  |N             |IN              |梯控开启楼层号列表, **梯控开锁时必传，非梯控开锁时不传**, 取值范围[1, 127], 整数|
<br />

### <span name="TTLockControl">控制智能锁全部参数 TTLockControl</span>  
 |PARAMS                |TYPE                                           |REQUIRED   |IN/OUT          |DESCRIPTION|
 |----------------------|-----------------------------------------------|-----------|----------------|-----------|
 |controlAction         |[TTLOCK_CONTROL_TYPE](#TTLOCK_CONTROL_TYPE)    |Y          |IN              |控制智能锁方式，3 -开锁, 6 -闭锁|
 |lockData              |string                                         |Y          |IN              |智能锁数据/电子钥匙数据|
 |disconnectCallback    |[TTLockCallback](#TTLockCallback)              |N          |OUT             |设备断开连接回调|
 |floorList             |Array<number>                                  |N          |IN              |梯控开启楼层号列表, **梯控开锁时必传，非梯控开锁时不传**, 取值范围[1, 127], 整数|
 |serverTime            |number                                         |N          |IN              |服务器时间戳，若不传入该参数，则请求通通锁服务器时间，若获取失败则使用本地时间进行校准|
 |noCorrectAfterUnlock  |boolean                                        |N          |IN              |开锁成功后是否跳过校准锁时间，默认不跳过，如锁时间不正确，将强制校准锁时间|
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
 异步返回操作回调结果 [TTLockControlResult](#TTLockControlResult)  
<br />

### <span name="TTLockControlResult">控制智能锁返回结果 TTLockControlResult extends TTLockError</span>  
 返回结果为[TTLockError](#TTLockError)的扩展，以下仅列出补充参数  
 |NAME              |TYPE                                           |VERSION    |DESCRIPTION|
 |------------------|-----------------------------------------------|-----------|-----------|
 |uniqueid          |number                                         |           |控制智能锁记录ID(唯一标识)|
 |lockTime          |number                                         |           |当前智能锁锁时间戳|
 |controlAction     |[TTLOCK_CONTROL_TYPE](#TTLOCK_CONTROL_TYPE)    |           |控制智能锁方式|
<br />

### <span name="TTLockError">常规错误返回结果 TTLockError</span>  
 [更多信息](../对象类型说明/返回对象.md#TTLockError)
 |NAME                          |TYPE                       |VERSION    |DESCRIPTION|
 |------------------------------|---------------------------|-----------|-----------|
 |errorCode                     |[ERROR_CODE](#ERROR_CODE)  |           |通通锁常规错误码|
 |errorMsg                      |string                     |           |错误信息描述|
 |description                   |boolean                    |           |错误信息描述补充|
 |errCode                       |number                     |           |微信蓝牙接口返回错误码|
 |errMsg                        |string                     |           |微信蓝牙错误信息描述|
 |deviceId                      |boolean                    |2.7.0      |蓝牙设备ID|
 |electricQuantity              |boolean                    |2.7.0      |设备电量|
<br />

## 版本更新内容
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
<br />

## 固定参数补充说明  
### <span name="TTLOCK_CONTROL_TYPE">控制智能锁方式 TTLOCK_CONTROL_TYPE</span>  
 [更多信息](../参数声明/智能锁参数.md#TTLOCK_CONTROL_TYPE)  
 |VALUE         |VERSION    |DESCRIPTION|
 |--------------|-----------|-----------|
 |3             |           |开锁|
 |6             |           |闭锁|
<br />

### <span name="ERROR_CODE">ERROR_CODE 通通锁错误码</span>  
 [更多信息](../参数声明/错误码.md#ERROR_CODE)  
 |VALUE         |VERSION    |DESCRIPTION|
 |--------------|-----------|-----------|
 |-4            |2.9.2      |用户中断操作|
 |-3            |2.6.0      |设备响应超时，通信失败|
 |-2            |2.6.0      |操作未结束，等待下一次操作|
 |-1            |2.6.0      |最后一次回调，断连不再进行设备回调|
 |0             |           |OK (操作成功)|
 |1             |           |设备通信错误，操作失败，请重试(CRC error)|
 |2             |           |非管理员权限，无法操作(Not administrator, has no permission.)|
 |3             |           |管理员校验未通过(Wrong administrator password.)|
 |5             |           |智能锁处于设置状态(lock is in setting mode.)|
 |6             |           |设备未初始化(lock has no administrator.)|
 |7             |           |智能锁不在可初始化状态，请先摸亮锁或重置智能锁(Non-setting mode.)|
 |8             |           |动态码错误(invalid dynamic code.)|
 |10            |           |电池电量低(run out of battery)|
 |11            |           |初始化（重置）键盘密码失败(initialize keyboard password falied.)|
 |13            |           |电子钥匙失效，权重过低(invalid ekey, lock flag position is low.)|
 |14            |           |电子钥匙已过期(ekey expired)|
 |15            |           |密码长度错误，必须为4-9位的数字字符串(invalid password length.)|
 |16            |           |管理员密码与清空码相同(admin super password is same with delete password.)|
 |17            |           |电子钥匙未生效(ekey hasn't become effective.)|
 |18            |           |用户验证未通过，暂无操作权限(user not login)|
 |19            |           |操作失败，未定义的错误或设备不支持相关操作(Failed. Undefined error.)|
 |20            |           |密码已存在，无法添加(password already exists.)|
 |21            |           |密码不存在或未被使用过，无法操作(password not exists or never be used.)|
 |22            |           |存储空间不足(out of memory.)|
 |23            |           |无定义的错误(no defined error.)|
 |24            |           |卡号不存在(Card number not exist.)|
 |26            |           |指纹不存在(Finger print not exist.)|
 |27            |           |无效指令(Invalid command, 智能锁不支持该操作或参数不符合要求)|
 |28            |           |电子钥匙已冻结(lock frozen.)|
 |29            |           |无效字符串, 定制智能锁使用特定vendor, 请核对相关参数(invalid vendor string.)|
 |30            |           |门已反锁(普通用户不允许开锁)|
 |31            |           |记录不存在(record not exist)|
 |36            |2.7.6      |指令已接收，正在处理中, 请稍候|
 |37            |2.7.6      |无效的SSID，智能锁无法使用该网络(WIFI锁配置SSID错误)|
 |38            |2.7.6      |WIFI密码错误|
 |128           |2.6.0      |网关操作失败|
 |129           |2.6.0      |指令已接收，正在处理中, 请稍候（一般不返回）|
 |130           |2.6.0      |无效的SSID，网关无法使用该网络|
 |131           |2.6.0      |WIFI密码错误|
 |132           |2.6.0      |处理已完成（一般不返回）|
 |133           |2.6.0      |无效指令|
 |134           |2.6.0      |指令超时|
 |135           |2.6.0      |设备未插入SIM卡|
 |136           |2.6.0      |设备无法连接网络|
 |10000         |           |钥匙或锁时间不正确|
 |10001         |           |锁可能被重置，请重新添加|
 |10002         |           |设备连接超时，请确认是否在附近或稍后重试|
 |10003         |           |设备已断开连接|
 |10004         |           |数据发送失败，请稍后重试|
 |10005         |           |无效钥匙，请检查钥匙数据是否正确|
 |10006         |           |钥匙数据解析失败，请重试|
 |10007         |           |建立蓝牙连接失败或连接已中断|
 |10008         |           |停止蓝牙扫描失败|
 |10009         |           |不支持的设备类型|
 |10010         |           |锁未进入可添加模式，请先摸亮锁或重置智能锁|
 |10011         |2.7.0      |网关未进入可添加模式，请重新通电后扫描|
 |10012         |2.7.0      |系统蓝牙功能未开启|
 |10013         |2.7.0      |系统蓝牙功能未开启或用户未授权予微信蓝牙权限(iOS)|
 |10014         |2.7.0      |用户未授权予微信蓝牙权限(iOS)|
 |10015         |2.7.0      |用户未授权予微信位置权限(安卓)|
 |10016         |2.7.0      |设备未扫描到可用WIFI|
 |10017         |2.7.0      |设备通信超时未响应|
 |10018         |2.7.0      |蓝牙特征值不存在|
 |10019         |2.7.0      |配置WIFI信息失败，请检查WIFI信息及网络状态(无效的WIFI信息或网络状态差)|
 |10020         |2.7.0      |配置远程服务器失败，请检查服务器配置信息及网络状态|
 |10021         |2.7.0      |设备未响应，请重试|
 |10022         |2.7.6      |操作已中断|
 |10030         |           |启动蓝牙适配器失败|
 |10031         |           |停止设备扫描失败|
 |10032         |           |启用蓝牙特征值监控失败，请重试（蓝牙通信失败）|
 |10033         |           |数据发送失败|
 |10034         |           |设备通信错误(未正确返回数据)|
 |10035         |           |智能锁初始化失败|
 |10036         |           |搜索不到设备，已停止搜索，请确认是否在锁附近或稍后重试|
 |10037         |2.6.0      |正在连接设备，无法中止，请稍候|
 |10038         |2.7.0      |微信基础库版本过低，请升级(需2.19.2及其以上)|
 |10039         |2.9.2      |小程序蓝牙授权未开启(返回后自动跳转小程序授权页面)|
 |11001         |           |设备暂不支持该操作|
 |11002         |2.0.2      |设备或平台不支持蓝牙功能调试|
 |11003         |2.1.0      |参数错误|
 |11004         |2.1.0      |智能锁不支持该功能|
 |11005         |2.1.0      |非管理员用户，无权操作|
 |11006         |2.1.0      |无效的锁数据|
 |11007         |2.1.0      |无效的锁时间|
 |11008         |2.1.0      |无效的楼层编号列表|
 |11009         |2.1.0      |密码为4-9位数字字符串|
 |11010         |2.1.0      |时间不在有效期内|
 |11011         |2.1.1      |结束时间不能早于开始时间|
 |11012         |2.4.0      |无效的酒店信息|
 |11013         |2.4.0      |蓝牙正在操作中，请稍候再试|
 |11014         |2.4.0      |无效的楼栋楼层信息|
 |11101         |2.8.0      |服务器请求失败|