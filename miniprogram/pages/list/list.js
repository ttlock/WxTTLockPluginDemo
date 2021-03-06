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

    lockList: [],      // 蓝牙扫描锁列表
    state: ''         // 错误提示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow (options) {
    plugin.setShowLog(true);     // 关闭错误日志
    this.modifyKeyList();
  },

  // 更新智能锁列表
  modifyKeyList () {
    keyList().then(res => {
      this.setData({
        keyList: res.list
      })
    }).catch(err => {})
  },

  // 开始扫描附近的智能锁设备
  startScan () {
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
  stopScan () {
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

  // 初始化蓝牙智能锁
  add (event) {
    const index = event.currentTarget.dataset.index;
    const lockItem = this.data.lockList[index];
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
        console.log(res)
        if (res.errorCode === 0) {
          //////////////////// 设备复位延迟
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
                }).catch(err => {})
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

  // 进入锁详情页
  toDetail (event) {
    const index = event.currentTarget.dataset.index;
    const lockItem = this.data.keyList[index];
    wx.setStorageSync('keyInfo', JSON.stringify(lockItem));
    wx.navigateTo({
      url: '../index/index'
    })
  }
})