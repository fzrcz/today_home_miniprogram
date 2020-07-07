//pages/login/login.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
var loginStatus = true;
// var btn = false;
Page({
  data: {
    checkboxVal: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // btn = false;
    // var entranceType = options.entranceType;
    // console.log("授权手机号onload，跳进来的类型：" + entranceType);
    // that.setData({
    //   entranceType: entranceType,
    // })
  },

  toRule: function() {
    wx.navigateTo({
      url: '/pages/login/clause/clause',
    })
  },

  checkbox: function(e) {
    var that = this;
    that.setData({
      checkboxVal: !that.data.checkboxVal
    });
  },

  //授权
  getPhoneNumber(e) {
    var that = this;
    // if (btn) {
    //   return;
    // }
    if (!this.data.checkboxVal) {
      wx.showToast({
        title: '您还未同意《今日到家服务条款》',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (e.detail.encryptedData == undefined) {
      return false;
    }
    // btn = true;
    if (!app.data.openid) {
      wx.login({
        success: function(res) {
          if (res.code) {
            var data = {
              code: res.code
            }
            util.doGet("/weiXin/applet/openId", data, function(res) {
              app.data.openid = res
              wx.setStorageSync('openid', res);
            })
          }
        }
      })
    }

    wx.login({
      success: function(res) {
        if (res.code) {

          var data = {
            encryptedData: e.detail.encryptedData,
            code: res.code,
            iv: e.detail.iv
          }
          wx.showLoading({
            title: '授权中',
          })
          util.doGet("/weiXin/phone", data, function(res) {
            console.log("获取手机号为：",res);
            if (res) {
              // 把手机号存到缓存
              app.data.phone = res.phoneNumber
              wx.setStorageSync('phone', res.phoneNumber);
              var data = {
                unionId: app.data.unionid,
                miniOpenId: app.data.openid,
                phone: app.data.phone,
                headPic: app.data.avatarUrl,
                nickname: app.data.nickName,
                // 这个角色可以不传，如果是housekeeper，那么走accounts/mini就会注册成housekeeper，如果不是，就注册成employer
                // role: 'employer'
              }
              console.log("accounts/mini传参：", data)
              // 把微信授权的昵称头像电话等存到数据库
              util.doPut("/accounts/mini", data, function(base) {
                console.log('accounts/mini返回');
                console.log(base);
                if (base) {
                  wx.setStorageSync('accountSimpleId', base.accountId);
                  wx.setStorageSync('accountId', base.id);
                  wx.setStorageSync('userRole', base.role);
                  wx.setStorageSync('loginStatus', 'login');
                  app.data.accountSimpleId = base.accountId;
                  app.data.accountId = base.id;
                  app.data.userRole = base.role;
                  app.data.loginStatus = 'login';
                  // if(that.data.entranceType != 'otherPage'){
                  //   wx.navigateBack({
                  //     delta: 1
                  //   })
                  // }else{
                  	wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      mask: true,
                      success: function() {
                        setTimeout(function() {
                          wx.navigateBack({
                            delta: 2
                          })
                        }, 1000);
                      }
                    })
                    
                    // wx.navigateBack({
                    //   delta: 2
                    // })

                  // }
                }
                // btn = false;
              })
            } else {
              // 没有获取到手机号的情况
              wx.showToast({
                title: '网络异常，请重新授权',
                icon: 'none',
              })
              // console.log("999999999999999999999")
              // console.log("8888888888888888888")
              // getPhoneNumber(e);
              

              // btn = false
            }
          })
        }
      }
    })
  }
})