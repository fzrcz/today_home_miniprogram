// pages/recommend/housekeeperDetail/rule/rule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    random: Math.random() * 10000
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

  imageLoad: function (e) {
    //获取图片真实宽度和高度
    var width = e.detail.width;
    var height = e.detail.height;
    //图片真实高度比例

    this.setData({
      viewWidth: width,
      viewHeight: height
    })
  },

})