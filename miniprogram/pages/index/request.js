const CLIENT_ID = "7946f0d923934a61baefb3303de4d132";
const CLIENT_SECRET = "56d9721abbc3d22a58452c24131a5554";

export const modifyKeyList = (accessToken, successCallback) => {
  console.log({
    "clientId": CLIENT_ID,
    "accessToken": accessToken,
    "pageNo": 1,
    "pageSize": 20,
    "date": new Date().getTime()
  })
  wx.request({
    url: 'https://api.sciener.com/v3/key/list',
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    data: {
      "clientId": CLIENT_ID,
      "accessToken": accessToken,
      "pageNo": 1,
      "pageSize": 20,
      "date": new Date().getTime()
    },
    success (res2) {
      console.log(res2)
      successCallback.apply(arguments, [res2]);
    },
    fail (err ) {
      console.log(err)
    }
  })
}

export const addLock = (params, successCallback) => {
  wx.request({
    url: 'https://api.sciener.com/v3/lock/initialize',
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    data: {
      "clientId": CLIENT_ID,
      "accessToken": params.access_token,
      "lockData": params.lockData,
      "lockAlias": "Lock From Wx",      // 锁别名
      "date": new Date().getTime()
    },
    success (res) {
      wx.request({
        url: 'https://api.sciener.com/v3/key/list',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: {
          "clientId": CLIENT_ID,
          "accessToken": params.access_token,
          "pageNo": 1,
          "pageSize": 20,
          "date": new Date().getTime()
        },
        success (res2) {
          successCallback.apply(arguments, [res2]);
        }
      })
    }
  })
}


export const uploadOperations = (params, successCallback) => {
  wx.request({
    url: 'https://api.sciener.com/v3/lockRecord/upload',
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    data: {
      "clientId": CLIENT_ID,
      "accessToken": params.access_token,
      "lockId": params.lockId,
      "records": params.records,
      "date": new Date().getTime()
    },
    success (res) {
      successCallback.apply(arguments, [res]);
    }
  })
}



export const deleteLock = (params, successCallback) => {
  wx.request({
    url: 'https://api.sciener.com/v3/lock/delete',
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    data: {
      "clientId": CLIENT_ID,
      "accessToken": params.access_token,
      "lockId": params.lockId,
      "date": new Date().getTime()
    },
    success (res) {
      successCallback.apply(arguments, [res]);
    }
  })
}