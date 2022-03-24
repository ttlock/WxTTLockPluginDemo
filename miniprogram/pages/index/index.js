import API from "../../api/API";
const plugin = requirePlugin("myPlugin");
let deviceId = "";

Page({
    data: {
        state: '',

        keyInfo: {}, // 钥匙数据
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
        deviceId = "";
        const keyInfo = JSON.parse(wx.getStorageSync('keyInfo'));
        const specialValueObj = plugin.parseSpecialValues(keyInfo.featureValue || keyInfo.specialValue);
        console.log(keyInfo, specialValueObj)
        this.setData({
            keyInfo: keyInfo,
            specialValueObj: specialValueObj
        });
    },

    // 点击开锁
    toOpenDoor() {
        wx.showLoading({
            title: "正在开启智能锁",
        })
        const start = Date.now();
        // 调用开锁接口
        plugin.controlLock(plugin.ControlAction.OPEN, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("获取版本信息时设备连接已断开", res)
            }
        }, null, deviceId).then(res => {
            wx.hideLoading({});
            console.log(res)
            if (!!res.deviceId) deviceId = res.deviceId;
            if (res.errorCode === 0) {
                this.setData({
                    state: `已开锁--操作时间:${Date.now() - start}ms.`
                })
            } else {
                this.setData({
                    state: `开锁失败: ${res.errorMsg}`
                })
            }
        })
    },

    // 点击闭锁
    toCloseDoor() {
        wx.showLoading({
            title: "正在关闭智能锁",
        })
        const start = Date.now();
        // 调用闭锁接口
        plugin.controlLock(plugin.ControlAction.CLOSE, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("获取版本信息时设备连接已断开", res)
            }
        }, null, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    state: `已闭锁--操作时间: ${Date.now() - start}ms.`
                })
            } else {
                this.setData({
                    state: `闭锁失败: ${res.errorMsg}`
                })
            }
        })
    },

    // 校准锁时间
    toCheckLockTime() {
        wx.showLoading({
            title: "正在校准锁时间",
        })
        const start = Date.now();
        // 调用设置锁时间接口，（！！为安全考虑，开锁时间请传入服务器时间）
        // 2.7.0版本开始，开锁接口成功后自动校准本地锁时间
        plugin.setLockTime(Date.now(), this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("获取版本信息时设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    state: `锁时间已校准--操作时间:${Date.now() - start}ms`
                })
            } else {
                this.setData({
                    state: `校准锁时间失败:${res.errorMsg}`
                })
            }
        }, deviceId)
    },

    // 点击重置蓝牙设备
    clickResetLock() {
        wx.showLoading({
            title: "正在重置智能锁",
        })
        /**
         * 调用重置接口 
         * 请传入钥匙lockData, 初始化返回的lockData不做任何限制，直接使用调用接口仅适用于本地测试
         */
        plugin.resetLock(this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    state: "智能锁已重置，正在同步服务器"
                })
                // 同步到服务器
                API.deleteLock({
                    lockId: this.data.keyInfo.lockId
                }).then(res => {
                    if (!!res) {
                        wx.showToast({
                            icon: "none",
                            title: '智能锁已删除',
                            complete() {
                                setTimeout(() => {
                                    wx.navigateBack();
                                }, 1000);
                            }
                        })
                    } else {
                        this.setData({
                            state: "同步服务器失败，锁已重置"
                        })
                    }
                })
            } else {
                this.setData({
                    state: `重置失败: ${res.errorMsg}`
                })
            }
        })
    },



    // 读取操作记录
    toReadRecord(event) {
        let type = event.currentTarget.dataset.type === 1 ? plugin.RecordReadType.ALL : plugin.RecordReadType.NEW;
        wx.showLoading({
            title: `正在读取锁内操作记录`,
        })
        this.setData({
            state: `正在读取锁内操作记录--方式：${type === plugin.RecordReadType.ALL ? "全部" : "最新"}`
        })
        const start = Date.now();
        // 获取操作记录
        plugin.getOperationLog(type, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    state: `操作记录已获取--操作时间::${Date.now() - start}`,
                    logList: JSON.parse(res.log)
                })
                API.uploadOperation({
                    "lockId": this.data.keyInfo.lockId,
                    "records": res.log
                }).then(res => {
                    if (!!res) {
                        this.setData({
                            state: "操作记录已上传"
                        })
                    } else {
                        this.setData({
                            state: "操作记录上传失败"
                        })
                    }
                })
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
        wx.showLoading({
            title: `正在设置自定义密码`,
        })
        this.setData({
            state: `正在设置自定义密码‘${passcode}’，有效期${startDate} - ${endDate}`
        })
        const startTime = Date.now();
        // 添加自定义密码
        plugin.createCustomPasscode(passcode, start, end, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
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
                    if (!!res) {
                        this.setData({
                            state: `自定义密码已上传--密码:${passcode}`,
                            keyboardPwdId: res.keyboardPwdId
                        })
                    } else {
                        this.setData({
                            state: `自定义密码添加失败`
                        })
                    }
                })
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
        wx.showLoading({
            title: `正在修改密码`,
        })
        this.setData({
            state: `正在修改密码‘${passcode}’为‘${newPasscode}’，新密码有效期${new Date(start).Format('yyyy/MM/dd hh:mm')} - ${new Date(end).Format('yyyy/MM/dd hh:mm')}`
        })
        const startTime = Date.now();
        // 修改密码
        plugin.modifyPasscode(passcode, newPasscode, start, end, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
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
                    if (!!res) {
                        this.setData({
                            state: `数据已上传--密码:${newPasscode}，新密码有效期${new Date(start).Format('yyyy/MM/dd hh:mm')} - ${new Date(end).Format('yyyy/MM/dd hh:mm')}`
                        })
                    } else {
                        this.setData({
                            state: `密码修改失败`
                        })
                    }
                })
            } else {
                this.setData({
                    state: `密码修改失败:${res.errorMsg}`
                })
            }
        }, deviceId)
    },


    // 删除密码
    toDeletePasscode() {
        const passcode = "111111";
        wx.showLoading({
            title: "正在删除密码",
        })
        this.setData({
            state: `正在删除密码‘${passcode}’`
        })
        const startTime = Date.now();
        // 删除密码
        plugin.deletePasscode(passcode, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    state: `密码已删除--密码:${passcode}--操作时间::${Date.now() - startTime}`
                })
                API.deleteKeyboardPwd({
                    lockId: this.data.keyInfo.lockId,
                    keyboardPwdId: this.data.keyboardPwdId
                }).then(res => {
                    if (!!res) {
                        this.setData({
                            state: `删除密码已上传--密码:${passcode}--操作时间::${Date.now() - startTime}`
                        })
                    } else {
                        this.setData({
                            state: `密码删除失败`
                        })
                    }
                })
            } else {
                this.setData({
                    state: `密码删除失败:${res.errorMsg}`
                })
            }
        }, deviceId)
    },

    // 添加指纹
    toAddFingerprint() {
        const startDate = new Date().Format("yyyy/MM/dd 00:00");
        const endDate = new Date().Format("yyyy/MM/dd 23:00");
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const startTime = Date.now();
        wx.showLoading({
            title: "正在添加指纹",
        })
        this.setData({
            state: `正在添加指纹，有效期${startDate} - ${endDate}`
        })
        let totalCount = 0;
        // 添加指纹
        plugin.addFingerprint(start, end, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            } else if (res.errorCode === 0) {
                console.log(res)
                switch (res.type) {
                    case 1: break;
                    case 2:
                        {
                            totalCount = res.totalCount;
                            this.setData({
                                state: `${res.description}, 请录入指纹, 进度 0/${res.totalCount}`
                            })
                        }
                        break;
                    case 3:
                        {
                            this.setData({
                                state: `${res.description}, 请录入指纹, 进度 ${res.currentCount}/${totalCount}`
                            })
                        }
                        break;
                    default:
                        {
                            this.setData({
                                state: '未知错误'
                            })
                        }
                        break;
                }
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
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
                    if (!!res1) {
                        this.setData({
                            state: `指纹已上传--指纹号:${this.data.fingerprintNum}--有效期${startDate} - ${endDate}, 操作时间:${Date.now() - startTime}`,
                            fingerprintId: res1.fingerprintId
                        })
                    } else {
                        this.setData({
                            state: `同步服务器失败，指纹已添加`
                        })
                    }
                })
            } else {
                this.setData({
                    state: "指纹添加失败:" + res.errorMsg
                })
            }
        }, deviceId)
    },

    // 修改指纹
    toModifyFingerprint() {
        const startDate = new Date(new Date().Format("yyyy/MM/dd 00:00")).getTime();
        const endDate = new Date(new Date().Format("yyyy/MM/dd 23:00")).getTime();
        const start = new Date(startDate + 24 * 3600000).getTime();
        const end = new Date(endDate + 24 * 3600000).getTime();
        const startTime = Date.now();
        wx.showLoading({
            title: "正在修改指纹有效期",
        })
        this.setData({
            state: `正在修改指纹有效期, 有效期${new Date(start).Format('yyyy/MM/dd hh:mm')} - ${new Date(end).Format('yyyy/MM/dd hh:mm')}, 指纹号${this.data.fingerprintNum}`
        })
        // 修改指纹
        plugin.modifyFingerprintValidityPeriod(start, end, this.data.fingerprintNum, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
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
                    if (!!res1) {
                        this.setData({
                            state: `指纹修改已上传--指纹号:${this.data.fingerprintNum}--有效期${new Date(start).Format('yyyy/MM/dd hh:mm')} - ${new Date(end).Format('yyyy/MM/dd hh:mm')}, 操作时间:${Date.now() - startTime}`
                        })
                    } else {
                        this.setData({
                            state: `同步服务器失败，指纹已修改`
                        })
                    }
                })
            } else {
                this.setData({
                    state: "指纹修改失败:" + res.errorMsg
                })
            }
        }, deviceId)
    },

    // 删除指纹
    toDeleteFingerprint() {
        const startTime = Date.now();
        wx.showLoading({
            title: "正在删除指纹",
        })
        this.setData({
            state: `正在删除指纹, 指纹号${this.data.fingerprintNum}`
        })
        // 删除指纹
        plugin.deleteFingerprint(this.data.fingerprintNum, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    state: "指纹已删除"
                })
                API.deleteFingerprint({
                    lockId: this.data.keyInfo.lockId,
                    fingerprintId: this.data.fingerprintId
                }).then(res1 => {
                    if (!!res1) {
                        this.setData({
                            state: `指纹删除已上传--指纹号:${this.data.fingerprintNum}, 操作时间:${Date.now() - startTime}`
                        })
                    } else {
                        this.setData({
                            state: `同步服务器失败，指纹已删除`
                        })
                    }
                })
            } else {
                this.setData({
                    state: "指纹删除失败:" + res.errorMsg
                })
            }
        }, deviceId)
    },


    // 添加IC卡
    toAddICCard() {
        const startDate = new Date().Format("yyyy/MM/dd 00:00");
        const endDate = new Date().Format("yyyy/MM/dd 23:00");
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const startTime = Date.now();
        wx.showLoading({
            title: "正在添加IC卡",
        })
        this.setData({
            state: `正在添加IC卡，有效期${startDate} - ${endDate}`
        })
        plugin.addICCard(start, end, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            } else if (res.errorCode === 0) {
                console.log(res)
                switch (res.type) {
                    case 1: break;
                    case 2:
                        {
                            this.setData({
                                state: `${res.description}, 请录入IC卡`
                            })
                        }
                        break;
                    default:
                        {
                            this.setData({
                                state: '未知错误'
                            })
                        }
                        break;
                }
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
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
                    if (!!res1) {
                        this.setData({
                            state: `IC卡已上传--卡号:${this.data.cardNum}--有效期${startDate} - ${endDate}, 操作时间:${Date.now() - startTime}`,
                            cardId: res1.cardId
                        })
                    } else {
                        this.setData({
                            state: `同步服务器失败，IC卡已添加`
                        })
                    }
                })
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
        wx.showLoading({
            title: "正在修改IC卡有效期",
        })
        this.setData({
            state: `正在修改IC卡有效期, 有效期${start.Format('yyyy/MM/dd hh:mm')} - ${end.Format('yyyy/MM/dd hh:mm')}, IC卡号${this.data.cardNum}`
        })
        // 修改IC卡有效期
        plugin.modifyICCardValidityPeriod(start.getTime(), end.getTime(), this.data.cardNum, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
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
                    if (!!res) {
                        this.setData({
                            state: `IC卡修改已上传--指纹号:${this.data.cardNum}--有效期${start.Format('yyyy/MM/dd hh:mm')} - ${end.Format('yyyy/MM/dd hh:mm')}, 操作时间:${Date.now() - startTime}`
                        })
                    } else {
                        this.setData({
                            state: `同步服务器失败，IC卡已修改`
                        })
                    }
                })
            } else {
                this.setData({
                    state: `IC卡有效期修改失败:${res.errorMsg}`
                })
            }
        }, deviceId)
    },

    // 删除IC卡
    toDeleteICCard() {
        const startTime = Date.now();
        wx.showLoading({
            title: "正在删除IC卡",
        })
        this.setData({
            state: `正在删除IC卡, IC卡号${this.data.cardNum}`
        })
        // 删除IC卡
        plugin.deleteICCard(this.data.cardNum, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    state: "IC卡已删除"
                })
                API.deleteICCard({
                    lockId: this.data.keyInfo.lockId,
                    cardId: this.data.cardId
                }).then(res1 => {
                    if (!!res1) {
                        this.setData({
                            state: `IC卡删除已上传--IC卡号:${this.data.cardNum}, 操作时间:${Date.now() - startTime}`
                        })
                    } else {
                        this.setData({
                            state: `同步服务器失败，IC卡已删除`
                        })
                    }
                })
            } else {
                this.setData({
                    state: `IC卡删除失败:${res.errorMsg}`
                })
            }
        }, deviceId)
    },


    // 通过卡号恢复IC卡
    toRecoverICCard() {
        const startDate = new Date().Format("yyyy/MM/dd 00:00");
        const endDate = new Date().Format("yyyy/MM/dd 23:00");
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const startTime = Date.now();
        wx.showLoading({
            title: "正在恢复IC卡",
        })
        this.setData({
            state: `正在恢复IC卡, IC卡号${this.data.cardNum}`
        })
        // 恢复IC卡
        plugin.recoverICCardNumber(this.data.cardNum, start, end, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    state: "IC卡已恢复"
                })
                API.addICCard({
                    lockId: this.data.keyInfo.lockId,
                    cardNumber: this.data.cardNum,
                    startDate: start,
                    endDate: end
                }).then(res1 => {
                    if (!!res1) {
                        this.setData({
                            state: `IC卡已上传--卡号:${this.data.cardNum}--有效期${startDate} - ${endDate}, 操作时间:${Date.now() - startTime}`,
                            cardId: res1.cardId
                        })
                    } else {
                        this.setData({
                            state: `同步服务器失败，IC卡已恢复`
                        })
                    }
                })
            } else {
                this.setData({
                    state: `IC卡恢复失败:${res.errorMsg}`
                })
            }
        }, deviceId)
    },

    // 设置远程开关
    toSetRemoteUnlock() {
        wx.showLoading({
            title: this.data.specialValueObj.gatewayUnlock ? `正在关闭远程开关` : '正在开启远程开关',
        })
        // 设置远程开关
        plugin.setRemoteUnlockSwitchState(this.data.specialValueObj.gatewayUnlock ? false : true, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
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
                    if (!!res1) {
                        this.setData({
                            state: `特征值已上传--远程开关状态--${plugin.parseSpecialValues(res.specialValue).gatewayUnlock ? '已关闭': '已开启'}`
                        })
                    } else {
                        this.setData({
                            state: `同步服务器失败，锁数据已更新`
                        })
                    }
                })
            } else {
                this.setData({
                    state: `远程开关设置失败:${res.errorMsg}`
                })
            }
        }, deviceId)
    },

    // 获取远程开关状态
    toGetRemoteUnlock() {
        wx.showLoading({
            state: `正在获取远程开关状态`
        })
        // 获取远程开关状态
        plugin.getRemoteUnlockSwitchState(this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
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
                    if (!!res1) {
                        this.setData({
                            state: `特征值已上传--远程开关状态--${res.enabled ? '已开启' : '已关闭'}`
                        })
                    } else {
                        this.setData({
                            state: `同步服务器失败，锁数据已更新`
                        })
                    }
                })
            } else {
                this.setData({
                    state: `远程开关获取失败:${res.errorMsg}`
                })
            }
        }, deviceId)
    },

    // 设置酒店信息
    toSetHotelData() {
        API.getHotelInfo().then(res => {
            if (!!res) {
                const buildingNumber = 8;
                const floorNumber = 0;
                wx.showLoading({
                    state: `正在设置酒店信息`
                })
                this.setData({
                    state: `正在设置酒店信息--hotelInfo:${res.hotelInfo}--楼栋号:${buildingNumber}--楼层号:${floorNumber}--`
                })
                let hotelInfo = "LTMsLTEsLTUsLTMwLC04NiwtMywtMywtNywtMiwtMiwtNCwtMSwtMSwtOSwtMTAsLTg4LC0zMCwtODEsLTg0LC04OCwtOCwtODgsLTYsLTg2LC0xLC04NiwtMSwtNiwtODMsLTMsLTg0LC05LC0xLC0xLC04OCwtNSwtMTAsLTksLTYsLTEsLTg4LC05LC0zLC04NSwtNywtNiwtODEsLTYsLTg1LC0zMCwtNCwtNywtNiwtOCwtMTAsLTIsLTksLTksMTQ=";
                // 调用设置酒店信息参数
                plugin.setHotelData({
                    // hotelInfo: res.hotelInfo,
                    // buildingNumber: buildingNumber,
                    // floorNumber: floorNumber,
                    hotelInfo: hotelInfo,
                    buildingNumber: buildingNumber,
                    floorNumber: floorNumber,
                }, this.data.keyInfo.lockData, res => {
                    if (res.errorCode === 10003) {
                        console.log("监控到设备连接已断开", res)
                    }
                }, deviceId).then(res => {
                    wx.hideLoading({});
                    if (!!res.deviceId) deviceId = res.deviceId;
                    console.log(res)
                    if (res.errorCode === 0) {
                        this.setData({
                            state: `酒店信息设置成功`
                        })
                    } else {
                        this.setData({
                            state: "设备酒店信息失败:" + res.errorMsg
                        })
                    }
                }, deviceId)
            } else {
                this.setData({
                    state: "获取酒店信息失败"
                })
            }
        })
    },

    // 设置酒店扇区
    toSetHotelSector() {
        const sectors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // 使用前10个扇区
        wx.showLoading({
            state: `正在设置酒店扇区`
        })
        this.setData({
            state: `正在设置酒店扇区--扇区信息--${JSON.stringify(sectors)}--`
        })
        // 调用设置酒店扇区
        plugin.setHotelSector(sectors, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                // 设备已成功初始化，请调用开放平台接口上传lockData
                this.setData({
                    state: `酒店信息设置成功--扇区信息--${JSON.stringify(sectors)}--`
                })
            } else {
                this.setData({
                    state: "设备酒店扇区失败:" + res.errorMsg
                })
            }
        }, deviceId)
    },

    // 设置梯控工作模式
    toSetLiftWorkMode() {
        const workMode = plugin.LiftWorkMode.ACTIVE_ALL_FLOORS;
        wx.showLoading({
            state: `正在设置梯控工作模式`
        })
        this.setData({
            state: `正在设置梯控工作模式--${workMode}--`
        })
        plugin.setLiftWorkMode(workMode, this.data.keyInfo.lockData, res => {
            console.log("设备连接已断开", res);
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    state: `梯控工作模式设置成功--${workMode}--`
                })
            } else {
                this.setData({
                    state: "梯控工作模式设置失败:" + res.errorMsg
                })
            }
        })
    },

    // 设置梯控关联楼层
    toSetLiftControlableFloors() {
        const floors = [1, 8];
        wx.showLoading({
            state: `正在设置梯控关联楼层`
        })
        this.setData({
            state: `正在设置梯控关联楼层--${JSON.stringify(floors)}--`
        })
        plugin.setLiftControlableFloors(floors, this.data.keyInfo.lockData, res => {
            console.log("设备连接已断开", res);
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    state: `设置梯控关联楼层成功--${JSON.stringify(floors)}--`
                })
            } else {
                this.setData({
                    state: "设置梯控关联楼层失败:" + res.errorMsg
                })
            }
        })
    },

    // 设置锁开关配置（以重置功能为例)
    toSetLockConfig(event) {
        const lockConfigType = plugin.LockConfigType.RESET_BUTTON;
        const switchOn = event.target.dataset.switchOn;
        wx.showLoading({
            state: `正在设置锁开关配置`
        })
        this.setData({
            state: `正在设置锁开关配置--${lockConfigType}--`
        })
        plugin.setLockConfig(lockConfigType, switchOn, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    state: `设置锁开关配置成功--${lockConfigType}--${switchOn}--`
                })
            } else {
                this.setData({
                    state: "设置锁开关配置失败:" + res.errorMsg
                })
            }
        })
    },

    // 获取锁开关配置(以重置功能为例)
    toGetLockConfig() {
        const lockConfigType = plugin.LockConfigType.RESET_BUTTON | plugin.LockConfigType.TAMPER_ALERT | plugin.LockConfigType.UNLOCK_DIRECTION;
        wx.showLoading({
            state: `正在获取锁开关配置`
        })
        this.setData({
            state: `正在获取锁开关配置--${lockConfigType}--`
        })
        plugin.getLockConfig(lockConfigType, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    state: `获取锁开关配置成功--${JSON.stringify(res)}--`
                })
            } else {
                this.setData({
                    state: "获取锁开关配置失败:" + res.errorMsg
                })
            }
        }, deviceId)
    },

    // 获取管理员密码
    toGetAdminPasscode(event) {
        wx.showLoading({
            state: `正在获取管理员密码`
        })
        plugin.getAdminPasscode(this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    state: `获取管理员密码成功--原密码：${res.passcode}--`
                })
            } else {
                this.setData({
                    state: "获取管理员密码失败:" + res.errorMsg
                })
            }
        }, deviceId)
    },

    // 获取锁开关配置(以重置功能为例)
    toSetAdminPasscode(event) {
        const newPasscode = event.target.dataset.passcode;
        wx.showLoading({
            state: `正在获取管理员密码`
        })
        plugin.modifyAdminPasscode(newPasscode, this.data.keyInfo.lockData, res => {
            if (res.errorCode === 10003) {
                console.log("监控到设备连接已断开", res)
            }
        }, deviceId).then(res => {
            wx.hideLoading({});
            if (!!res.deviceId) deviceId = res.deviceId;
            console.log(res)
            if (res.errorCode === 0) {
                this.setData({
                    state: `设置管理员密码成功--${JSON.stringify(res)}--`
                })
                API.updateLockData({
                    lockId: this.data.keyInfo.lockId,
                    lockData: res.lockData
                }).then(res1 => {
                    if (!!res1) {
                        this.setData({
                            state: `管理员密码已上传--远程开关状态--${res.enabled ? '已开启' : '已关闭'}`
                        })
                    } else {
                        this.setData({
                            state: `同步服务器失败，锁数据已更新`
                        })
                    }
                })
            } else {
                this.setData({
                    state: "设置管理员密码失败:" + res.errorMsg
                })
            }
        })
    }
})