// miniprogram/pages/list/list.js
import { keyList, initialize } from '../../api/api.js';
const plugin = requirePlugin("myPlugin");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    keyList: [],
    wifiList: [],   // wifi列表
    currentGateway: {},   // 当前网关参数
    currentWifi: {},      // 当前使用的wifi
    showInput: false,   // 是否展示wifi密码输入框
    pwd: "",      // wifi密码

    lockList: [],      // 蓝牙扫描锁列表
    state: ''         // 错误提示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    plugin.setShowLog(true);     // 关闭错误日志
    this.modifyKeyList();
  },

  // 更新智能锁列表
  modifyKeyList() {
    keyList().then(res => {
      this.setData({
        keyList: res.list
      })
    }).catch(err => { })
  },

  // 开始扫描附近的智能锁设备
  startScan() {
    /**
     * 调用蓝牙扫描接口，返回lockDevice 和 lockList对象
     * 
     */
    plugin.startScanBleDevice((lockDevice, lockList) => {
      this.setData({
        lockList: lockList,
        state: "正在搜索蓝牙设备"
      })
    }, err => {
      console.log(err)
      this.setData({
        lockList: [],
        state: err.errorMsg
      })
    })
  },

  // 停止蓝牙扫描设备
  stopScan() {
    /**
     * 调用蓝牙停止扫描接口
     * 
     */
    plugin.stopScanBleDevice(res => {
      console.log(res)
      this.setData({
        lockList: [],
        state: "蓝牙设备已停止扫描"
      })
    }, err => {
      console.log(err);
      this.setData({
        lockList: [],
        state: err.errorMsg
      })
    })
  },

  // 开始扫描附近的网关设备
  startScanGateway() {
    /**
     * 调用蓝牙扫描接口，返回lockDevice 和 lockList对象
     * 
     */
    this.setData({
      lockList: [],
      state: "正在搜索蓝牙网关设备"
    })
    plugin.startScanGateway((deviceItem, deviceList) => {
      this.setData({
        lockList: deviceList,
        state: "正在搜索蓝牙网关设备"
      })
    }, err => {
      console.log(err)
      this.setData({
        lockList: [],
        state: err.errorMsg
      })
    })
  },

  // 停止蓝牙扫描网关设备
  stopScanGateway() {
    /**
     * 调用蓝牙停止扫描接口
     * 
     */
    plugin.stopScanGateway(res => {
      this.setData({
        lockList: [],
        state: "蓝牙设备已停止扫描"
      })
    }, err => {
      console.log(err);
      this.setData({
        lockList: [],
        state: err.errorMsg
      })
    })
  },

  stopAll () {
    /**
     * 调用蓝牙停止扫描接口
     * 
     */
    plugin.stopAllOperations().then(res => {
      console.log(res, 1111)
    }).catch(err => {
      console.log(err);
      this.setData({
        lockList: [],
        state: err.errorMsg
      })
    })
  },

  // 初始化蓝牙智能锁
  add(event) {
    const index = event.currentTarget.dataset.index;
    const lockItem = this.data.lockList[index];
    if (lockItem.isGateway) {
      this.addGateway(event);
      return;
    }
    if (!lockItem.isSettingMode) {
      wx.showToast({
        icon: "none",
        title: '智能锁不可添加',
      })
      return;
    }
    // 添加蓝牙锁会自动停止设备检索，但存在一定延迟，可先调用停止扫描后添加锁
    plugin.stopScanBleDevice(res => {
      this.setData({
        lockList: [],
        state: "正在初始化蓝牙智能锁" + lockItem.lockMac
      })
      plugin.getLockVersion(lockItem.lockMac, res => {
        if (res.errorCode === 0) {
          console.log(res)
          setTimeout(() => {
            // 调用添加锁接口
            plugin.initLock(lockItem, res => {
              console.log(res)
              if (res.errorCode === 0) {
                // 设备已成功初始化，请调用开放平台接口上传lockData
                this.setData({
                  state: "设备已成功初始化，正在调用开放平台接口上传lockData"
                })
                initialize({
                  lockData: res.lockData
                }).then(res => {
                  this.modifyKeyList()
                  this.setData({
                    state: "设备已添加"
                  })
                }).catch(err => { })
              } else {
                this.setData({
                  state: "设备初始化失败:" + res.errorMsg
                })
              }
            })
          }, 100)
        }
      })

    })
  },

  // 初始化蓝牙网关
  addGateway(event) {
    const index = event.currentTarget.dataset.index;
    const gatewayItem = this.data.lockList[index];
    if (!gatewayItem.isSettingMode) {
      wx.showToast({
        icon: "none",
        title: '网关不可添加',
      })
      return;
    }
    this.setData({
      lockList: [],
      state: `正在连接蓝牙网关${gatewayItem.MAC}`,
      currentGateway: JSON.parse(JSON.stringify(gatewayItem))
    })
    // 调用添加锁网关
    plugin.connectGateway(gatewayItem, err => {
      console.log("设备已断开连接", err)
    }).then(res => {
      if (res.errorCode === 0) {
        this.setData({
          lockList: [],
          state: `设备已连接，正在搜索WIFI列表`
        })
        plugin.scanWiFiByGateway(gatewayItem, err => {
          console.log("设备已断开连接", err)
        }).then(res => {
          if (res.errorCode === 0) {
            console.log("扫描完成", res)
            this.setData({
              state: `搜索WIFI列表成功`,
              wifiList: res.data.wifiList
            })
          } else {
            this.setData({
              state: `搜索wifi列表失败${res.errorMsg}`,
              wifiList: []
            })
          }
        })
      } else {
        this.setData({
          state: `连接网关失败，${res.errorMsg}`
        })
      }
    })
  },
  ///////// 添加网关参数
  toAddPsd (event) {
    console.log(event, this.data.currentGateway);
    const index = event.currentTarget.dataset.index;
    const wifiItem = this.data.wifiList[index];
    this.setData({
      lockList: [],
      state: `请输入wifi密码--SSID:${wifiItem.SSID}`,
      wifiList: [],
      currentWifi: JSON.parse(JSON.stringify(wifiItem)),
      showInput: true,
      pwd: "", 
    })
  },

  initGateway (event) {
    console.log(this.data.pwd, this.data.currentGateway, this.data.currentWifi);
    const pwd = String(this.data.pwd);
    this.setData({
      state: `正在初始化网关--SSID:${this.data.currentWifi.SSID}--密码：${this.data.pwd}--`,
      showInput: false,
      pwd: "", 
    })
    plugin.initGateway(this.data.currentGateway, {
      SSID: this.data.currentWifi.SSID,
      wifiPwd: pwd,
      uid: wx.getStorageSync("uid"),
      password: wx.getStorageSync("psd"),
      companyId: 0,
      branchId: 0,
      plugName: this.data.currentGateway.deviceName,
      server: "plug.sciener.cn",
      // serverIPAddress: "121.196.45.100",
      port: 2999
    }, err => {
      console.log("设备已断开连接", err)
    }).then(res => {
      if (res.errorCode === 0) {
        console.log("初始化成功", res)
        this.setData({
          state: `初始化网关成功`,
          wifiList: []
        })
      } else {
        this.setData({
          state: `初始化网关失败${res.errorMsg}`,
          wifiList: [],
          lockList: [],
        })
      }
    })
  },

  // 进入锁详情页
  toDetail(event) {
    const index = event.currentTarget.dataset.index;
    const lockItem = this.data.keyList[index];
    wx.setStorageSync('keyInfo', JSON.stringify(lockItem));
    wx.navigateTo({
      url: '../index/index'
    })
  }
})