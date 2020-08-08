var util = require('../../../utils/util.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowCompany: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 调用新人专享的商品列表
    that.getNewPeople();
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var that = this;
    if(wx.getStorageSync('selectCompany')) {
      this.setData({
        isShowCompany: false
      })
    }
    that.onLoad();

    // 轮播图查询
    that.getRollPicList();
  },

  // 查询轮播图的方法
  getRollPicList: function () {
    var that = this;
    var data = {
      page: 2,// 2.查询的是新人专享的轮播图
      companyId: wx.getStorageSync('selectCompany').id

    }
    util.reqLoading(app.globalData.apiUrl, 'MS01001', data, 'POST', '加载中...', function (res) {
      console.log("新人专享轮播图查询，返回：", res);
      that.setData({
        rollPicList: res.data[0].info,
      })
    })
  },

  // 点击轮播图
  clickBanner: function (e) {
    var that = this;
    var jumpPath = e.currentTarget.dataset.jumppath;
    if(jumpPath){
      wx.navigateTo({
        url: jumpPath,
      })
    }
  },

  // 查询新人专享的商品列表的方法
  getNewPeople: function(){
    var that = this;
    var data = {
      // isNewPeople:是否是新人，1 是新人，只去查询新人专享的商品 0 不是新人
      isNewPeople: 1,
      activityStatus: 'miniapp',
      status: 'put',
      companyId: wx.getStorageSync('selectCompany').id

    }
    util.doGet("/product/queryList", data, function (res) {

      console.log('新人专享列表页：')
      console.log(res)
      that.setData({
        productList: res.data
      })

      // 查询商品优惠后的价钱
      that.getProductLaterPrice();
    })
  },

  //找保姆
  classifyWorkers: function() {
    // 调用util封装好的跳转到保姆页面的方法
    util.toClassifyWorkers();
  },
  //跳转宠物洁页面
  petcleaner() {
    util.toPetClean();
  },
  //跳转2次*4小时钟点保洁
  fourFourHourCleaning: function() {
    util.toFourFourHourCleaning();
  },
  //跳转2次全屋除尘除螨
  twoCleaningAcarid: function() {
    util.toTwoCleaningAcarid();
  },

  // 查询商品优惠后的价钱
  getProductLaterPrice() {
    var that = this;

    // if (app.data.accountId) {
    if (app.data.phone) {
      var data = {
        accountId: app.data.accountId,
        // businessTypeId为0，代表后台只会查询是新人专享的商品的优惠价钱
        businessTypeId: 0,
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