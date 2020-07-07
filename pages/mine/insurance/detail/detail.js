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
    //healthInsurance / { flag } / { action } ? id =
    //flag 查询标识：体检：health 保险：insurance
    //action 查询意图： 查询详情：detail 查询列表：list
    util.doBaseGet("/healthInsurance/insurance/detail?id=" + options.id, function (res) {
      //console.log(res)
      var list = []
      if (res[0].insuranceFiles != null && res[0].insuranceFiles.length > 0) {
        list = res[0].insuranceFiles[0].path.split(',');
      }
      that.setData({
        name: res[0].name,
        relation: res[0].relation,
        idNo: res[0].idNo,
        orderNo: res[0].orderNo,
        deadline: res[0].deadline,
        items: res[0].insuranceRange,
        imgList: list
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