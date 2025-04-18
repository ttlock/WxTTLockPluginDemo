# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function getLockType(lockVersion: TTLockVersion): number
```  

### 功能描述   
 解析智能锁版本类型  

### 版本支持   
 在线版最低支持版本： **1.0.0**   
 离线版最低支持版本： **1.0.0**   

### 参数说明  
 |PARAMS         |TYPE              |REQUIRED      |IN/OUT          |DESCRIPTION|
 |---------------|------------------|--------------|----------------|-----------|
 |lockVersion    |TTLockVersion     |Y             |IN              |[智能锁版本信息](#TTLockVersion)|  

#### <span name="TTLockVersion">智能锁版本信息</span>  
 类型定义：[TTLockVersion](../对象类型说明/智能锁.md#TTLockVersion)  
 |PARAMS                |TYPE         |REQUIRED      |DESCRIPTION|
 |----------------------|-------------|--------------|-----------|
 |protocolVersion       |number       |Y             |协议版本号|
 |protocolType          |number       |Y             |智能锁协议类型|
 |scene                 |number       |Y             |场景值|
 |groupId               |number       |N             |应用商ID|
 |orgId                 |number       |N             |应用商子ID|  

### 返回值  
 返回智能锁版本类型：number

#### <span name="TTLOCK_TYPE">智能锁版本类型</span>  
 类型定义：[TTLOCK_TYPE](../参数声明/智能锁参数.md#TTLOCK_TYPE)  
 |VALUE         |VERSION    |DEPRECATED     |DESCRIPTION|
 |--------------|-----------|---------------|-----------|
 |5             |           |               |三代锁(小程序支持版本)|
 |4             |           |               |二代锁场景二(小程序不支持蓝牙操作)|
 |3             |           |               |二代锁场景一(小程序不支持蓝牙操作)|
 |1             |3.0.0      |               |车位锁(小程序不支持蓝牙操作)|
 |0             |           |               |完全不支持的智能锁|  

## 相关链接  
 1. [集成方法](../../../README.md)  
 2. [接口文档](../接口文档.md)  
 3. [版本更新说明](../../版本更新说明.md)  
 4. [错误码说明](../参数声明/错误码.md)  
 5. [常见问题及相关处理方法](../常见问题.md)  

## 版本更新内容
#### **3.0.0**  
    1. 解析值增加车位锁  