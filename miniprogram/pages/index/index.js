import { deleteLock, uploadOperation } from '../../api/api.js';
import * as API from '../../api/api.js';
const plugin = requirePlugin("myPlugin");

Page({
  data: {
    state: '',

    keyInfo: {},      // 钥匙数据
    specialValueObj: {},

    fingerprintNum: 0,
    fingerprintId: 0,
    cardNum: 0,
    cardId: 0,
    keyboardPwdId: 0,
    logList: []
  },
  // 设置初始化参数
  onLoad() {
    const keyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
    const specialValueObj = plugin.parseSpecialValues(keyInfo.specialValue);
    console.log(keyInfo)
    this.setData({
      keyInfo: keyInfo,
      specialValueObj: specialValueObj
    });
  },

  // 点击开锁
  toOpenDoor() {
    this.setData({
      state: "正在开启智能锁"
    })
    const start = Date.now();
    // 调用开锁接口
    plugin.controlLock(plugin.CONTROL_ACTION_OPEN, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: `已开锁--操作时间:${Date.now() - start}`
        })
      } else {
        this.setData({
          state: `开锁失败:${res.errorMsg}`
        })
      }
    })
  },

  // 点击闭锁
  toCloseDoor() {
    this.setData({
      state: "正在关闭智能锁"
    })
    const start = Date.now();
    // 调用闭锁接口
    plugin.controlLock(plugin.CONTROL_ACTION_CLOSE, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: `已闭锁--操作时间:${Date.now() - start}`
        })
      } else {
        this.setData({
          state: `闭锁失败:${res.errorMsg}`
        })
      }
    })
  },

  // 校准锁时间
  toCheckLockTime() {
    this.setData({
      state: "正在校准锁时间"
    })
    const start = Date.now();
    // 调用设置锁时间接口，（！！为安全考虑，开锁时间请传入服务器时间）
    plugin.setLockTime(Date.now(), this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: `锁时间已校准--操作时间:${Date.now() - start}`
        })
      } else {
        this.setData({
          state: `校准锁时间失败:${res.errorMsg}`
        })
      }
    })
  },

  // 点击重置蓝牙设备
  clickResetLock() {
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
        // 同步到服务器
        deleteLock({ "lockId": this.data.keyInfo.lockId }).then(res => {
          wx.showToast({
            title: '智能锁已删除',
            complete() {
              setTimeout(() => {
                wx.navigateBack()
              }, 1000);
            }
          })
        }).catch(err => { })
      } else {
        this.setData({
          state: `重置失败:${res.errorMsg}`
        })
      }
    })
  },



  // 读取操作记录
  toReadRecord() {
    this.setData({
      state: "正在读取锁内操作记录"
    })
    const start = Date.now();
    // 获取操作记录
    plugin.getOperationLog(plugin.RECORD_TYPE_NEW, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: `操作记录已获取--操作时间::${Date.now() - start}`,
          logList: JSON.parse(res.log)
        })
        uploadOperation({
          "lockId": this.data.keyInfo.lockId,
          "records": res.log
        }).then(res => {
          this.setData({
            state: "操作记录已上传"
          })
        }).catch(err => { })
      } else {
        this.setData({
          state: "读取操作记录失败:" + res.errorMsg
        })
      }
    })
  },


  // 添加自定义密码
  toGetDIYPasscode() {
    const startDate = new Date().Format("yyyy/MM/dd 00:00");
    const endDate = new Date().Format("yyyy/MM/dd 23:00");
    const passcode = "123456";
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    this.setData({
      state: `正在设置自定义密码‘${passcode}’，有效期${startDate} - ${endDate}`
    })
    const startTime = Date.now();
    // 添加自定义密码
    plugin.createCustomPasscode(passcode, start, end, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: `自定义密码已添加--密码:${res.passcode}--操作时间::${Date.now() - startTime}`
        })
        API.addKeyboardPwd({
          lockId: this.data.keyInfo.lockId,
          keyboardPwd: res.passcode,
          startDate: start,
          endDate: end
        }).then(res => {
          this.setData({
            state: `自定义密码已上传--密码:${passcode}`,
            keyboardPwdId: res.keyboardPwdId
          })
        }).catch(err => { })
      } else {
        this.setData({
          state: `自定义密码添加失败:${res.errorMsg}`
        })
      }
    })
  },

  // 修改密码
  toModifyPasscode() {
    const startDate = new Date(new Date().Format("yyyy/MM/dd 00:00")).getTime();
    const endDate = new Date(new Date().Format("yyyy/MM/dd 23:00")).getTime();
    const passcode = "123456";
    const newPasscode = "111111";
    const start = new Date(startDate + 24 * 3600000).getTime();
    const end = new Date(endDate + 24 * 3600000).getTime();
    this.setData({
      state: `正在修改密码‘${passcode}’为‘${newPasscode}’，新密码有效期${new Date(start).Format('yyyy/MM/dd hh:mm')} - ${new Date(end).Format('yyyy/MM/dd hh:mm')}`
    })
    const startTime = Date.now();
    // 修改密码
    plugin.modifyPasscode(passcode, newPasscode, start, end, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: `密码已修改--旧密码:${passcode}--新密码:${newPasscode}--操作时间::${Date.now() - startTime}`
        })
        API.modifyKeyboardPwd({
          lockId: this.data.keyInfo.lockId,
          keyboardPwdId: this.data.keyboardPwdId,
          newKeyboardPwd: newPasscode,
          startDate: start,
          endDate: end
        }).then(res => {
          this.setData({
            state: `数据已上传--密码:${newPasscode}，新密码有效期${new Date(start).Format('yyyy/MM/dd hh:mm')} - ${new Date(end).Format('yyyy/MM/dd hh:mm')}`
          })
        }).catch(err => { })
      } else {
        this.setData({
          state: `密码修改失败:${res.errorMsg}`
        })
      }
    })
  },


  // 删除密码
  toDeletePasscode() {
    const passcode = "111111";
    this.setData({
      state: `正在删除密码‘${passcode}’`
    })
    const startTime = Date.now();
    // 删除密码
    plugin.deletePasscode(passcode, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: `密码已删除--密码:${passcode}--操作时间::${Date.now() - startTime}`
        })
        API.deleteKeyboardPwd({
          lockId: this.data.keyInfo.lockId,
          keyboardPwdId: this.data.keyboardPwdId
        }).then(res => {
          this.setData({
            state: `删除密码已上传--密码:${passcode}--操作时间::${Date.now() - startTime}`
          })
        }).catch(err => { })
      } else {
        this.setData({
          state: `密码删除失败:${res.errorMsg}`
        })
      }
    })
  },

  // 添加指纹
  toAddFingerprint() {
    const startDate = new Date().Format("yyyy/MM/dd 00:00");
    const endDate = new Date().Format("yyyy/MM/dd 23:00");
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const startTime = Date.now();
    this.setData({
      state: `正在添加指纹，有效期${startDate} - ${endDate}`
    })
    let totalCount = 0;
    // 添加指纹
    plugin.addFingerprint(start, end, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        switch (res.type) {
          case 1: {
            this.setData({
              state: `指纹已添加, 有效期${startDate} - ${endDate}, 指纹号${res.fingerprintNum}, 操作时间:${Date.now() - startTime}`,
              fingerprintNum: res.fingerprintNum
            })
            API.addFingerprint({
              lockId: this.data.keyInfo.lockId,
              fingerprintNumber: res.fingerprintNum,
              startDate: start,
              endDate: end
            }).then(res1 => {
              this.setData({
                state: `指纹已上传--指纹号:${this.data.fingerprintNum}--有效期${startDate} - ${endDate}, 操作时间:${Date.now() - startTime}`,
                fingerprintId: res1.fingerprintId
              })
            }).catch(err => { })
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
  toModifyFingerprint() {
    const startDate = new Date(new Date().Format("yyyy/MM/dd 00:00")).getTime();
    const endDate = new Date(new Date().Format("yyyy/MM/dd 23:00")).getTime();
    const start = new Date(startDate + 24 * 3600000).getTime();
    const end = new Date(endDate + 24 * 3600000).getTime();
    const startTime = Date.now();
    this.setData({
      state: `正在修改指纹有效期, 有效期${new Date(start).Format('yyyy/MM/dd hh:mm')} - ${new Date(end).Format('yyyy/MM/dd hh:mm')}, 指纹号${this.data.fingerprintNum}`
    })
    // 修改指纹
    plugin.modifyFingerprintValidityPeriod(start, end, this.data.fingerprintNum, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: `指纹已修改, 有效期${new Date(start).Format('yyyy/MM/dd hh:mm')} - ${new Date(end).Format('yyyy/MM/dd hh:mm')}, 指纹号${this.data.fingerprintNum}`
        })
        API.modifyFingerprint({
          lockId: this.data.keyInfo.lockId,
          fingerprintId: this.data.fingerprintId,
          startDate: start,
          endDate: end
        }).then(res1 => {
          this.setData({
            state: `指纹修改已上传--指纹号:${this.data.fingerprintNum}--有效期${new Date(start).Format('yyyy/MM/dd hh:mm')} - ${new Date(end).Format('yyyy/MM/dd hh:mm')}, 操作时间:${Date.now() - startTime}`
          })
        }).catch(err => { })
      } else {
        this.setData({
          state: "指纹修改失败:" + res.errorMsg
        })
      }
    })
  },

  // 删除指纹
  toDeleteFingerprint() {
    const startTime = Date.now();
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
        API.deleteFingerprint({
          lockId: this.data.keyInfo.lockId,
          fingerprintId: this.data.fingerprintId
        }).then(res1 => {
          this.setData({
            state: `指纹删除已上传--指纹号:${this.data.fingerprintNum}, 操作时间:${Date.now() - startTime}`
          })
        }).catch(err => { })
      } else {
        this.setData({
          state: "指纹删除失败:" + res.errorMsg
        })
      }
    })
  },


  // 添加IC卡
  toAddICCard() {
    const startDate = new Date().Format("yyyy/MM/dd 00:00");
    const endDate = new Date().Format("yyyy/MM/dd 23:00");
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const startTime = Date.now();
    this.setData({
      state: `正在添加IC卡，有效期${startDate} - ${endDate}`
    })
    // 添加IC卡
    plugin.addICCard(start, end, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        switch (res.type) {
          case 1: {
            this.setData({
              state: `IC卡已添加, 有效期${startDate} - ${endDate}, IC卡号${res.cardNum}`,
              cardNum: res.cardNum
            })
            API.addICCard({
              lockId: this.data.keyInfo.lockId,
              cardNumber: res.cardNum,
              startDate: start,
              endDate: end
            }).then(res1 => {
              this.setData({
                state: `IC卡已上传--卡号:${this.data.cardNum}--有效期${startDate} - ${endDate}, 操作时间:${Date.now() - startTime}`,
                cardId: res1.cardId
              })
            }).catch(err => { })
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
  toModifyICCard() {
    const startDate = new Date(new Date().Format("yyyy/MM/dd 00:00")).getTime();
    const endDate = new Date(new Date().Format("yyyy/MM/dd 23:00")).getTime();
    const start = new Date(startDate + 24 * 3600000);
    const end = new Date(endDate + 24 * 3600000);
    const startTime = Date.now();
    this.setData({
      state: `正在修改IC卡有效期, 有效期${start.Format('yyyy/MM/dd hh:mm')} - ${end.Format('yyyy/MM/dd hh:mm')}, IC卡号${this.data.cardNum}`
    })
    // 修改IC卡有效期
    plugin.modifyICCardValidityPeriod(start.getTime(), end.getTime(), this.data.cardNum, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: `IC卡有效期已修改, 有效期${start.Format('yyyy/MM/dd hh:mm')} - ${end.Format('yyyy/MM/dd hh:mm')}, 操作时间:${Date.now() - startTime}`
        })
        API.modifyICCard({
          lockId: this.data.keyInfo.lockId,
          cardId: this.data.cardId,
          startDate: start.getTime(),
          endDate: end.getTime()
        }).then(res => {
          this.setData({
            state: `IC卡修改已上传--IC卡号:${this.data.cardNum}--有效期${start.Format('yyyy/MM/dd hh:mm')} - ${end.Format('yyyy/MM/dd hh:mm')}, 操作时间:${Date.now() - startTime}`
          })
        }).catch(err => { })
      } else {
        this.setData({
          state: `IC卡有效期修改失败:${res.errorMsg}`
        })
      }
    })
  },

  // 删除IC卡
  toDeleteICCard() {
    const startTime = Date.now();
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
        API.deleteICCard({
          lockId: this.data.keyInfo.lockId,
          cardId: this.data.cardId
        }).then(res1 => {
          this.setData({
            state: `IC卡删除已上传--IC卡号:${this.data.cardNum}, 操作时间:${Date.now() - startTime}`
          })
        }).catch(err => { })
      } else {
        this.setData({
          state: `IC卡删除失败:${res.errorMsg}`
        })
      }
    })
  },

  // 设置远程开关
  toSetRemoteUnlock() {
    this.setData({
      state: this.data.specialValueObj.gatewayUnlock ? `正在关闭远程开关` : '正在开启远程开关'
    })
    // 设置远程开关
    plugin.setRemoteUnlockSwitchState(this.data.specialValueObj.gatewayUnlock ? false : true, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: "远程开关设置成功",
          'keyInfo.specialValue': res.specialValue,
          specialValueObj: plugin.parseSpecialValues(res.specialValue)
        })
        API.updateLockData({
          lockId: this.data.keyInfo.lockId,
          lockData: res.lockData
        }).then(res1 => {
          this.setData({
            state: `特征值已上传--远程开关状态--${plugin.parseSpecialValues(res.specialValue).gatewayUnlock ? '已关闭' : '已开启'}`
          })
        }).catch(err => { })
      } else {
        this.setData({
          state: `远程开关设置失败:${res.errorMsg}`
        })
      }
    })
  },

  // 获取远程开关状态
  toGetRemoteUnlock() {
    this.setData({
      state: `正在获取远程开关状态`
    })
    // 获取远程开关状态
    plugin.getRemoteUnlockSwitchState(this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: `远程开关获取成功，开启状态：${res.enabled ? '已开启' : '已关闭'}`,
          'keyInfo.specialValue': res.specialValue,
          specialValueObj: plugin.parseSpecialValues(res.specialValue)
        })
        API.updateLockData({
          lockId: this.data.keyInfo.lockId,
          lockData: res.lockData
        }).then(res1 => {
          this.setData({
            state: `特征值已上传--远程开关状态--${res.enabled ? '已开启' : '已关闭'}`
          })
        }).catch(err => { })
      } else {
        this.setData({
          state: `远程开关获取失败:${res.errorMsg}`
        })
      }
    })
  },

  // 设置锁开关配置（以重置功能和防撬警报为例)
  toSetLockConfig (event) {
    const lockConfigType = plugin.LockConfigType.RESET_BUTTON | plugin.LockConfigType.TAMPER_ALERT;
    const switchOn = event.target.dataset.switchOn;
    this.setData({
      state: `正在设置锁开关配置--${lockConfigType}--`
    })
    plugin.setLockConfig(lockConfigType, switchOn, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: `设置锁开关配置成功--${lockConfigType}--${switchOn}--`
        })
        ///////////////// DEMO中不展示上传数据，请额外调用接口同步服务器
        // TO DO
      } else {
        this.setData({
          state: "设置锁开关配置失败:" + res.errorMsg
        })
      }
    })  
  },

  // 获取锁开关配置（以重置功能和防撬警报为例)
  toGetLockConfig () {
    const lockConfigType = plugin.LockConfigType.RESET_BUTTON | plugin.LockConfigType.TAMPER_ALERT;
    this.setData({
      state: `正在获取锁开关配置--${lockConfigType}--`
    })
    plugin.getLockConfig(lockConfigType, this.data.keyInfo.lockData, res => {
      console.log(res)
      if (res.errorCode === 0) {
        this.setData({
          state: `获取锁开关配置成功--${JSON.stringify(res)}--`
        })
        ///////////////// DEMO中不展示上传数据，请额外调用接口同步服务器
        // TO DO
      } else {
        this.setData({
          state: "获取锁开关配置失败:" + res.errorMsg
        })
      }
    })  
  },
})