const app = getApp();
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.doBaseGet("/signSafeguard/query/appoint/detail?id=" + options.id, function (res) {
      console.log(res)
      that.setData({
        orderNo: res[0].orderNo,
        employerName: res[0].employerName,
        employerPhone: res[0].employerPhone,
        housekeeperName: res[0].housekeeperName,
        housekeeperPhone: res[0].housekeeperPhone,
        money: res[0].money,
        orderStatus: res[0].orderStatus,
        appointTime: res[0].appointTime,
        orderTime: res[0].orderTime,
        disposeAccountName: res[0].disposeAccountName,
        disposeAccountPhone: res[0].disposeAccountPhone,
        disposeReason: res[0].disposeReason,
        interflowType: res[0].interflowType,
        interflowAddress: res[0].interflowAddress
      })
    })
  },

  //查看大图
  previewheadPic: function (e) {
    var current = e.target.dataset.src
    // console.log(current)
    var imagesrc = this.data.imgList;
    wx.previewImage({
      current: current,
      urls: imagesrc
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

  }
})