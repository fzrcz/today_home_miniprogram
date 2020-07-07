// pages/empower/empower.js
var app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  // 授权
  getUserInfo: function(e) {
    var that = this;
    wx.showToast({
      title: '授权中...',
      icon: 'none'
    })
    console.log(e)
    app.data.userInfo = e.detail.userInfo;
    console.log("e.detail.userInfo为：")
    console.log(e.detail.userInfo)
    wx.login({
      success: function(res) {
        console.log("*****************")
        console.log(res)
        if (res.code) {
          var data = {
            encryptedData: e.detail.encryptedData,
            code: res.code,
            iv: e.detail.iv
          }
          console.log("weiXin/userInfo传参为：", data)
          // 唤起微信授权昵称头像的弹窗，点击允许才能进入这个请求里边
          util.doGetToLogin("/weiXin/userInfo", data, function(res) {
              console.log('调用weixin/userInfo返回', res)
              if (res.statusCode == 500) {
                // wx.showModal({
                //   title: '',
                //   content: '网络异常，请尝试再次登录！',
                //   showCancel: false,
                // })
                // that.getUserInfo(e);
                wx.showToast({
                  title: '网络异常，请尝试再次登录！',
                  icon: 'none'
                })
                return;
              }
              if (res) {

                wx.setStorageSync('avatarUrl', res.avatarUrl);
                wx.setStorageSync('nickName', res.nickName);
                wx.setStorageSync('openid', res.openId);
                wx.setStorageSync('unionid', res.unionId);
                app.data.avatarUrl = res.avatarUrl;
                app.data.nickName = res.nickName;
                app.data.openid = res.openId;
                app.data.unionid = res.unionId;
                //判断是否注册,数据库中是否有这个用户的unionid，没有的话再进行手机号授权
                util.doBaseGet("/accounts/" + res.unionId + "", function(base) {
                  console.log("获取用户信息，base为：")
                  console.log(base)
                  if (base != '' && base != null) {
                    // 有用户信息，且有手机号，才把相关信息存到缓存和app.js
                    if (base.phone) {
                      wx.setStorageSync('userRole', base.role);
                      wx.setStorageSync('loginStatus', 'login');
                      wx.setStorageSync('phone', base.phone);
                      wx.setStorageSync('accountId', base.id);
                      app.data.accountId = base.id;
                      app.data.userRole = base.role;
                      app.data.loginStatus = 'login';
                      app.data.phone = base.phone;
                    } else {
                      wx.navigateTo({
                        // url: '/pages/login/login?entranceType=otherPage',
                        url: '/pages/login/login',
                      })
                      return;
                    }
                    that.setData({
                      role: base.role,
                      loginStatus: 'login',
                      visible: false
                    });
                    that.loadInfo();
                    wx.showToast({
                      title: '授权登录成功',
                      icon: 'none',
                      mask: true,
                      success: function() {
                        setTimeout(function() {
                          wx.navigateBack({
                            delta: 1
                          })
                        }, 1000);
                      }
                    })
                  } else {
                    wx.navigateTo({
                      // entranceType分为从我的页面进入，和其他页面进入
                      // 从其他页面进入授权手机号之后需要回退2步
                      // url: '/pages/login/login?entranceType=otherPage',
                      url: '/pages/login/login',
                    })
                  }
                })
              }
            }),
            function(res) {
              console.log("失败，走进来")
            }
        }
      }
    })
  },


  //拒绝授权
  refuse: function() {
    wx.navigateBack({
      data: 1
    })
  },

  loadInfo: function() {
    var that = this
    if (app.data.loginStatus == 'login') {
      if (app.data.userRole == 'housekeeper') {
        util.doBaseGet("/housekeepers/mine/" + app.data.accountId, function(res) {
          console.log('阿姨信息', res);

          wx.setStorageSync('isNewPeople', res.isNew);
          app.data.isNewPeople = res.isNew;

          that.setData({
            account: res.account,
            headPic: res.headPic,
            msgCount: res.msgCount,
            name: res.name,
            nickname: res.nickname,
            numCount: res.numCount,
            auth: res.auth,
            qrCode: res.qrCode
          })
        })
      } else if (app.data.userRole == 'employer') {
        util.doBaseGet("/employers/mine/" + app.data.accountId, function(res) {
          console.log('雇主信息', res);

          wx.setStorageSync('isNewPeople', res.isNew);
          app.data.isNewPeople = res.isNew;
          
          that.setData({
            account: res.account,
            headPic: res.headPic,
            msgCount: res.msgCount,
            name: res.name,
            nickname: res.nickname,
            housekeeperCount: res.housekeeperCount,
            numCount: res.numCount,
            auth: res.auth,
            qrCode: res.qrCode
          })
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // },

})