// import configs, { platform } from '../configs/index.js'

const baseServer = "https://api.ttlock.com";
// const app = getApp()

export const $request = (url, method, params) => {
  wx.showLoading()
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseServer}${url}`,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: params,
      method: method,
      success: (res) => {
        wx.hideLoading();
        switch (res.statusCode) {
          case 200: {
            if (!!res.data && typeof res.data.errcode === 'undefined') {
              resolve(res.data);
              return;
            }
            switch (res.data.errcode) {
              case 0: resolve(res.data); break;
              default: reject([res.data, res.data.errmsg, 1]); break;
            }
          } break;
          default: {
            reject([res, `服务器请求失败，请稍候再试。状态：${res.statusCode}`, 2]);
          } break;
        }
      },
      fail (err) {
        wx.hideLoading();
        reject([err, `服务器请求失败，请稍候再试...`, 3]);
      }
    })
  }).then(res => {
    console.log(res);
    return res;
  }).catch(err => {
    console.log(err);
    wx.showToast({
      icon: "none",
      title: err[1],
    })
    throw err
  })
}