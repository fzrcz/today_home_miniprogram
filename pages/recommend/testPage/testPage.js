var util = require('../../../utils/util.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // businessTypeId: '7',
    showType: 6,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 测试哪个商品，直接把后边的productId改成对应的就行
  onLoad: function (options) {
    // wx.navigateTo({
    //   url: '/pages/recommend/oddjob/productDetail/productDetail?productId=75&activityId=',
    // });
  },

  // 查询商品优惠后的价钱
  getProductLaterPrice() { 
    var that = this;
    // if (app.data.accountId) {
    if (app.data.phone) {
      var data = {
        accountId: app.data.accountId,
        // businessTypeId: that.data.businessTypeId,
        showType: that.data.showType,

      }
      util.reqLoading(app.globalData.apiUrl, 'MS00206', data, 'POST', '加载中...', function (res) {
        console.log("商品优惠后的价钱：")
        console.log(res)
        that.setData({
          afterPriceList: res.data,
        })
      })
    }
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
    // var that = this;
    // that.onLoad();

    var that = this
    var data = {
      // businessTypeId: that.data.businessTypeId,
      showType: that.data.showType,
      status: 'out',
      activityStatus: 'miniapp'
    }
    util.doGet("/product/queryList", data, function (res) {
      that.setData({
        productList: res.data
      })
      // 查询商品优惠后的价钱
      that.getProductLaterPrice();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //进入产品详情
  toDetail: function (e) {
    var activityid = e.currentTarget.dataset.activityid;
    if (!activityid) {
      activityid = ''
    }
    wx.navigateTo({
      url: '/pages/recommend/oddjob/productDetail/productDetail?productId=' + e.currentTarget.dataset.productid + '&activityId=' + activityid,
    });
  }
})