// import LOCK_DATA from 'a.js'
import { uploadOperations, deleteLock } from './request';
var plugin = requirePlugin("myPlugin");

Page({
  data: {
    state: '',

    lockList: [],
    initFlag: true,
    userData: {},       // 用户登录数据
    keyInfo: {},      // 钥匙数据

    lockData: "",
    fingerprintNum: 0,
    cardNum: 0,
    logList: []
  },
  // 设置初始化参数
  onLoad () {
    plugin.setShowLog(false);     // 关闭错误日志
    const userData = JSON.parse(wx.getStorageSync('userInfo'));
    this.setData({
      userData: userData,
      keyInfo: JSON.parse(wx.getStorageSync('keyInfo'))
    });
  },

  // 点击开锁
  toOpenDoor () {
     this.setData({
      state: "正在开启智能锁"
    })
    const start = new Date();
    // 调用开锁接口
    plugin.controlLock(plugin.CONTROL_ACTION_OPEN, this.data.keyInfo.lockData, res => {
      const end = new Date();
      console.log(res);
      if (res.errorCode === 0) {
        this.setData({
          state: "已开锁--操作时间--" + (end.getTime() - start.getTime())
        })
      } else {
        this.setData({
          state: "开锁失败:" + res.errorMsg
        })
      }
    })
  },

  // 点击闭锁
  toCloseDoor () {
     this.setData({
      state: "正在关闭智能锁"
    })
    const start = new Date();
    // 调用闭锁接口
    plugin.controlLock(plugin.CONTROL_ACTION_CLOSE, this.data.keyInfo.lockData, res => {
      const end = new Date();
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: "已闭锁--操作时间--" + (end.getTime() - start.getTime())
        })
      } else {
        this.setData({
          state: "闭锁失败:" + res.errorMsg
        })
      }
    })
  },

  // 校准锁时间
  toCheckLockTime () {
    this.setData({
      state: "正在校准锁时间"
    })
    // 调用设置锁时间接口，（！！为安全考虑，开锁时间请传入服务器时间）
    plugin.setLockTime(new Date().getTime(), this.data.keyInfo.lockData, res => {
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
  },

  // 点击重置蓝牙设备
  clickResetLock () {
     this.setData({
      state: "正在重置智能锁"
    })
    /**
     * 调用重置接口 
     * 请传入钥匙lockData, 初始化返回的lockData不做任何限制，直接使用调用接口仅适用于本地测试
     * 结果回调 res {
     *   errorMsg: "",       // 错误信息描述
     *   errorCode: 0        // 错误码， 0 -成功，其它 -失败
     * }
     *
     * 
     */
    plugin.resetLock(this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: "智能锁已重置"
        })
        deleteLock({
          "access_token": this.data.userData.access_token,
          "lockId": this.data.keyInfo.lockId
        }, res => {
          console.log(res);
          wx.showToast({
            title: '智能锁已删除',
            complete () {
              wx.navigateBack()
            }
          })
        })
      } else {
        this.setData({
          state: "重置失败:" + res.errorMsg
        })
      }
    })
  },
  


  // 读取操作记录
  toReadRecord () {
    this.setData({
      state: "正在读取锁内操作记录"
    })
    // 获取操作记录
    plugin.getOperationLog(plugin.RECORD_TYPE_NEW, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: "操作记录已获取",
          logList: JSON.parse(res.log)
        })
        uploadOperations({
          "access_token": this.data.userData.access_token,
          "lockId": this.data.keyInfo.lockId,
          "records": res.log
        }, res => {
          console.log(res);
          this.setData({
            state: "操作记录已上传"
          })
        })
      } else {
        this.setData({
          state: "读取操作记录失败:" + res.errorMsg
        })
      }
    })
  },


  // 添加自定义密码
  toGetDIYPasscode () {
    this.setData({
      state: "正在设置自定义密码‘123456’，有效期2020/07/16 12:00 - 2020/12/16 12:00"
    })
    // 添加自定义密码
    plugin.createCustomPasscode("123456", new Date("2020/07/16 12:00").getTime(), new Date("2020/12/16 12:00").getTime(), this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: "自定义密码已添加--密码：" + res.passcode
        })
      } else {
        this.setData({
          state: "自定义密码添加失败:" + res.errorMsg
        })
      }
    })
  },

  // 修改密码
  toModifyPasscode () {
    this.setData({
      state: "正在修改密码‘123456’为‘111111’，新密码有效期2020/07/16 12:00 - 2020/11/16 12:00"
    })
    // 修改密码
    plugin.modifyPasscode("123456", "111111", new Date("2020/07/16 12:00").getTime(), new Date("2020/11/16 12:00").getTime(), this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: "密码已修改"
        })
      } else {
        this.setData({
          state: "密码修改失败:" + res.errorMsg
        })
      }
    })
  },


  // 删除密码
  toDeletePasscode () {
    this.setData({
      state: "正在删除密码‘111111’"
    })
    // 删除密码
    plugin.deletePasscode("111111", this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: "密码已删除"
        })
      } else {
        this.setData({
          state: "密码删除失败:" + res.errorMsg
        })
      }
    })
  },

  // 添加指纹
  toAddFingerprint () {
    const startDate = "2020/07/16 12:00";
    const endDate = "2020/12/16 12:00"
    this.setData({
      state: `正在添加指纹，有效期${startDate} - ${endDate}`
    })
    let totalCount = 0;
    // 添加指纹
    plugin.addFingerprint(new Date(startDate).getTime(), new Date(endDate).getTime(), this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        switch (res.type) {
          case 1: {
            this.setData({
              state: `指纹已添加, 有效期${startDate} - ${endDate}, 指纹号${res.fingerprintNum}`,
              fingerprintNum: res.fingerprintNum
            })
          } break;
          case 2: {
            totalCount = res.totalCount;
            this.setData({
              state: `${res.description}, 请录入指纹, 进度 0/${res.totalCount}`
            })
          } break;
          case 3: {
            this.setData({
              state: `${res.description}, 请录入指纹, 进度 ${res.currentCount}/${totalCount}`
            })
          } break;
          default: {
            this.setData({
              state: '未知错误'
            })
          } break;
        }
      } else {
        this.setData({
          state: "指纹添加失败:" + res.errorMsg
        })
      }
    })
  },

  // 修改指纹
  toModifyFingerprint () {
    const startDate = "2020/07/16 12:00";
    const endDate = "2020/08/16 12:00"
    this.setData({
      state: `正在修改指纹有效期, 有效期${startDate} - ${endDate}, 指纹号${this.data.fingerprintNum}`
    })
    // 修改指纹
    plugin.modifyFingerprintValidityPeriod(new Date(startDate).getTime(), new Date(endDate).getTime(), this.data.fingerprintNum, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: `指纹已修改, 有效期${startDate} - ${endDate}`
        })
      } else {
        this.setData({
          state: "指纹修改失败:" + res.errorMsg
        })
      }
    })
  },

  // 删除指纹
  toDeleteFingerprint () {
    this.setData({
      state: `正在删除指纹, 指纹号${this.data.fingerprintNum}`
    })
    // 删除指纹
    plugin.deleteFingerprint(this.data.fingerprintNum, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: "指纹已删除"
        })
      } else {
        this.setData({
          state: "指纹删除失败:" + res.errorMsg
        })
      }
    })
  },


  // 添加IC卡
  toAddICCard () {
    const startDate = "2020/07/16 12:00";
    const endDate = "2020/12/16 12:00"
    this.setData({
      state: `正在添加IC卡，有效期${startDate} - ${endDate}`
    })
    // 添加IC卡
    plugin.addICCard(new Date(startDate).getTime(), new Date(endDate).getTime(), this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: "IC卡已添加"
        })
        switch (res.type) {
          case 1: {
            this.setData({
              state: `IC卡已添加, 有效期${startDate} - ${endDate}, IC卡号${res.cardNum}`,
              cardNum: res.cardNum
            })
          } break;
          case 2: {
            this.setData({
              state: `${res.description}, 请录入IC卡`
            })
          } break;
          default: {
            this.setData({
              state: '未知错误'
            })
          } break;
        }
      } else {
        this.setData({
          state: "IC卡添加失败:" + res.errorMsg
        })
      }
    })
  },

  // 修改IC卡有效期
  toModifyICCard () {
    const startDate = "2020/07/16 12:00";
    const endDate = "2020/08/16 12:00"
    this.setData({
      state: `正在修改IC卡有效期, 有效期${startDate} - ${endDate}, IC卡号${this.data.cardNum}`
    })
    // 修改IC卡有效期
    plugin.modifyICCardValidityPeriod(new Date(startDate).getTime(), new Date(endDate).getTime(), this.data.cardNum, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: `IC卡有效期已修改, 有效期${startDate} - ${endDate}`
        })
      } else {
        this.setData({
          state: "IC卡有效期修改失败:" + res.errorMsg
        })
      }
    })
  },

  // 删除IC卡
  toDeleteICCard () {
    this.setData({
      state: `正在删除IC卡, IC卡号${this.data.cardNum}`
    })
    // 删除IC卡
    plugin.deleteICCard(this.data.cardNum, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: "IC卡已删除"
        })
      } else {
        this.setData({
          state: "IC卡删除失败:" + res.errorMsg
        })
      }
    })
  },
})