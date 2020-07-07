var util = require('../../../../utils/util.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // businessTypeId: '6',
    showType: 6,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  // 查询商品优惠后的价钱
  getProductLaterPrice() {
    var that = this;

    // if (app.data.accountId) {
    if (app.data.phone) {
      var data = {
        accountId: app.data.accountId,
        // businessTypeId: 6,
        showType: that.data.showType,
      }
      console.log("保洁列表查询优惠价钱传参：")
      console.log(data)
      util.reqLoading(app.globalData.apiUrl, 'MS00206', data, 'POST', '加载中...', function(res) {
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // var that = this;
    // that.onLoad();

    var that = this
    var data = {
      // 传此accountId是为了检测这个人是否还是新用户，进而是否展示新人专享的商品
      accountId: app.data.accountId,
      // businessTypeId: that.data.businessTypeId,
      showType: that.data.showType,
      activityStatus: 'miniapp',
      status: 'put'
    }
    util.doGet("/product/queryList", data, function (res) {

      console.log('保洁列表页：')
      console.log(res)
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
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //进入产品详情
  toDetail: function(e) {
    var activityid = e.currentTarget.dataset.activityid;
    if (!activityid) {
      activityid = ''
    }
    wx.navigateTo({
      url: '/pages/recommend/oddjob/productDetail/productDetail?productId=' + e.currentTarget.dataset.productid + '&activityId=' + activityid,
    });
  }
})