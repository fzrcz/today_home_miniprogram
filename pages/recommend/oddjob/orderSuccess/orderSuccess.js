// 代办支付成功
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: 'https://jrdj.oss-cn-shenzhen.aliyuncs.com/mini-customer/banner-findJob.png',
    selectCompany: {}
  },

  /**
   * 查看详情
   */
  toOrderDetail: function () {
    wx.switchTab({
      url: '/pages/order/order',
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
    this.setData({
      selectCompany: wx.getStorageSync('selectCompany')
    })

  },
  previewImage: function(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
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

})