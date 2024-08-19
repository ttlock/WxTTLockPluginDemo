# 通通锁蓝牙模块通信插件接口v3.x - getLogType
[返回接口文档](../../../README.md)
<br />

## 方法
```
function getLockType(lockVersion: TTLockVersion): TTLOCK_TYPE
```
<br />

## 功能描述
 解析智能锁版本类型  
 **1.0.0版本开始支持**  
 **离线版1.0.0版本开始支持**  
<br />

## 参数说明
 |PARAMS         |TYPE                                  |REQUIRED      |IN/OUT          |DESCRIPTION|
 |---------------|--------------------------------------|--------------|----------------|-----------|
 |lockVersion    |[TTLockVersion](#TTLockVersion)       |Y             |IN              |智能锁版本信息|
<br />

### <span name="TTLockVersion">智能锁版本信息 TTLockVersion</span>  
[更多信息](../对象类型说明/智能锁.md#TTLockVersion)
 |PARAMS                |TYPE         |REQUIRED      |DESCRIPTION|
 |----------------------|-------------|--------------|-----------|
 |protocolVersion       |number       |Y             |协议版本号|
 |protocolType          |number       |Y             |智能锁协议类型|
 |scene                 |number       |Y             |场景值|
 |groupId               |number       |Y             |应用商ID|
 |orgId                 |number       |Y             |应用商子ID|
 |logoUrl               |string       |N             |LOGO链接|
 |showAdminKbpwdFlag    |boolean      |N             |是否展示管理员密码|
<br />

## 返回值
 智能锁版本类型 [TTLOCK_TYPE](#TTLOCK_TYPE)  
<br />

### <span name="TTLOCK_TYPE">智能锁版本类型 TTLOCK_TYPE</span>  
[更多信息](../参数声明/智能锁参数.md#TTLockVersion)
 |VALUE         |DESCRIPTION|
 |--------------|-----------|
 |5             |三代锁(小程序支持版本)|
 |4             |二代锁场景二(小程序不支持蓝牙操作)|
 |3             |二代锁场景一(小程序不支持蓝牙操作)|
 |1             |车位锁(小程序不支持蓝牙操作)|
 |0             |完全不支持的智能锁|
<br />

## 版本更新内容
#### **3.0.0**  
    1. 解析值增加车位锁