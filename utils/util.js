var app = getApp();
// 测试
// var baseUrl = 'https://test443.51jrdj.com/home-service2.0'
//  var baseUrl = 'http://192.168.0.2:19090/home-service2.0';
//  var baseUrl = 'http://192.168.43.123:8081/home-service2.0';

// var baseUrl = 'https://test443.91jrdj.com/home-service_test'; // 测试
 var baseUrl = 'https://weixin.51jrdj.com/home-service2.0'; // 正式

// 提示框
function showToast(str, time, successFun) {
  var timeStr = 2000;
  if (time) {
    timeStr = time;
  }
  console.log(timeStr);
  wx.showToast({
    title: str,
    icon: 'none',
    duration: timeStr,
    mask: true,
    complete: successFun
  })
}

// 遮罩
function mask(str) {
  var titleStr = '';
  if (str) {
    titleStr = str;
  }
  wx.showToast({
    title: titleStr,
    icon: 'loading',
    duration: 20000,
    mask: true
  })
}

function doBaseGet(url, resultMethod) {
  console.log('执行了')
  wx.request({
    url: baseUrl + url,
    method: 'GET',
    header: {
      "secretKey": "PcnMh+UXAmk/iNlqFFahKu"
    },
    success: function(res) {
      if (typeof resultMethod == "function") {
        if (res.statusCode == 500) {
          wx.showToast({
            title: '网络连接异常',
            icon: 'none',
            duration: 2000
          })
        } else {
          return resultMethod(res.data)
        }
      }
    },
    fail: function() {
      wx.showToast({
        title: '网络连接异常',
        icon: 'none',
        duration: 2000
      })
    },
  })
}

function doGet(url, data, resultMethod) {
  wx.request({
    url: baseUrl + url,
    data: data,
    method: 'GET',
    header: {
      "secretKey": "PcnMh+UXAmk/iNlqFFahKu"
    },
    success: function(res) {
      if (typeof resultMethod == "function") {
        if (res.statusCode == 500) {
          wx.showToast({
            title: '网络连接异常',
            icon: 'none',
            duration: 2000
          })
        } else {
          return resultMethod(res.data)
        }
      }
    },
    fail: function() {
      wx.showToast({
        title: '网络连接异常',
        icon: 'none',
        duration: 2000
      })

    },
  })
}
// 授权昵称头像的时候用这个
function doGetToLogin(url, data, resultMethod, failMethod) {
  wx.request({
    url: baseUrl + url,
    data: data,
    method: 'GET',
    header: {
      "secretKey": "PcnMh+UXAmk/iNlqFFahKu"
    },
    success: function(res) {
      if (typeof resultMethod == "function") {
        if (res.statusCode == 500) {
          // wx.showToast({
          //   title: '网络连接异常111',
          //   icon: 'none',
          //   duration: 2000
          // })
          return resultMethod(res)
        } else {
          return resultMethod(res.data)
        }
      }
    },
    fail: function(res) {
      wx.showToast({
        title: '网络连接异常',
        icon: 'none',
        duration: 2000
      })
      // return failMethod(res)
    },
  })
}

function doPost(type = '', url, data, resultMethod) {
  console.log(data);
  wx.request({
    url: baseUrl + url,
    data: data,
    method: 'POST',
    header: {
      "secretKey": "PcnMh+UXAmk/iNlqFFahKu",
      'content-type': type == 'form' ? 'application/x-www-form-urlencoded' : 'application/json'
    },
    success: function(res) {
      if (typeof resultMethod == "function") {
        if (res.statusCode == 500) {
          wx.showToast({
            title: '网络连接异常',
            icon: 'none',
            duration: 2000
          })
        } else {
          return resultMethod(res.data)
        }
      }
    },
    fail: function() {
      wx.showToast({
        title: '网络连接异常',
        icon: 'none',
        duration: 2000
      })
    },
  })
}


function doPostForWechat(url, data, resultMethod) {
  // console.log(data);
  console.log('doPostForWechat请求的url：' + url)
  console.log('doPostForWechat请求的url2222：' + app.globalData.netAddress + url)

  wx.request({
    url: app.globalData.netAddress + url,
    data: data,
    method: 'POST',
    header: {
      "secretKey": "PcnMh+UXAmk/iNlqFFahKu"
    },
    success: function(res) {
      if (typeof resultMethod == "function") {
        if (res.statusCode == 500) {
          wx.showToast({
            title: '网络连接异常',
            icon: 'none',
            duration: 2000
          })
        } else {
          return resultMethod(res.data)
        }
      }
    },
    fail: function() {
      wx.showToast({
        title: '网络连接异常',
        icon: 'none',
        duration: 2000
      })
    },
  })
}

function doPut(url, data, resultMethod) {
  // console.log(data);
  wx.request({
    url: baseUrl + url,
    data: data,
    method: 'PUT',
    header: {
      "secretKey": "PcnMh+UXAmk/iNlqFFahKu"
    },
    success: function(res) {
      if (typeof resultMethod == "function") {
        if (res.statusCode == 500) {
          wx.showToast({
            title: '网络连接异常',
            icon: 'none',
            duration: 2000
          })
        } else {
          return resultMethod(res.data)
        }
      }
    },
    fail: function() {
      wx.showToast({
        title: '网络连接异常',
        icon: 'none',
        duration: 2000
      })
    },
  })
}

function doDelete(url, data, resultMethod) {
  // console.log(data);
  wx.request({
    url: baseUrl + url,
    data: data,
    method: 'DELETE',
    header: {
      "secretKey": "PcnMh+UXAmk/iNlqFFahKu"
    },
    success: function(res) {
      if (typeof resultMethod == "function") {
        if (res.statusCode == 500) {
          wx.showToast({
            title: '网络连接异常',
            icon: 'none',
            duration: 2000
          })
        } else {
          return resultMethod(res.data)
        }
      }
    },
    fail: function() {
      wx.showToast({
        title: '网络连接异常',
        icon: 'none',
        duration: 2000
      })
    },
  })
}


function doPostImg(url, file, resultMethod) {
  wx.uploadFile({
    url: baseUrl + url,
    filePath: file,
    name: 'file',
    header: {
      "secretKey": "PcnMh+UXAmk/iNlqFFahKu",
      'content-type': 'multipart/form-data'
    },
    formData: {},
    success: function(res) {
      if (typeof resultMethod == "function") {
        if (res.statusCode == 500) {
          wx.showToast({
            title: '网络连接异常',
            icon: 'none',
            duration: 2000
          })
        } else {
          return resultMethod(res.data)
        }
      }
    },
    fail: function(res) {
      wx.showToast({
        title: '网络连接异常',
        icon: 'none',
        duration: 2000
      })
    }
  })

}

function doPostImgData(url, file, data, resultMethod) {
  wx.uploadFile({
    url: baseUrl + url,
    filePath: file,
    name: 'file',
    header: {
      "secretKey": "PcnMh+UXAmk/iNlqFFahKu",
      'content-type': 'multipart/form-data'
    },
    formData: data,
    success: function(res) {
      if (typeof resultMethod == "function") {
        if (res.statusCode == 500) {
          wx.showToast({
            title: '网络连接异常',
            icon: 'none',
            duration: 2000
          })
        } else {
          return resultMethod(res.data)
        }
      }
    },
    fail: function(res) {
      wx.showToast({
        title: '网络连接异常',
        icon: 'none',
        duration: 2000
      })
    }
  })

}

//今天
function today() {
  var date = new Date();
  var year = date.getFullYear() + "";
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  } else {
    month = "" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  var today = year + "-" + month + "-" + day;
  return today;
}

//当前月
function thisMonth() {
  var date = new Date();
  var month = date.getMonth() + 1;
  return month;
}

// 展示进度条的网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
const requestLoading = function(url, params, method, message, success, fail) {

  var _this = this
  var params = {
    "requestParam": {
      "requestCode": "MS00802",
      "token": ""
    },
    "pagingInfo": {
      "curPageNum": "",
      "pageSize": ""
    },
    "data": {
      productName: _this.data.keywords,
      orderBySales: _this.data.orderBySales,
      orderByPrice: _this.data.orderByPrice
    }
  }

  params = JSON.stringify(params)
  var data = {
    "REQ_PARAM": params
  }
  wx.showLoading({
    title: '正在加载...',
    mask: true,
  })
  wx.request({
    url: app.globalData.apiUrl,
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      wx.hideLoading()
      if (res.statusCode == 200) {
        console.log(res.data)
        if (res.data.response.baseResponseData.code == 0) {
          _this.setData({
            goodsList: res.data.response.data
          })
          if (_this.data.goodsList.length == 0) {
            _this.setData({
              noData: true
            })
          } else {
            _this.setData({
              noData: false
            })
          }
        }
      } else {
        wx.showModal({
          title: '提示',
          content: '系统繁忙,请联系管理员！',
        })
      }
    },
    fail: function(res) {
      wx.hideLoading()
      // wx.showModal({
      //   title: '提示',
      //   content: '网络连接超时！',
      // })
    },
    complete: function(res) {},
  })
}


// 展示进度条的网络请求
// url:网络请求的url
// busiCode:业务编号
// data:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
const reqLoading = function(url, busiCode, data, method, message, resultMethod) {
  var _this = this
  console.log('这里报错了')
  console.log(app)
  // console.log(app.data)
  // console.log(app.data.accountId)
  var params = {
    "requestParam": {
      "requestCode": busiCode,
      "token": app ? app.data.accountId : ''
    },
    "pagingInfo": {
      "curPageNum": "",
      "pageSize": ""
    },
    "data": data
  }

  params = JSON.stringify(params)
  var data = {
    "REQ_PARAM": params
  }
  wx.showLoading({
    title: message,
    mask: true,
  })
  wx.request({
    url: url,
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    method: method,
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      wx.hideLoading()
      if (typeof resultMethod == "function") {
        if (res.statusCode == 200 && res.data.response.baseResponseData.code == 0) {
          return resultMethod(res.data.response);
        } else {
          if (res.data.response != undefined) {
            console.log(res.data.response);
            console.log('返回状态码为：' + res.statusCode + ',结果类型码为：' + res.data.response.baseResponseData.code);
          } else {
            console.log('报错：res.data.response为undefined');
          }
          // wx.showModal({
          //   title: '提示',
          //   content: '系统繁忙,请联系管理员！',
          // })
        }
      }
    },
    fail: function(res) {
      wx.hideLoading()
      // wx.showModal({
      //   title: '提示',
      //   content: '网络连接超时！',
      // })
    },
    function(error) {
      console.log(error);
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "出错啦，错误原因：" + error.errMsg,
      })
    },
    complete: function(res) {},
  })
}

// 展示进度条的网络请求
// url:网络请求的url
// busiCode:业务编号
// data:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
const reqLoadingByPage = function (url, busiCode, data, offset, limit, method, message, resultMethod) {

  var _this = this
  var params = {
    "requestParam": {
      "requestCode": busiCode,
      "token": app.data.accountId
    },
    "pagingInfo": {
      "curPageNum": "" + offset,
      "pageSize": "" + limit
    },
    "data": data
  }

  params = JSON.stringify(params)
  var data = {
    "REQ_PARAM": params
  }
  wx.showLoading({
    title: message,
    mask: true,
  })
  wx.request({
    url: url,
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    method: method,
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      wx.hideLoading()
      if (typeof resultMethod == "function") {
        if (res.statusCode == 200 && res.data.response.baseResponseData.code == 0) {
          return resultMethod(res.data.response);
        } else {
          if (res.data.response != undefined) {
            console.log(res.data.response);
            console.log('返回状态码为：' + res.statusCode + ',结果类型码为：' + res.data.response.baseResponseData.code);
          } else {
            console.log('报错：res.data.response为undefined');
          }
          wx.showModal({
            title: '提示',
            content: '系统繁忙,请联系管理员！',
          })
        }
      }
    },
    fail: function (res) {
      wx.hideLoading()
      // wx.showModal({
      //   title: '提示',
      //   content: '网络连接超时！',
      // })
    },
    function(error) {
      console.log(error);
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "出错啦，错误原因：" + error.errMsg,
      })
    },
    complete: function (res) { },
  })
}

const getCurrentDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 跳转到月嫂保姆页面
const toClassifyWorkers = function () {
  wx.navigateTo({
    url: '/pages/recommend/classifyWorkers/classifyWorkers',
  })
}

// 跳转到宠物洁页面
const toPetClean = function () {
  wx.navigateTo({
    url: '/pages/recommend/petclean/petclean'
  })
}

// 跳转到2*4保洁对应页面
const toFourFourHourCleaning = function () {
  wx.navigateTo({
    //跳转4次*4小时钟点保洁
    //url: 'externalLinks/externalLinks?detailUrl=https://test443.51jrdj.com/home-wechat2.0/cleaningAcarid*productId%53&openId=' + app.data.openid,
    //跳转2次*4小时钟点保洁
    //url: '/pages/recommend/externalLinks/externalLinks?detailUrl=https://test443.51jrdj.com/home-wechat2.0/cleaningAcarid*productId%54&openId=' + app.data.openid,

  })
}

// 跳转到2次除螨对应页面
const toTwoCleaningAcarid = function () {
  wx.navigateTo({
    //url: 'externalLinks/externalLinks?detailUrl=https://test443.51jrdj.com/home-wechat2.0/cleaningAcarid*productId%51&openId=' + app.data.openid,
    url: '/pages/recommend/externalLinks/externalLinks?detailUrl=https://weixin.51jrdj.com/home-wechat2.0/cleaningAcarid*productId%51&openId=' + app.data.openid,
  })
}

module.exports = {
  doBaseGet: doBaseGet,
  doGet: doGet,
  doGetToLogin: doGetToLogin,
  doPost: doPost,
  doPut: doPut,
  doDelete: doDelete,
  doPostImg: doPostImg,
  doPostImgData: doPostImgData,
  today: today,
  thisMonth: thisMonth,
  baseUrl: baseUrl,
  mask: mask,
  showToast: showToast,
  requestLoading: requestLoading, //请求
  reqLoading: reqLoading, //请求
  reqLoadingByPage: reqLoadingByPage, //请求
  doPostForWechat: doPostForWechat,
  getCurrentDate: getCurrentDate,
  toClassifyWorkers: toClassifyWorkers,
  toFourFourHourCleaning: toFourFourHourCleaning,
  toTwoCleaningAcarid: toTwoCleaningAcarid,
  toPetClean: toPetClean
}