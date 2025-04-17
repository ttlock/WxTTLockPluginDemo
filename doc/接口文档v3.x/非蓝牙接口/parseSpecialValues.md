# 通通锁蓝牙模块通信插件接口  

## 方法
```
    function parseSpecialValues(featureValue: string | number): TTLockFeatureValue
```  

### 功能描述   
 解析智能锁特征值  
 
### 版本支持   
 在线版最低支持版本： **2.1.0**   
 离线版最低支持版本： **1.1.0**   
 在线版 **2.4.1** 及其以上版本支持传入featureValue，低版本仅支持specialValue   
 离线版 **1.4.1** 及其以上版本支持传入featureValue，低版本仅支持specialValue   

### 参数说明  
 |PARAMS         |TYPE              |REQUIRED      |IN/OUT          |DESCRIPTION|
 |---------------|------------------|--------------|----------------|-----------|
 |featureValue   |string/number     |Y             |IN              |智能锁特征值(允许传入featureValue或specialValue)|  

### 返回值  
 返回智能锁特征值解析结果: [TTLockFeatureValue](#TTLockFeatureValue)  

#### <span name="TTLockFeatureValue">智能锁特征值解析结果</span>  
 类型定义：[TTLockFeatureValue](../对象类型说明/智能锁.md#TTLockFeatureValue)  
 |NAME                          |TYPE           |VERSION    |DESCRIPTION|
 |------------------------------|---------------|-----------|-----------|
 |passcode                      |boolean        |           |是否支持键盘密码功能|
 |ICCard                        |boolean        |           |是否支持IC卡功能|
 |fingerprint                   |boolean        |           |是否支持指纹功能|
 |wristband                     |boolean        |           |是否支持手环功能|
 |autoLock                      |boolean        |           |是否支持自动闭锁功能|
 |delPasscode                   |boolean        |           |是否支持删除密码功能|
 |updateHardware                |boolean        |2.7.0      |是否支持固件升级功能|
 |mngPasscode                   |boolean        |           |是否支持密码管理功能|
 |locking                       |boolean        |           |指令闭锁|
 |passcodeVisible               |boolean        |           |密码显示或隐藏的控制|
 |gatewayUnlock                 |boolean        |           |远程开锁指令|
 |gatewayFreeze                 |boolean        |           |网关冻结、解冻|
 |cyclePasscode                 |boolean        |           |循环密码|
 |doorSensor                    |boolean        |           |支持门磁|
 |remoteUnlockSwitch            |boolean        |           |远程开锁设置|
 |audioSwitch                   |boolean        |           |支持启用或禁用语音提示管理|
 |NBIoT                         |boolean        |           |支持NB|
 |getAdminPasscode              |boolean        |           |支持读取管理员密码|
 |hotelCard                     |boolean        |           |支持酒店锁卡系统|
 |noClock                       |boolean        |           |锁没有时钟芯片|
 |noBleUnlock                   |boolean        |           |不支持蓝牙开锁|
 |passageMode                   |boolean        |           |支持常开模式|
 |autoLockInPassageMode         |boolean        |           |常开模式下是否支持关闭自动闭锁|
 |wirelessKeypad                |boolean        |           |无线键盘|
 |lightTimeSetting              |boolean        |           |照明灯时间配置|
 |hotelCardBlacklist            |boolean        |           |允许挂失酒店卡|
 |IDCard                        |boolean        |           |身份证|
 |tamperSwitch                  |boolean        |           |防撬开关|
 |resetButton                   |boolean        |           |重置键配置|
 |privacyLock                   |boolean        |           |反锁|
 |deadLock                      |boolean        |           |死锁|
 |passageModeException          |boolean        |2.7.0      |常开模式例外|
 |cyclicCardOrFingerprint       |boolean        |           |支持循环指纹/IC卡|
 |unlockDirection               |boolean        |2.5.0      |支持左右开门设置|
 |fingerVein                    |boolean        |           |支持指静脉|
 |ble5G                         |boolean        |           |支持5G蓝牙|
 |NBAwake                       |boolean        |           |支持NB激活配置|
 |recoverCyclePasscode          |boolean        |2.8.2      |支持循环密码恢复功能|
 |wirelessKeyFob                |boolean        |2.8.2      |支持无线钥匙（遥控）|
 |getAccessoryElectricQuantity  |boolean        |2.8.2      |支持读取配件电量信息|
 |soundVolume                   |boolean        |2.8.2      |支持音量及语言设置|
 |QRCode                        |boolean        |2.8.2      |支持二维码|
 |sensorState                   |boolean        |2.8.2      |支持门磁状态|
 |passageModeAutoUnlock         |boolean        |2.8.2      |支持常开模式自动开锁设置|
 |gatwayFingerprint             |boolean        |2.7.0      |支持指纹下发功能|
 |zhongzhengFingerprint         |boolean        |2.7.0      |支持中正指纹下发|
 |shenyuanFingerprint           |boolean        |2.7.0      |支持晟元指纹下发|
 |wirelessDoorSensor            |boolean        |2.8.2      |支持无线门磁|
 |doorSensorAlert               |boolean        |2.8.2      |支持门未关报警|
 |sensitivity                   |boolean        |2.8.2      |支持接近感应|
 |face                          |boolean        |2.8.2      |支持3D人脸|
 |CPUCard                       |boolean        |2.8.2      |IP支持CPU卡|
 |WIFI                          |boolean        |2.7.6      |支持WIFI锁功能|
 |WifiLockStaticIP              |boolean        |2.8.2      |WiFi锁支持固定IP地址|
 |passcodeKeyNumber             |boolean        |2.8.2      |支持不完整密码锁|
 |twoFactorAuth                 |boolean        |2.8.2      |支持双重认证|
 |catEyeXM                      |boolean        |2.8.2      |支持雄迈可视对讲功能|
 |faceZA                        |boolean        |2.8.2      |支持指安人脸下发|
 |palmVein                      |boolean        |2.8.2      |支持掌静脉|  

## 相关链接  
 1. [集成方法](../../../README.md)  
 2. [接口文档](../接口文档.md)  
 3. [版本更新说明](../../版本更新说明.md)  
 4. [错误码说明](../参数声明/错误码.md)  
 5. [常见问题及相关处理方法](../常见问题.md)  

## 版本更新内容
#### **2.4.1**  
    1. 支持传入featureValue  