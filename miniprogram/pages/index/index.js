var plugin = requirePlugin("myPlugin");
const keyParams = require("../../datas/KEY_PARAMS.js");
let platform = '';
let scanDeviceTimer = null;
Page({
  data: {
    enable: true,
    state: '请点击按钮开锁'
  },
  onLoad: function() {
    platform = wx.getSystemInfoSync().system.split(' ')[0].toLowerCase();
  },
  /**
   * 转向添加锁界面
   */
  toAddLock () {
    wx.navigateTo({
      url: '../addlock/addlock'
    })
  },

  /**
   * iOS搜索设备该接口回调目前ios有效
   */
  scanDeviceForExist() {
    let that = this;
    wx.onBluetoothDeviceFound(function(res) {
      that.scanForTargetDevice(res);
    })
  },

  /**
   * 搜索设备该接口回调android使用
   */
  scanDeviceForDynamic() {
    let that = this
    wx.getBluetoothDevices({
      success: function(res) {
        that.scanForTargetDevice(res);
      },
      fail: function(res) {
        clearTimeout(scanDeviceTimer);
        wx.stopBluetoothDevicesDiscovery({});
        this.setData({
          state: '搜索不到相关设备',
          enable: true
        });
      }
    })
  },

  /**
   * 搜索设备该接口回调android使用
   */
  scanForTargetDevice(res) {
    this.setData({
      state: '设备搜索中...'
    });
    let that = this
    let DeviceArray = res.devices;
    for (let i = 0; i < DeviceArray.length; i++) {
      console.log("----devices==" + DeviceArray[i].name);
      if (plugin.getDeviceMacAddress(DeviceArray[i]) == keyParams.lockMac) {
        this.setData({
          state: '设备已找到, 正在开锁...'
        });
        clearTimeout(scanDeviceTimer);
        that.connect2BleLock(DeviceArray[i].deviceId);
        wx.stopBluetoothDevicesDiscovery({});
        return;
      }
    }
  },

  /**
   *  开锁接口调用
   */
  connect2BleLock(deviceId) {
    let that = this
    console.log('开锁操作', deviceId, keyParams.uid, keyParams.lockVersion, keyParams.lockKey, keyParams.lockFlagPos, keyParams.aesKeyStr, keyParams.timezoneRawOffset);

    plugin.UnlockBleLock(deviceId, keyParams.uid, keyParams.lockVersion, keyParams.startDate, keyParams.endDate, keyParams.lockKey, keyParams.lockFlagPos, keyParams.aesKeyStr, keyParams.timezoneRawOffset, that.openDoorResultCallBack);
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
    this.setData({
      enable: true,
      state: result
    });
  },

  /**
   * 开启蓝牙适配器等相关操作
   */
  enableBLESetting(){
    let that = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        /**三代锁并且是android 则可以直接连接**/
        if (plugin.getLockType(keyParams.lockVersion) == plugin.LOCK_TYPE_V3 && platform == "android") {
          that.setData({
            state: '正在发起蓝牙直连....'
          });
          that.connect2BleLock(keyParams.lockMac, keyParams);
        }else{
          /** 开启蓝牙设备搜索 **/
          that.setData({
            state: '正在开启蓝牙设备搜索...'
          });
          wx.startBluetoothDevicesDiscovery({
            services: [plugin.LOCK_BLE_UUID],
            allowDuplicatesKey: false,
            interval: 0,
            success: function (res) {
              // 搜索设备超时
              scanDeviceTimer = setTimeout(() => {
                wx.stopBluetoothDevicesDiscovery({});
                that.setData({
                  state: '搜索不到相关设备,停止搜索',
                  enable: true
                })
              }, 10000)

              /** 获取设备平台信息android和ios有部分回调表现有差异 **/
              if (platform == "ios") {
                that.scanDeviceForExist(keyParams);
              } else {
                that.scanDeviceForDynamic(keyParams);
              }
            },
            fail: function (res) {
              that.setData({
                state: '开启蓝牙设备搜索失败',
                enable: true
              })
            }
          })
        }
      },
      fail: function (res) {
        that.setData({
          state: '开启蓝牙设备失败',
          enable: true
        });
      }
    })
  },
  
  /** 
   * 执行开锁操作（入口）
   */
  toOpenDoor() {
    let that = this;
    this.setData({
      enable: false,
      state: '正在开启蓝牙设备'
    });
    that.enableBLESetting();
  }
})