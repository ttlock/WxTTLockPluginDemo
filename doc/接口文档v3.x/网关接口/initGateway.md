# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function initGateway(option: TTLockInitGateway): Promise<TTLockInitGatewayResult>
```  

### 功能描述   
 初始化蓝牙网关  
 若初始化一直超时，可能为本地IP地址配置错误，可尝试使用useDHCP重新添加

### 版本支持   
 在线版最低支持版本： **2.6.0**   
 离线版最低支持版本： **1.6.0**  

### 参数说明  
 类型定义：TTLockInitGateway  
 |PARAMS                |TYPE                   |REQUIRED      |IN/OUT          |DESCRIPTION|
 |----------------------|-----------------------|--------------|----------------|-----------|
 |deviceFromScan        |TTGatewayFromScan      |Y             |IN              |扫描到的网关设备信息, 请参考[蓝牙网关设备扫描值](#TTGatewayFromScan)|
 |disconnectCallback    |TTLockCallback         |N             |OUT             |设备断开连接回调, 请参考[设备断连回调](#TTLockCallback)|
 |configuration         |TTGatewayConfiguration |Y             |IN              |[初始化蓝牙网关配置信息](#TTGatewayConfiguration)|  

#### <span name="TTGatewayFromScan">扫描到的网关设备</span>
 类型定义：[TTGatewayFromScan](../对象类型说明/网关.md#TTGatewayFromScan)  
 |NAME              |TYPE               |VERSION    |DEPRECATED     |DESCRIPTION|
 |------------------|-------------------|-----------|---------------|-----------|
 |deviceType        |number             |2.7.6      |               |[设备类型](../参数声明/设备通用参数.md#TTDEVICE_TYPE)|
 |type              |number             |2.7.0      |               |[网关类型](../参数声明/网关参数.md#TTGATEWAY_TYPE)|
 |deviceId          |string             |           |               |蓝牙广播设备ID, 安卓设备与MAC地址相同，iOS为UUID格式|
 |rssi              |number             |           |               |设备信号值, 0表示该设备已掉线|
 |isSettingMode     |boolean            |           |               |设备是否处于可添加状态|
 |MAC               |string             |2.7.0      |               |蓝牙设备MAC地址|
 |deviceName        |string             |2.7.0      |               |设备蓝牙名称|
 |updatedTime       |number             |2.7.0      |               |设备扫描最后更新时间|
 |isGateway         |boolean            |           |3.1.0          |设备是否为网关设备|  

#### <span name="TTLockCallback">设备断连回调</span>  
 类型定义：TTLockCallback  
```
    (result: TTLockError) => any
```  
##### 回调方法参数说明  
 |PARAMS    |TYPE               |IN/OUT         |DESCRIPTION|
 |----------|-------------------|---------------|-----------|
 |result    |TTLockError        |OUT            |设备断连返回参数信息, 请参考[常规错误返回结果](#TTLockError)|  

#### <span name="TTGatewayConfiguration">初始化蓝牙网关配置信息</span>  
 类型定义：TTGatewayConfiguration  
 |NAME              |TYPE           |REQUIRED       |DESCRIPTION|
 |------------------|---------------|---------------|-----------|
 |type              |number         |Y              |[网关类型](../参数声明/网关参数.md#TTGATEWAY_TYPE)|
 |uid               |number         |Y              |通通锁用户ID，**非开发者账号**|
 |password          |string         |Y              |通通锁用户密码，需MD5加密|
 |companyId         |number         |Y              |公司ID，没有则填0|
 |branchId          |number         |Y              |分店ID, 没有则填0|
 |plugName          |string         |Y              |网关自定义命名，最长50个字符|
 |SSID              |string         |N              |wifi名称，G2网关必传|
 |wifiPwd           |string         |N              |wifi密码，G2网关必传|
 |serverIPAddress   |string         |N              |网关服务器IP地址，serverIPAddress与server至少填写一项|
 |server            |string         |N              |网关服务器域名，serverIPAddress与server至少填写一项，**优先生效**，官方提供参数：**plug.sciener.cn**|
 |port              |number         |Y              |网关服务器端口地址，官方提供参数：**2999**|
 |useLocalIPAddress |boolean        |N              |是否需要配置本地IP地址，仅部分网关支持本地IP地址配置|
 |useDHCP           |boolean        |N              |是否使用DHCP动态配置本地IP地址，useLocalIPAddress为true时生效|
 |ipAddress         |string         |N              |固定IP地址, useDHCP为false时生效|
 |subnetMask        |string         |N              |子网掩码, useDHCP为false时生效|
 |router            |string         |N              |默认网关, useDHCP为false时生效|
 |dns1              |string         |N              |首选DNS, useDHCP为false时生效|
 |dns2              |string         |N              |备用DNS, useDHCP为false时生效|  

### 返回值  
 异步返回智能锁扫描回调结果: [TTLockInitGatewayResult](#TTLockInitGatewayResult)  

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

#### <span name="TTLockInitGatewayResult">初始化蓝牙网关返回结果</span>  
 类型定义：TTLockInitGatewayResult, 扩展[TTLockError](#TTLockError)   
 |NAME              |TYPE                           |VERSION    |DEPRECATED     |DESCRIPTION|
 |------------------|-------------------------------|-----------|---------------|-----------|
 |errorCode         |number                         |           |               |[通通锁常规错误码](../参数声明/错误码.md)|
 |errorMsg          |string                         |           |               |错误信息描述|
 |description       |boolean                        |           |               |错误信息描述补充|
 |electricQuantity  |boolean                        |2.7.0      |               |设备电量|
 |errCode           |number                         |           |3.1.0          |微信蓝牙接口返回错误码|
 |errMsg            |string                         |           |3.1.0          |微信蓝牙错误信息描述|
 |deviceId          |boolean                        |2.7.0      |3.1.0          |蓝牙设备ID|
 |data              |TTGateway.InitResultData       |           |               |初始化蓝牙网关补充参数, 请参考[TTGateway.InitResultData](#TTGatewayInitResultData)|  

#### <span name="TTGatewayInitResultData">初始化蓝牙网关补充参数</span>  
 类型定义：TTGateway.InitResultData   
 |NAME                          |TYPE           |VERSION    |DESCRIPTION|
 |------------------------------|---------------|-----------|-----------|
 |firmware                      |string         |           |固件版本号|
 |hardware                      |string         |           |硬件版本号|
 |modelNum                      |string         |           |模块号|  

## 相关链接  
 1. [集成方法](../../../README.md)  
 2. [接口文档](../接口文档.md)  
 3. [版本更新说明](../../版本更新说明.md)  
 4. [错误码说明](../参数声明/错误码.md)  
 5. [常见问题及相关处理方法](../常见问题.md)  

## 版本更新内容  
#### **3.0.0**  
    1. 增加option传参方式  
