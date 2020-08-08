var util = require('../../../utils/util.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // businessTypeId: '14',
    showType: 14,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        companyId: wx.getStorageSync('selectCompany').id
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
    util.doGet("/product/queryList", data, function (res) {
      console.log(res)
      that.setData({
        productList: res.data
      })
      // 查询商品优惠后的价钱
      that.getProductLaterPrice();
    })

  },


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