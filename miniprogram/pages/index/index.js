var plugin = requirePlugin("myPlugin");

Page({
  data: {
    state: '',

    lockList: [],
    initFlag: false,

    lockData: null
  },
  
  onLoad () {
    plugin.setShowLog(false)
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
    // 添加蓝牙锁会自动停止设备检索，但存在一定延迟，可先调用停止扫描后添加锁
    plugin.stopScanBleDevice(res => {
      const index = event.currentTarget.dataset.index;
      const lockItem = this.data.lockList[index];
      this.setData({
        lockList: [],
        state: "正在初始化蓝牙智能锁" + lockItem.lockMac
      })
      /**
       * 调用初始化锁接口 
       * 扫描锁时返回的锁对象 lockItem
       * 锁初始化结果回调 res {
       *   errorMsg:"",       // 错误信息描述
       *   lockData:"",  对应开放锁初始化接口中lockData字段
       *   errorCode: 0       // 错误码， 0 -成功，其它 -失败
       * }
       *
       * 
       */
      plugin.initLock(lockItem, res => {
        console.log(res)
        if (res.errorCode === 0) {
          this.setData({
            state: "设备已成功初始化，请调用开放平台接口上传lockData",
            initFlag: true,
            lockData: JSON.parse(res.lockData)
          })
        } else {
          this.setData({
            state: "设备初始化失败:" + res.errorMsg,
            initFlag: false,
            lockData: null
          })
        }
      })
    })
  },

  // 点击重置蓝牙设备
  clickResetLock () {
    const lockData = this.data.lockData;
     this.setData({
      state: "正在重置智能锁"
    })
    /**
     * 调用重置接口 
     * 结果回调 res {
     *   errorMsg: "",       // 错误信息描述
     *   errorCode: 0        // 错误码， 0 -成功，其它 -失败
     * }
     *
     * 
     */
    plugin.resetLock(lockData.lockMac, 0, lockData.lockVersion, lockData.adminPwd, lockData.lockKey, lockData.lockFlagPos, lockData.aesKeyStr, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: "智能锁已重置",
          initFlag: false
        })
      } else {
        this.setData({
          state: "重置失败:" + res.errorMsg
        })
      }
    })
  },

  toOpenDoor () {
    const lockData = this.data.lockData;
     this.setData({
      state: "正在开启智能锁"
    })
    /**
     * 调用开锁接口 
     * 结果回调 res {
     *   errorMsg:"",       // 错误信息描述
     *   errorCode: 0,       // 错误码， 0 -成功，其它 -失败
     *   lockDate: 锁中当前时间的时间戳   
     *   electricQuantity: 锁电量 范围 0-100
     * }
     *
     * 
     */
    const start = new Date();
    plugin.UnlockBleLock(lockData.lockMac, 0, lockData.lockVersion, new Date(2020, 2, 12).getTime(), new Date(2020, 9, 12).getTime(), lockData.lockKey, lockData.lockFlagPos, lockData.aesKeyStr, lockData.timezoneRawOffset, res => {
      const end = new Date();
      console.log(res,end.getTime() - start.getTime())
      if (res.errorCode === 0) {
        this.setData({
          state: "已开锁"
        })
      } else {
        this.setData({
          state: "开锁失败:" + res.errorMsg
        })
      }
    })
  },

  // 校准锁时间
  toCheckLockTime () {
    const lockData = this.data.lockData;
    this.setData({
      state: "正在校准锁时间"
    })
    /**
     * 调用校准锁时间接口 
     * 结果回调 res {
     *   errorMsg:"",       // 错误信息描述
     *   errorCode: 0,       // 错误码， 0 -成功，其它 -失败
     *   electricQuantity: 锁电量 范围 0-100
     * }
     *
     * 
     */
    plugin.CorrectBleLockTime(lockData.lockMac, 0, lockData.lockVersion, 0, 0, lockData.lockKey, lockData.lockFlagPos, lockData.aesKeyStr, lockData.timezoneRawOffset, new Date(2020, 1, 13).getTime(), res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: "锁时间已校准"
        })
      } else {
        this.setData({
          state: "校准锁时间失败:" + res.errorMsg
        })
      }
    })
  }
})