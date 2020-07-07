// pages/mine/myCoupon/myCoupon.js

var app = getApp();
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 获取手机高度
    windowWidth: '',
    windowHeight: '',
    // tab切换  
    currentTab: 0,
    currentPage: 0,
    limit: 5,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // 获取tab栏高度
    var query = wx.createSelectorQuery();
    query.select('.swiper-tab').boundingClientRect(function(rect) {
      that.setData({
        swiperHeight: rect.height
      })
    }).exec();

    // 获取手机高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
        })
      }
    });
    
    // 调用获取优惠券列表的方法
    that.getCouponList(1, 1, 0);

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
  //  去使用
  // 全品类跳到首页
  toIndex: function(){
    wx.switchTab({
      url: '/pages/recommend/recommend',
    })
  },
  // 某品类跳到对应的分类
  toClassification: function(e){
    var businessTypeId = e.currentTarget.dataset.businesstypeid;
    if (businessTypeId == '6'){
      wx.navigateTo({
        url: '/pages/recommend/oddjob/hourCleaning/hourCleaning',
      })
    }
    if (businessTypeId == '7'){
      wx.navigateTo({
        url: '/pages/recommend/oddjob/appliancesCleaning/appliancesCleaning',
      })
    }
  },
  // 指定商品跳到指定商品
  toProduct: function(e){
    var productId = e.currentTarget.dataset.productid;
    var activityId = '';
    wx.navigateTo({
      // url: '/pages/recommend/oddjob/productDetail/productDetail?productId=' + 33 + '&activityId=' + '',
      url: '/pages/recommend/oddjob/productDetail/productDetail?productId=' + productId + '&activityId=' + activityId,
    })
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      });
    }
  },
  /** 
   * 滑动切换tab 
   */
  bindChange: function(e) {
    var that = this;

    var index = e.detail.current
    that.setData({
      currentTab: e.detail.current
    });
    if (that.data.currentTab == 0) {
      console.log("查询可用");
      that.getCouponList(1, 1);
    } 
    if (that.data.currentTab == 1) {
      console.log("查询已使用");
      that.getCouponList(0, '');
    } 
    if (that.data.currentTab == 2) {
      console.log("查询失效");
      that.getCouponList(1, 0);
    } 
    
    else {
      that.setData({
        orderStatus: that.data.currentTab
      });
    }
  },

  // 查询优惠券的方法
  getCouponList: function (status, available){
    var that = this;
    // MS00201获取优惠券列表
    var data = {
      accountId: app.data.accountId,
      status: status,// 使用状态：1.可用 0.已使用 
      available: available,// available：过期状态 1.未过期 0.已过期
    }
    util.reqLoading(app.globalData.apiUrl, 'MS00201', data, 'POST', '加载中...', function (res) {
      console.log("查询" + status + "***" + available + "优惠券");
      console.log(res);
      var couponList = res.data;
      if (couponList.length != 0) {
        that.setData({
          couponList: couponList,
        })
      } else {
        that.setData({
          couponList: []
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // 暂时不加分页功能
  // lower: function (e) {
  //   var that = this;

  //   console.log("进入上拉触底：");
  //   var currentPage = that.data.currentPage;
  //   currentPage++;
  //   console.log("当前页为第" + currentPage + "页")
  //   that.setData({
  //     currentPage: currentPage
  //   })
  //   that.getNewData(currentPage);
  // },
  // 分页操作
  getNewData: function (currentPage) {
    var that = this;
    if (that.data.noDataList0 != 0 && that.data.noDataList1 != 0 && that.data.noDataList2 != 0 && that.data.noDataList3 != 0 && that.data.noDataList4 != 0) {
      wx.showLoading({
        title: '加载中...'
      })
      var data = {
        accountId: app.data.accountId,
        status: status,// 使用状态：1.可用 0.已使用 
        available: available,// available：过期状态 1.未过期 0.已过期
      }
      var offset = currentPage * that.data.limit;
      var limit = that.data.limit;
      util.reqLoadingByPage(app.globalData.apiUrl, 'MS00201', data, offset, limit, 'POST', '加载中...', function (res) {
        console.log("offset" + offset);
        console.log("limit" + limit);
        console.log("查询" + status + "***" + available + "优惠券");
        console.log(res);

        var couponList = res.data;
        if (couponList.length == 0) {
          wx.showToast({
            title: '没有更多数据啦...',
            icon: 'none',
            duration: 1500
          })
          return;

        } else {
          console.log("旧数据：");
          console.log(that.data.couponList);
          console.log("新数据：");
          console.log(couponList);
          // 将新一页的数据添加到原数据后面
          couponList = that.data.couponList.concat(couponList);
          that.setData({
            couponList: couponList,
          })
        }
      })
        //设置当前页码
        that.setData({
          currentPage: currentPage
        })

    } else {
      console.log('没有新数据了...')
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function() {

  // }
})