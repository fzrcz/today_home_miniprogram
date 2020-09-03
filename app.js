//app.js
var util = require('/utils/util.js')
// var scene = '';
App({
  data: {
    isNewPeople: '',
    avatarUrl: '',
    nickName: '',
    unionid: '',
    openid: '',
    userInfo: null,
    accountId: '',
    accountSimpleId: '',
    phone: '',
    userRole: '', //housekeeper为阿姨，employer为雇主
    loginStatus: '', //login登录，logout退出
    urlSocket: 'wss://weixin.51-star.cn/home-service/websocket',
    searchContentList: wx.getStorageSync('searchContentList'),
    minShopAppId:'wx05feeef3aaa022bb',//今日好物到家的appId
    jumpNum: 0,
    haveJump: 0,
    companyList: []
  },

  onLaunch: function() {
    console.log("全局的onlaunch");
    // await this.getCompanyList()
    // let _this = this
    // util.doGet("/company/companyList", {}, res => {
    //   console.log('分店列表：');
    //   console.log(res);
    //   this.data.companyList = res.data
    //   wx.setStorageSync('companyList', res.data)
    // })

    const updateManager = wx.getUpdateManager()
    wx.setStorageSync('urlSocket', 'wss://weixin.51-star.cn/home-service/websocket');
    this.data.urlSocket = wx.getStorageSync('urlSocket');
    this.data.avatarUrl = wx.getStorageSync('avatarUrl');
    this.data.nickName = wx.getStorageSync('nickName');
    this.data.unionid = wx.getStorageSync('unionid');
    this.data.openid = wx.getStorageSync('openid');
    this.data.accountId = wx.getStorageSync('accountId');
    this.data.accountSimpleId = wx.getStorageSync('accountSimpleId');
    this.data.isNewPeople = wx.getStorageSync('isNewPeople');
    console.log(this.data.accountId)
    this.data.userRole = wx.getStorageSync('userRole');
    this.data.phone = wx.getStorageSync('phone');

    if (wx.getStorageSync('loginStatus')) {
      this.data.loginStatus = wx.getStorageSync('loginStatus');
    } else {
      wx.setStorageSync('loginStatus', 'logout');
      this.data.loginStatus = wx.getStorageSync('loginStatus');
    }
    //雇主
    // this.data.accountId = '61660ee2-fdbc-44f1-bb8a-415b97edbbc8';   //47c60990-5d41-4168-8f41-0d1b7d9a9548
    //  this.data.userRole = 'employer';
    //  this.data.loginStatus = 'login';
    //阿姨
    // this.data.accountId = '1';
    // this.data.userRole = 'housekeeper';
    // this.data.loginStatus = 'login';

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      // console.log("是否有新版本", res.hasUpdate)
    })
    updateManager.onUpdateReady(function() {
      // wx.showModal({
      //   title: '更新提示',
      //   content: '新版本已经准备好，是否重启应用？',
      //   success: function (res) {
      //     if (res.confirm) {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
      //     }
      //   }
      // })

    })

  },
  onload: function (options) {
    var source = options.source;
    this.setData({
      source: source,
    })
  },
  // getCompanyList() {
    
  // },
  onShow: function (options) {
    let  that = this;   
     
    if(!wx.getStorageSync('selectCompany')) { // 没有选择分店
      console.log('没有有选择分店')
    } else {
      console.log('有选择分店')
    }
    console.log("全局的onshow");
    wx.getSystemInfo({
      success: res => {// console.log('手机信息res'+res.model)
        console.log("手机信息打印res：");
        console.log(res);
        that.globalData.mobilInfo = res;
      }
    })
    //**************************************************** */
    // // source:来源：1 人分享过来的 2 广告位过来的 3 正常过来的
    var source;
    var parameter;
    // var source = 3;
    // var parameter = '';

    // var activityId = ""
    // var productId = ""
    // // options.scene有值，证明是从小程序码扫进来的
    // // 没有值，可能是通过文章链接进来的，如果没有值，就用默认值
    // if (options.scene) {
    //   scene = decodeURIComponent(options.scene)
    //   console.log("scene******为")
    //   console.log(scene)
    //   var scenes = scene.split(";")
    //   productId = scenes[0]
    //   activityId = scenes[1]
    //   source = scenes[2]
    //   parameter = scenes[3]
    //   // app.data.source = source
    //   // app.data.parameter = parameter
    // } else {
    //   console.log("没有scene")
    //   productId = options.productId
    //   activityId = options.activityId
    //   if (options.source) {
    //     source = options.source
    //   }
    //   if (options.parameter) {
    //     parameter = options.parameter
    //   }
    // }
    //**************************************************** */
    // 小程序的访问量
    var data = {
      accountId: this.data.accountId,
      source: source,// 来源： 
      parameter: parameter,
    }
    console.log("小程序的访问量传参")
    console.log(data)
    this.reqLoadingNoAccountId(this.globalData.apiUrl, 'MS00601', data, 'POST', '加载中...', function (res) {
      console.log("小程序的访问量返回：");
      console.log(res);
    })
  },
  

   reqLoadingNoAccountId: function (url, busiCode, data, method, message, resultMethod) {
    var _this = this
    var params = {
      "requestParam": {
        "requestCode": busiCode,
        "token": ''
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
  },


  globalData: {
    currentTab: null,
    // 正式||测试
    apiUrl: "https://weixin.51jrdj.com/itgroup_home/incoming/apply.pair",//请求地址 正式
    // apiUrl: "https://test443.91jrdj.com/itgroup_home_test/incoming/apply.pair",//请求地址 测试
    // -----------
    netAddress: "https://weixin.51jrdj.com/home-wechat2.0",// 正式 用于支付回调
    // apiUrl: "http://192.168.0.16:18080/itgroup_home/incoming/apply.pair",//请求地址 本地测试
    // apiUrl: "http://47.106.112.87/itgroup_home/incoming/apply.pair", //请求地址 测试
    // apiUrl: "https://weixin.51jrdj.com/itgroup_home_test/incoming/apply.pair",//请求地址 测试
    // isHuaWei: false,
    mobilInfo: '',
    source: '',
    // 传入的优惠券的批次数组
    couponsBatchIdsList: [3],
  },
  apis: {
    // online: "https://weixin.51jrdj.com/home-service", // 测试
    online: "https://weixin.51jrdj.com/home-service2.0", // 正式
  }
})