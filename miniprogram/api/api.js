import { $request } from './common.js';

const CLIENT_ID = "7946f0d923934a61baefb3303de4d132";
const CLIENT_SECRET = "56d9721abbc3d22a58452c24131a5554";

Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

export const login = params => {
  return $request('/oauth2/token', 'POST', {
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "grant_type": "password",
    "redirect_uri": "http://www.sciener.cn",
    ...params
  });
}

export const keyList = () => {
  return $request('/v3/key/list', 'POST', {
    "clientId": CLIENT_ID,
    "accessToken": wx.getStorageSync('access_token'),
    "pageNo": 1,
    "pageSize": 20,
    "date": Date.now()
  });
}

export const initialize = params => {
  return $request('/v3/lock/initialize', 'POST', {
    "clientId": CLIENT_ID,
    "accessToken": wx.getStorageSync('access_token'),
    "date": Date.now(),
    ...params
  });
}


export const deleteLock = params => {
  return $request('/v3/lock/delete', 'POST', {
    "clientId": CLIENT_ID,
    "accessToken": wx.getStorageSync('access_token'),
    "date": Date.now(),
    ...params
  });
}

export const uploadOperation = params => {
  return $request('/v3/lockRecord/upload', 'POST', {
    "clientId": CLIENT_ID,
    "accessToken": wx.getStorageSync('access_token'),
    "date": Date.now(),
    ...params
  });
}

export const addKeyboardPwd = params => {
  return $request('/v3/keyboardPwd/add', 'POST', {
    "clientId": CLIENT_ID,
    "accessToken": wx.getStorageSync('access_token'),
    "addType": 1,
    "date": Date.now(),
    ...params
  });
}

export const modifyKeyboardPwd = params => {
  return $request('/v3/keyboardPwd/change', 'POST', {
    "clientId": CLIENT_ID,
    "accessToken": wx.getStorageSync('access_token'),
    "changeType": 1,
    "date": Date.now(),
    ...params
  });
}

export const deleteKeyboardPwd = params => {
  return $request('/v3/keyboardPwd/delete', 'POST', {
    "clientId": CLIENT_ID,
    "accessToken": wx.getStorageSync('access_token'),
    "deleteType": 1,
    "date": Date.now(),
    ...params
  });
}

export const addFingerprint = params => {
  return $request('/v3/fingerprint/add', 'POST', {
    "clientId": CLIENT_ID,
    "accessToken": wx.getStorageSync('access_token'),
    "date": Date.now(),
    ...params
  });
}

export const modifyFingerprint = params => {
  return $request('/v3/fingerprint/changePeriod', 'POST', {
    "clientId": CLIENT_ID,
    "accessToken": wx.getStorageSync('access_token'),
    "changeType": 1,
    "date": Date.now(),
    ...params
  });
}

export const deleteFingerprint = params => {
  return $request('/v3/fingerprint/delete', 'POST', {
    "clientId": CLIENT_ID,
    "accessToken": wx.getStorageSync('access_token'),
    "deleteType": 1,
    "date": Date.now(),
    ...params
  });
}

export const addICCard = params => {
  return $request('/v3/identityCard/add', 'POST', {
    "clientId": CLIENT_ID,
    "accessToken": wx.getStorageSync('access_token'),
    "addType": 1,
    "date": Date.now(),
    ...params
  });
}

export const modifyICCard = params => {
  return $request('/v3/identityCard/changePeriod', 'POST', {
    "clientId": CLIENT_ID,
    "accessToken": wx.getStorageSync('access_token'),
    "changeType": 1,
    "date": Date.now(),
    ...params
  });
}

export const deleteICCard = params => {
  return $request('/v3/identityCard/delete', 'POST', {
    "clientId": CLIENT_ID,
    "accessToken": wx.getStorageSync('access_token'),
    "deleteType": 1,
    "date": Date.now(),
    ...params
  });
}

export const updateLockData = params => {
  return $request('/v3/lock/updateLockData', 'POST', {
    "clientId": CLIENT_ID,
    "accessToken": wx.getStorageSync('access_token'),
    "date": Date.now(),
    ...params
  });
}