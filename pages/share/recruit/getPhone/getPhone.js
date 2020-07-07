const app = getApp();
var util = require('../../../../utils/util.js') 
var btn = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkboxVal: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    btn = false
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  toRule: function () {
    wx.navigateTo({
      url: '/pages/login/clause/clause',
    })
  },

  checkbox: function (e) {
    var that = this;
    that.setData({
      checkboxVal: !that.data.checkboxVal
    });
  },

  getPhoneNumber(e) {
    if (btn) {
      return;
    }
    
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
    btn = true;
    wx.login({
      success: function (res) {
        if (res.code) {
          var data = {
            encryptedData: e.detail.encryptedData,
            code: res.code,
            iv: e.detail.iv
          }
          util.doGet("/weiXin/phone", data, function (res) {
            // console.log(res);
            if (res) {
              app.data.phone = res.phoneNumber
              wx.setStorageSync('phone', res.phoneNumber);
              var data = {
                unionId: app.data.unionid,
                miniOpenId: app.data.openid,
                phone: res.phoneNumber,
                headPic: app.data.avatarUrl,
                nickname: app.data.nickName,
                role: 'housekeeper'
              }
              util.doPut("/accounts/mini", data, function (base) {
                console.log(base);
                if (base) {
                  wx.setStorageSync('accountId', base.id);
                  wx.setStorageSync('userRole', base.role);
                  wx.setStorageSync('loginStatus', 'login');
                  app.data.accountId = base.id
                  app.data.userRole = base.role
                  app.data.loginStatus = 'login';
                  wx.navigateTo({
                    url: '../baseInfo/baseInfo',
                  })
                }
                btn = false;
              })
            } else {
              wx.showToast({
                title: '由于网络问题，需要重新获取您的手机。',
                icon: "none"
              })
              btn = false
            }
          })
        }
      }
    })
  }

  
})