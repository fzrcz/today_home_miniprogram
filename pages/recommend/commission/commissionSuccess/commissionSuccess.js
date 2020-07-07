// 代办支付成功
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/mini-customer/banner-findJob.png',
  },

  /**
   * 查看详情
   */
  toOrderDetail: function () {
    wx.navigateTo({
      url: '/pages/order/orderDetail/orderDetail?id=' + this.data.id,
    })
  },
  /**
   * 返回首页
   */
  toRecommend: function () {
    wx.switchTab({
      url: '/pages/recommend/recommend',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var allPrice = 0;
    allPrice = Number(options.basicsPrice) + Number(options.otherPrice);
    // console.log(allPrice);
    allPrice = allPrice.toFixed(2);
    that.setData({
      id :options.id,
      orderTime: options.orderTime,
      housekeeperName: options.housekeeperName,
      orderNo: options.orderNo,
      basicsPrice: options.basicsPrice,
      otherPrice: options.otherPrice,
      allPrice: allPrice
    });
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