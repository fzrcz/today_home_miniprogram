// pages/recommend/oddjob/leatherCare/leatherCare.js
var util = require('../../../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // businessTypeId: '13',
    showType: 13,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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
      // businessTypeId: that.data.businessTypeId,
      showType: that.data.showType,
      activityStatus: 'miniapp',
      status: 'put',
      companyId: wx.getStorageSync('selectCompany').id
    }
    util.doGet("/product/queryList", data, function(res) {

      console.log('翻新养护列表页：')
      console.log(res)
      that.setData({
        productList: res.data
      })

      // 查询商品优惠后的价钱
      that.getProductLaterPrice();
    })
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
  },
  // 查询商品优惠后的价钱
  getProductLaterPrice() {
    // if (app.data.accountId) {
    if (app.data.phone) {
      var that = this;
      var data = {
        accountId: app.data.accountId,
        // businessTypeId: that.data.businessTypeId,
        showType: that.data.showType,
        companyId: wx.getStorageSync('selectCompany').id
      }
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

  //返回上一页
  toBack: function() {
    wx.navigateBack({
      delta: 1
    })
  }
})