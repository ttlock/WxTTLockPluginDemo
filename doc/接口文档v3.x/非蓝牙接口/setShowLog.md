# 通通锁蓝牙模块通信插件接口v3.x - setShowLog
[返回接口文档](../../../README.md)
<br />

## 方法
```
function setShowLog(openLog: boolean, callback?: TTLockShowLogCallback): void
```
<br />

## 功能描述
 开启/关闭用户调试日志，允许用户自定义输出方法  
 方法未被调用时，默认不输出操作日志  
 **1.4.1版本开始支持**  
 **离线版1.0.0版本开始支持**  
<br />

## 参数说明
 |PARAMS         |TYPE                                              |REQUIRED      |IN/OUT         |DESCRIPTION|
 |---------------|--------------------------------------------------|--------------|---------------|-----------|
 |openLog        |boolean                                           |Y             |IN           |是否需要输出调试日志，默认false|
 |callback       |[TTLockShowLogCallback](#TTLockShowLogCallback)   |N             |OUT          |自定义日志回调，不传入则在控制台输出日志，openLog为false时不生效|
<br />

### <span name="TTLockShowLogCallback">自定义日志输出回调方法 TTLockShowLogCallback</span>  
```
(...logs: any) => any
```  
#### 回调方法参数说明
 |PARAMS                    |TYPE                                               |IN/OUT          |DESCRIPTION|
 |--------------------------|---------------------------------------------------|----------------|-----------|
 |...logs                   |any                                                |OUT           |输出日志内容|
<br /> 

## 返回值
 void  
<br />

## 版本更新内容
#### **3.0.0**  
    1. 允许用户自定义日志输出方法