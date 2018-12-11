# WxTTLockPluginDemo 
接入插件参见微信开放平台：https://developers.weixin.qq.com/miniprogram/introduction/plugin.html#插件开发接入流程
# **注意事项**：
所有操作需要保证用户蓝牙开启才可以。扫描操作如果是Android 6.0 及 以上需要微信 拥有位置权限，才能扫描到设备。

# 小程序插件接口使用说明：
## 初始化智能锁
* 步骤1 扫描周边蓝牙设备
startScanBleDevice(callBack) 
callBack返回一个蓝牙锁设备对象
```
wx.openBluetoothAdapter({
   success: function (res) {
     //开启成功才能调用
      /**
      * 注意！！！！!
      * Android 6.0以上 因扫描蓝牙需要位置权限,确保微信已经获取到位置权限之后才能开始    
      * 扫描设备，否则无法扫描到设备 但是目前测试的结果是微信小程序的位置权限 在部分机型上无法让微信直接获取到位置权限，需手动去设置界面开启。
      */
      
      /**
      ** lockDevice = {
          lockName: "",
          deviceId:"",
          rssi: 0, 锁蓝牙信号值
          lockMac: "",锁mac地址
          protocolType: 0,
          protocolVersion: 0,
          scene: 0,
          isSettingMode: false,是否是可初始化模式，只有处于可初始化模式才能初始化锁
          electricQuantity: 0,
      }
      **/
     plugin.startScanBleDevice(function (lockDevice) {
          //lockDevice 为单个蓝牙锁对象
     })
   }
})
```
* 步骤2 选择处于添加模式的锁,非添加模式的锁不能初始化，调用锁初始化接口 plugin.initLock(lockDevice,callBack)
```
   /**
    * 调用初始化锁接口 
    * 扫描锁时返回的锁对象 lockDevice
    * 锁初始化结果回调 
    * initLockResult {
    *   resultCode:, 0失败 1成功
    *   errorMsg:"",
    *   lockData:"" 对应开放平台锁初始化接口中lockData字段
    * }
    */
  if(lockDevice.isSettingMode){
    plugin.initLock(lockDevice, function (initLockResult){
      
    });
  }
  ```
  ## 重置蓝牙锁
  *  扫描周边蓝牙设备，找到需要重置的对象，调用重置接口plugin.resetLock
  ```
   /**
    ** resetLockResult = {
    *   resultCode : , 0失败，1成功
    *   resultMsg:"",
    *  }
   **/
   wx.openBluetoothAdapter({
      success: function (res) {
        if (plugin.getLockType(lockParam.lockVersion) === plugin.LOCK_TYPE_V3 && platform === "android") {
          //可以直接调用重置锁接口
          plugin.resetLock(deviceId, lockParam.uid, lockParam.lockVersion, lockParam.adminPwd, lockParam.lockKey, lockParam.lockFlagPos,            lockParam.aesKeyStr,function (resetLockResult) {

           });
        }else{
          //开启扫描周边设备，找到目标对象，开始连接并重置
          wx.startBluetoothDevicesDiscovery({
            services: [plugin.LOCK_BLE_UUID],
            allowDuplicatesKey: false,
            interval: 0,
            success: function (res) {
               //省略获取周边设备部分代码 是否是目标锁，可以通过锁名也可以通过mac地址，推荐使用mac地址。
               if (plugin.getDeviceMacAddress(DeviceArray[i]) == lockParam.lockMac) {
                 plugin.resetLock（...)
               }else{
               
               }
            }
          }）
        }
      }
   })
  ```
  ### 蓝牙开锁接口 plugin.UnlockBleLock（）
  * 步骤同 重置蓝牙锁 操作  开启蓝牙适配器，如果是Android则可以直连，如果是IOS，则打开扫描。
  ```
  /** UnlockResult = 
   * {
   *  lockDate:锁中当前时间的时间戳 
   *  success:1成功 0失败
   *  errCode:错误码 普通错误 -1，锁可能被重置 10001
   *  errorMsg:错误提示
   *  electricQuantity:锁电量 范围 0-100
   * }
   **/
   wx.openBluetoothAdapter({
      success: function (res) {
        if (plugin.getLockType(lockParam.lockVersion) === plugin.LOCK_TYPE_V3 && platform === "android") {
          //可以直接调用开锁接口
          plugin.UnlockBleLock(deviceId, lockParam.uid, lockParam.lockVersion, lockParam.startDate, lockParam.endDate,lockParam.lockKey, lockParam.lockFlagPos,lockParam.aesKeyStr,keyParams.timezoneRawOffset,function (resetResult) {
          
           });
        }else{
          //开启扫描周边设备，找到目标对象，开始连接并开锁
          wx.startBluetoothDevicesDiscovery({
            services: [plugin.LOCK_BLE_UUID],
            allowDuplicatesKey: false,
            interval: 0,
            success: function (res) {
               //省略获取周边设备部分代码 是否是目标锁，可以通过锁名也可以通过mac地址，推荐使用mac地址。
               if (plugin.getDeviceMacAddress(DeviceArray[i]) == lockParam.lockMac) {
                 plugin.UnlockBleLock（...)
               }else{
               
               }
            }
          }）
        }
      }
   })
  ```
