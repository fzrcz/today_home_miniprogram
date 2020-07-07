const app = getApp();
var util = require('../../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: util.today(),
    endDate: util.today()
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

  changeStartDate(e) {
    this.setData({
      startDate: e.detail.value
    })
  },

  changeEndDate(e) {
    this.setData({
      endDate: e.detail.value
    })
  },

  formSubmit: function (e) {
    var that = this;
    if (e.detail.value.startDate == '') {
      wx.showToast({
        title: '开始时间不能为空',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.endDate == '') {
      wx.showToast({
        title: '结束时间不能为空',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.content == '') {
      wx.showToast({
        title: '详细内容不能为空',
        icon: 'none'
      })
      return;
    }
    var data = {
      housekeeperId: app.data.accountId,
      startDate: e.detail.value.startDate,
      endDate: e.detail.value.endDate,
      describe: e.detail.value.content
    }

    util.doPut("/housekeepers/experience", data, function (res) {
      if(res){
        wx.navigateBack({
          delta:1
        })
      }
    })
  }
})