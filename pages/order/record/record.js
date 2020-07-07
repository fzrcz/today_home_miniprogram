const app = getApp();
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
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
    var that = this
    var data = {
      id: this.data.orderId,
      offset: 0,
      limit: 999
    }
    util.doGet("/signSafeguard/query/discuss/list", data, function (res) {
      that.setData({
        dataList: res
      })
    })
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

  toEdit: function (e) {
    wx.navigateTo({
      url: 'edit/edit?id=' + e.currentTarget.dataset.id,
    })
  },

  toAdd: function () {
    wx.navigateTo({
      url: 'add/add?orderId=' + this.data.orderId,
    })
  }
})