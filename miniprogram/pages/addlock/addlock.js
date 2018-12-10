// miniprogram/pages/addlock/addlock.js
var plugin = requirePlugin("myPlugin");
let mListDataSource = new Array();
let lockParam = require("../../datas/LOCK_PARAM.js");

let platform = '';
let scanDeviceTimer;
let lockVersion;
let unlockTimer;
let lockInfoString;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    lockList: []
  },
  onShow: function () {
    this.setLockList([
        { name: '第一把锁' },
        { name: '第二把锁'}
    ]);
  },
  onLoad: function () {
    platform = wx.getSystemInfoSync().system.split(' ')[0].toLowerCase();
  },

  /**
   * 点击开始扫描 （入口） lockDevice 为扫描到的蓝牙锁对象
   * 
   */
  startScan(){
    let that = this;
    this.setData({
      lockList: []
    });
    that.enableAdapterAndScan();

    /**
      * 注意！！！！!
      * Android 6.0以上 因扫描蓝牙需要位置权限,确保微信已经获取到位置权限之后才能开始    
      * 扫描设备，否则无法扫描到设备 但是目前测试的结果是微信小程序的位置权限 在部分机型上无法让微信直接获取到位置权限，需手动去设置界面开启。
    */
    if (platform == "android") {
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success() {
                console.log("---位置权限开启成功---")
                that.enableAdapterAndScan();
              }
            })
          } else {
            console.log("---位置权限已经授予---")
            that.enableAdapterAndScan();
          }
        }
      })

    } else {
      that.enableAdapterAndScan();
    }
  },

  /**
   * 开启蓝牙适配器并扫描 
   * lockDevice = {
          lockName: "",
          deviceId:"",
          rssi: 0,
          lockMac: "",
          protocolType: 0,
          protocolVersion: 0,
          scene: 0,
          isSettingMode: false,是否是可初始化模式，只有处于可初始化模式才能初始化锁
          electricQuantity: 0,
      }
   */
  enableAdapterAndScan(){
    let that = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        /**
         * 调用蓝牙扫描接口，返回lockDevice对象
         * 
         */
        plugin.startScanBleDevice(function (lockDevice) {
          that.setLockList(lockDevice);
        })
      },
      fail: function (res) {

      }
    });
  },

  /**
   * 执行初始化锁操作 点击添加对象后停止扫描
   */
  add (event) {
    wx.stopBluetoothDevicesDiscovery({});
    let index = event.currentTarget.dataset.index;
    let lockItem = this.data.lockList[index];
    let that = this;
    /**
     * 调用初始化锁接口 
     * 扫描锁时返回的锁对象 lockItem
     * 锁初始化结果回调 initLockResult {
     *   resultCode:0,
         errorMsg:"",
         lockData:"" 对应开放锁初始化接口中lockData字段
     * }
     *
     * 
     */
    plugin.initLock(lockItem, function (initLockResult){
      console.log("---init lock result--" + initLockResult.resultCode + "===lockinfo--" + initLockResult.lockData);
      lockInfoString = initLockResult.lockData;
    });
  },

  /**
   * 设置锁列表
   */
  setLockList (lockItem) {
    let that = this;
    let tempSource = this.data.lockList;
    tempSource.push(lockItem)
    this.setData({
      lockList: tempSource
    });
  },

  /**
   * 测试重置锁数据基于新添加的锁
   */
  clickResetLock(){
    let that = this;
    /**
     * 可以测试新初始化的锁，直接拿锁数据测试重置
     * lockParam = JSON.parse(lockInfoString);
     */
    
    console.log("---重置锁--");

    wx.openBluetoothAdapter({
      success: function (res) {
        if (plugin.getLockType(lockParam.lockVersion) === plugin.LOCK_TYPE_V3 && platform === "android") {
          that.connect2BleLock(lockParam.lockMac);
        } else {
          /** 开启蓝牙设备搜索 **/
          wx.startBluetoothDevicesDiscovery({
            services: [plugin.LOCK_BLE_UUID],
            allowDuplicatesKey: false,
            interval: 0,
            success: function (res) {
              // 搜索设备超时
              scanDeviceTimer = setTimeout(() => {
                wx.stopBluetoothDevicesDiscovery({});

              }, 10000)

              /** 获取设备平台信息android和ios有部分回调表现有差异 **/
              if (platform == "ios") {
                that.scanDeviceForExist(lockParam);
              } else {
                that.scanDeviceForDynamic(lockParam);
              }
            },
            fail: function (res) {

            }
          })
        }
      },
      fail: function (res) {
        
      }
    })
  },

  /**
  * iOS搜索设备该接口回调目前ios有效
  */
  scanDeviceForExist() {
    let that = this;
    wx.onBluetoothDeviceFound(function (res) {
      that.scanForTargetDevice(res);
    })
  },

  /**
   * 搜索设备该接口回调android使用，非三代锁执行
   */
  scanDeviceForDynamic() {
    let that = this
    wx.getBluetoothDevices({
      success: function (res) {
        that.scanForTargetDevice(res);
      },
      fail: function (res) {
        clearTimeout(scanDeviceTimer);
        wx.stopBluetoothDevicesDiscovery({});
        
      }
    })
  },

  /**
   * 搜索设备该接口回调android使用，非三代锁执行
   */
  scanForTargetDevice(res) {
    
    let that = this
    let DeviceArray = res.devices;
    for (let i = 0; i < DeviceArray.length; i++) {
      console.log("----devices==" + DeviceArray[i].name);
      if (plugin.getDeviceMacAddress(DeviceArray[i]) == lockParam.lockMac) {
        console.log("----目标锁已经找到正准备连接==" + DeviceArray[i].name);

        clearTimeout(scanDeviceTimer);
        that.connect2BleLock(DeviceArray[i].deviceId);
        wx.stopBluetoothDevicesDiscovery({});
        return;
      }
    }
  },

  /**
   *  重置锁即可
   */
  connect2BleLock(deviceId) {
    let that = this
    console.log('---开始连接锁--', deviceId,  lockParam.lockVersion,  lockParam.lockKey, lockParam.lockMac, lockParam.aesKeyStr);
    plugin.resetLock(deviceId, lockParam.uid, lockParam.lockVersion, lockParam.adminPwd, lockParam.lockKey, lockParam.lockFlagPos, lockParam.aesKeyStr,
      function (resetResult) {
        console.log("--锁重置结果-code-" + resetResult.resultCode + "==msg==" + resetResult.resultMsg);
      });

  },
  /**
   * 开锁结果回调
   * @params res 开锁返回结果参数
   */
  openDoorResultCallBack(res) {
    console.log('开锁返回结果', res);
    let result = res.success === 1 ?
      '开锁成功' :
      '开锁失败';
  },
  
})