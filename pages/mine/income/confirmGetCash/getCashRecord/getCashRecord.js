// pages/mine/income/confirmGetCash/getCashRecord/getCashRecord.js
var app = getApp();
var util = require('../../../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 0,
    limit: 11,
    isloading: true, //是否显示加载动画
    noDataList: 1 // 根据这个是否在页面展示没有更多数据啦,0 展示，1 不展示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var data = {
      memberId: app.data.accountId,
      accountType: 1,
      offset: that.data.currentPage * that.data.limit,
      limit: that.data.limit,
    }
    // 调用提现列表
    wx.showLoading({
        title: '加载中',
        icon: 'loading'
      }),
      util.doGet("/withdrawalRecord/queryList", data, function(res) {
        wx.hideLoading();
        console.log('提现列表：')
        console.log(res)
        var getCashList = [];
        if (res.success) {
          that.setData({
            getCashList: res.data,
          })
        }
      })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    var currentPage = that.data.currentPage;
    currentPage++;
    console.log("当前页为第" + currentPage + "页")
    that.setData({
      isloading: false,
      currentPage: currentPage
    })
    that.getNewData();
  },

  // 分页操作
  getNewData: function() {
    var that = this;
    if (that.data.noDataList != 0) {

      wx.showLoading({
        title: '加载中...'
      })
      var data = {
        memberId: app.data.accountId,
        // accountType 1.顾客 2.工人
        accountType: 1,
        offset: that.data.currentPage * that.data.limit,
        limit: that.data.limit,
      }
      util.doGet("/withdrawalRecord/queryList", data, function(res) {
        wx.hideLoading();
        console.log('提现列表分页,查询的新数据：')
        console.log(res)
        if (res.success) {
          var getCashList = res.data;
          if (getCashList.length == 0) {
            wx.showToast({
              title: '没有更多数据啦...',
              icon: 'none',
              duration: 1500
            })
            that.setData({
              noDataList: 0
            })
            return;
          } else {
            console.log("旧数据：")
            console.log(that.data.getCashList)
            console.log("新数据：")
            console.log(getCashList)
            // 将新一页的数据添加到原数据后面
            getCashList = that.data.getCashList.concat(getCashList);
            that.setData({
              getCashList: getCashList,
            })
          }
        }
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    var data = {
      memberId: app.data.accountId,
      accountType: 1,
      offset: 0,
      limit: that.data.limit,
    }
    // 调用提现列表
    wx.showLoading({
        title: '加载中',
        icon: 'loading'
      }),
      util.doGet("/withdrawalRecord/queryList", data, function(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('提现列表下拉刷新：')
        console.log(res)
        var getCashList = [];
        if (res.success) {
          that.setData({
            getCashList: res.data,
          })
        }
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


  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function() {

  // }
})