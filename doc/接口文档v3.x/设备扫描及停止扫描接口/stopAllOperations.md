# 通通锁蓝牙模块通信插件接口  

## 方法  
```
    function stopAllOperations(): Promise<TTLockError>
```  

### 功能描述   
 停止所有蓝牙操作，并强制退出忙碌状态  
 3.0版本：若设备正在执行连接操作，该接口无法打断操作  
 3.1版本：若设备正在执行连接操作，该接口无法停止蓝牙连接，但强制退出忙碌状态，可进行其它蓝牙操作    

### 版本支持   
 在线版最低支持版本： **2.6.0**   
 离线版最低支持版本： **1.6.0**  

### 参数说明  
 void  

### 返回值
 异步返回常规回调结果: [TTLockError](#TTLockError)  

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
    1. 若设备正在执行wx.createBLEConnection接口，该接口将无法打断该操作，但退出忙碌状态

#### **3.0.0**  
    1. 若设备正在执行wx.createBLEConnection接口，该接口将无法打断该操作，返回设备忙碌提示
    2. 接口调用后将清空设备ID及扫描状态，下一次操作蓝牙连接将重新进行设备扫描，操作耗时增加为正常现象  
    
