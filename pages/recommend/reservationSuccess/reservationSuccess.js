//预约成功
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '/image/commission-banner.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      appointTime: options.appointTime,
      orderTime: options.orderTime,
      orderNo: options.orderNo,
      price: options.price,
    })
  },

  //阿姨详细信息
  toBooking: function (e) {
    wx.switchTab({
      url: '/pages/order/order',
    })
  },

  toMain:function(){
    wx.switchTab({
      url: '/pages/recommend/recommend',
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

  toCommission: function () {
    wx.navigateTo({
      url: '/pages/recommend/commission/commission',
    })
  }
})