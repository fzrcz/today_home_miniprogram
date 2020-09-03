const app = getApp();
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var name = options.nickname;
    this.setData({
      name: name
    })
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

  submit: function (e) {
    var data = {
      id: app.data.accountId,
      nickname: e.detail.value.nickname
    }
    // console.log(e);
    util.doPost('',"/employer", data, function (res) {
      if (res) {
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
        app.data.nickname = e.detail.value.nickname;
        wx.setStorageSync('nickname', e.detail.value.nickname)
        wx.navigateBack({
          delta: 1
        })
      }
    })

  }
})