// pages/recommend/lookingNanny/lookingNanny.js
var app = getApp();
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        this.setData({
          baseWidth: ww,
          banseHeight: wh,
        });
      }
    })
    var clickId = options.clickId
    console.log(clickId)
    this.setData({
      clickId: clickId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      companyId: wx.getStorageSync('selectCompany').id
    })
  },

  // 联系客服
  toCall: function() {
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('selectCompany').tel
    })
    
  },
  // 在线预约
  onlineBooking: function() {
    // 登录判断
      var that = this;
      console.log("在线预约登录状态"+ app.data.loginStatus);
      if (app.data.loginStatus == 'login') {
        //0保姆、1月嫂、2护工、3育婴师、4育儿嫂
        var clickId = this.data.clickId
        wx.navigateTo({
          url: '/pages/recommend/lookingNanny/onlineBooking/onlineBooking?clickId=' + clickId,
        })
      } else {
        wx.navigateTo({
          url: '/pages/empower/empower',
        })
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})