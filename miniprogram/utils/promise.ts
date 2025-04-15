const asyncMethods = [
    'canvasGetImageData',
    'canvasPutImageData',
    'canvasToTempFilePath',
    'setEnableDebug',
    'startAccelerometer',
    'stopAccelerometer',
    'getBatteryInfo',
    'getClipboardData',
    'setClipboardData',
    'startCompass',
    'stopCompass',
    'addPhoneContact',
    'startGyroscope',
    'stopGyroscope',
    'startBeaconDiscovery',
    'stopBeaconDiscovery',
    'getBeacons',
    'startLocalServiceDiscovery',
    'stopLocalServiceDiscovery',
    'startDeviceMotionListening',
    'stopDeviceMotionListening',
    'getNetworkType',
    'makePhoneCall',
    'scanCode',
    'getSystemInfo',
    'vibrateShort',
    'vibrateLong',
    'getExtConfig',
    'chooseLocation',
    'getLocation',
    'openLocation',
    'chooseMessageFile',
    'loadFontFace',
    'chooseImage',
    'previewImage',
    'getImageInfo',
    'saveImageToPhotosAlbum',
    'compressImage',
    'chooseVideo',
    'saveVideoToPhotosAlbum',
    'downloadFile',
    'request',
    'connectSocket',
    'closeSocket',
    'sendSocketMessage',
    'uploadFile',
    'login',
    'checkSession',
    'chooseAddress',
    'authorize',
    'addCard',
    'openCard',
    'chooseInvoice',
    'chooseInvoiceTitle',
    'getUserInfo',
    'requestPayment',
    'getWeRunData',
    'showModal',
    'showToast',
    'hideToast',
    'showLoading',
    'hideLoading',
    'showActionSheet',
    'pageScrollTo',
    'startPullDownRefresh',
    'stopPullDownRefresh',
    'setBackgroundColor',
    'setBackgroundTextStyle',
    'setTabBarBadge',
    'removeTabBarBadge',
    'showTabBarRedDot',
    'hideTabBarRedDot',
    'showTabBar',
    'hideTabBar',
    'setTabBarStyle',
    'setTabBarItem',
    'setTopBarText',
    'saveFile',
    'openDocument',
    'getSavedFileList',
    'getSavedFileInfo',
    'removeSavedFile',
    'getFileInfo',
    'getStorage',
    'setStorage',
    'removeStorage',
    'clearStorage',
    'getStorageInfo',
    'closeBLEConnection',
    'closeBluetoothAdapter',
    'createBLEConnection',
    'getBLEDeviceCharacteristics',
    'getBLEDeviceServices',
    'getBluetoothAdapterState',
    'getBluetoothDevices',
    'getConnectedBluetoothDevices',
    'notifyBLECharacteristicValueChange',
    'openBluetoothAdapter',
    'readBLECharacteristicValue',
    'startBluetoothDevicesDiscovery',
    'stopBluetoothDevicesDiscovery',
    'writeBLECharacteristicValue',
    'getHCEState',
    'sendHCEMessage',
    'startHCE',
    'stopHCE',
    'getScreenBrightness',
    'setKeepScreenOn',
    'setScreenBrightness',
    'connectWifi',
    'getConnectedWifi',
    'getWifiList',
    'setWifiList',
    'startWifi',
    'stopWifi',
    'getBackgroundAudioPlayerState',
    'playBackgroundAudio',
    'pauseBackgroundAudio',
    'seekBackgroundAudio',
    'stopBackgroundAudio',
    'getAvailableAudioSources',
    'startRecord',
    'stopRecord',
    'setInnerAudioOption',
    'playVoice',
    'pauseVoice',
    'stopVoice',
    'getSetting',
    'openSetting',
    'getShareInfo',
    'hideShareMenu',
    'showShareMenu',
    'updateShareMenu',
    'checkIsSoterEnrolledInDevice',
    'checkIsSupportSoterAuthentication',
    'startSoterAuthentication',
    'navigateBackMiniProgram',
    'navigateToMiniProgram',
    'setNavigationBarTitle',
    'showNavigationBarLoading',
    'hideNavigationBarLoading',
    'setNavigationBarColor',
    'redirectTo',
    'reLaunch',
    'navigateTo',
    'switchTab',
    'navigateBack'
  ]
  
  function hasCallback(args) {
    if (!args || typeof args !== 'object') return false
  
    const callback = ['success', 'fail', 'complete']
    for (const m of callback) {
      if (typeof args[m] === 'function') return true
    }
    return false
  }
  
  function _promisify(func) {
    if (typeof func !== 'function') return fn
    return (args = {}) =>
      new Promise((resolve, reject) => {
        func(
          Object.assign(args, {
            success: resolve,
            fail: reject
          })
        )
      })
  }
  
  function promisifyAll(wx = {}, wxp = {}) {
    Object.keys(wx).forEach(key => {
      const fn = wx[key]
      if (typeof fn === 'function' && asyncMethods.indexOf(key) >= 0) {
        wxp[key] = args => {
          if (hasCallback(args)) {
            fn(args)
          } else {
            return _promisify(fn)(args)
          }
        }
      } else {
        wxp[key] = fn
      }
    })
  }
  
  // export const promisify = _promisify
  
  
  const wxp = {} as WechatMiniprogram.Wx;
  promisifyAll(wx, wxp)
  
  // export default {}
  export default wxp