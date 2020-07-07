// pages/mine/cashCoupon/cashCoupon.js
var util = require('../../../utils/util.js')
const app = getApp();
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(e) {},
  // 得到兑换码
  getExchangeCode: function(e) {
    var that = this;
    var exchangeCode = e.detail.value;
    that.setData({
      exchangeCode: exchangeCode,
    })
  },

  // 立即兑换
  redeemNow: function() {
    var that = this;
    var data = {
      accountId: app.data.accountId,
      redemptionCode: that.data.exchangeCode,
    }
    util.reqLoading(app.globalData.apiUrl, 'MS007002', data, 'POST', '加载中...', function(res) {
      console.log('立即兑换，返回：')
      console.log(res)
      // 返回true或false，true代表兑换成功
      if (res.data[0].info == true) {
        wx.showToast({
          title: '兑换成功',
          icon: 'success',
          success: function() {
            setTimeout(function() {
              that.setData({
                currentTab: 1,
              })
              // wx.navigateBack({
              //   delta: 1
              // })
            }, 1000) //延迟时间
          }
        })
      }else{
        wx.showToast({
          title: res.data[0].msg,
          icon: 'none'
        })
      }
    })
  },

  /** 
   * 点击tab切换 
   */
  swichNav: function(e) {
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
    if (index == 1) {
      // 查询兑换记录
      that.getExchangeRecord();
    }

  },
  // 查询兑换记录
  getExchangeRecord: function() {
    var that = this;
    var data = {
      accountId: app.data.accountId,
    }
    util.reqLoading(app.globalData.apiUrl, 'MS007001', data, 'POST', '加载中...', function(res) {
      console.log('兑换记录，返回：')
      console.log(res)
      if (res.data.length != 0) {
        that.setData({
          exchangeList: res.data,
        })
      } else {
        that.setData({
          exchangeList: [],
        })
      }
    })
  },

  // formatTimeTwo: function(number, format) {
  //   var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  //   var returnArr = [];

  //   var date = new Date(number * 1000);
  //   returnArr.push(date.getFullYear());
  //   returnArr.push(formatNumber(date.getMonth() + 1));
  //   returnArr.push(formatNumber(date.getDate()));

  //   returnArr.push(formatNumber(date.getHours()));
  //   returnArr.push(formatNumber(date.getMinutes()));
  //   returnArr.push(formatNumber(date.getSeconds()));

  //   for (var i in returnArr) {
  //     format = format.replace(formateArr[i], returnArr[i]);
  //   }
  //   return format;
  // },


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

  }
})