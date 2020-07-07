const app = getApp();
var util = require('../../../utils/util.js') 
var currDate = '1';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    totalDate: '本月',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData(1)
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
    this.loadData(1);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  loadData: function (currDate) {
    var that = this
    var data = {
      accountType: app.data.userRole,
      month: currDate
    }
    util.doGet("/housekeepers/" + app.data.accountId +"/accountBatch", data, function (res) {
      // console.log(res)
      that.setData({
        balance: res.balance,
        income: res.income,
        items: res.accountBatchDtos
      })
    })
  },

  changeDate: function () {
    if (currDate == '1') {
      currDate = '3'
      this.setData({
        totalDate: '近3个月',
      });
    } else if (currDate == '3') {
      currDate = '6'
      this.setData({
        totalDate: '近6个月',
      });
    } else if (currDate == '6') {
      currDate = '12'
      this.setData({
        totalDate: '近1年',
      });
    } else {
      currDate = '1'
      this.setData({
        totalDate: '本月',
      });
    }
    this.loadData(currDate);
  },

  toWithdraw:function(e){
    wx.navigateTo({
      url: 'withdraw/withdraw?total='+e.currentTarget.dataset.money,
    })
  }
})