# 通通锁蓝牙模块通信插件接口v3.x - finishOperations
[返回接口文档](../../../README.md)  
<br />

## 方法
```
function finishOperations(): Promise<TTLockError>
```  
<br />

## 功能描述
 批量操作结束，关闭蓝牙占用  
 **3.1.0版本开始支持**  
<br />

## 返回值
 异步返回操作回调结果 [TTLockError](#TTLockError)  
<br />

### <span name="TTLockError">TTLockError 常规错误返回结果</span>  
 [更多信息](../对象类型说明/返回对象.md#TTLockError)
 |NAME                          |TYPE                       |VERSION    |DESCRIPTION|
 |------------------------------|---------------------------|-----------|-----------|
 |errorCode                     |[ERROR_CODE](#ERROR_CODE)  |           |通通锁常规错误码|
 |errorMsg                      |string                     |           |错误信息描述|
 |description                   |boolean                    |           |错误信息描述补充|
 |errCode                       |number                     |           |微信蓝牙接口返回错误码|
 |errMsg                        |string                     |           |微信蓝牙错误信息描述|
 |electricQuantity              |boolean                    |2.7.0      |设备电量|
<br />

## 版本更新内容
#### **3.1.0**  
    1. 新增接口  
<br />

## 固定参数补充说明  
### <span name="ERROR_CODE">ERROR_CODE 通通锁错误码</span>  
 [更多信息](../参数声明/错误码.md#ERROR_CODE)  