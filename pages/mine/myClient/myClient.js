// pages/mine/myClient/myClient.js
var app = getApp();
var util = require('../../../utils/util.js');
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
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    var data = {

    }
    util.doGet("/housekeepers/" + app.data.accountId + "/inviteInfo", data, function(res1) {
      console.log('我的邀请人共几人：');
      console.log(res1);
      that.setData({
        myClientNum: res1.data
      })
    })
    // 我的客户请求
    var data = {
      memberId: app.data.accountId,
      inviterFlag: 1,
      businessTypeArr: '2,3',
    }
    util.doGet("/accountTtaceRecord/queryList", data, function(res2) {
      wx.hideLoading();
      console.log('我的客户onload：')
      console.log(res2)

      if (res2.success) {
        if (res2.data.length != 0) {
          var allIncome = 0;
          for (var i = 0; i < res2.data.length; i++) {
            allIncome += res2.data[i].traceMoney;
          }
          that.setData({
            myClientList: res2.data,
            allIncome: allIncome.toFixed(2)
          })
        } else {
          that.setData({
            myClientList: [],
            allIncome: 0,
          })
        }
      }
    })
  },

  // 跳转邀请页面
  share: function() {
    wx.navigateTo({
      url: '../share/share',
    })
  },

  //跳转我邀请的人页面
  myInvitation: function() {
    wx.navigateTo({
      url: 'myInvitation/myInvitation',
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
  // onShareAppMessage: function() {

  // }
})