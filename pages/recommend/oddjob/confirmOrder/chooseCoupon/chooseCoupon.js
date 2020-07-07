// pages/recommend/oddjob/confirmOrder/chooseCoupon/chooseCoupon.js
var util = require('../../../../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("productId为：" + options.productId);
    // MS00201获取优惠券列表
    var data = {
      accountId: app.data.accountId,
      productId: options.productId,
      // status: 1,// 使用状态：1.可用 0.已使用 
      // available: 1,// available：过期状态 1.未过期 0.已过期
    }
    util.reqLoading(app.globalData.apiUrl, 'MS00202', data, 'POST', '加载中...', function (res) {
      console.log("查询"+ "优惠券");
      console.log(res);
      var couponList = res.data;
      
      if (couponList.length != 0) {
        var canUserCouponList = [];
        var canNotUserCouponList = [];
        for(var i in couponList){
          if(couponList[i].flag == true){
            canUserCouponList[i] = couponList[i];
          }else{
            canNotUserCouponList[i] = couponList[i];
          }
        }
        that.setData({
          //couponList: couponList,
          canUserCouponList: canUserCouponList,
          canNotUserCouponList: canNotUserCouponList,
        })
      } else {
        that.setData({
          couponList: []
        })
      }
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

  // 选择优惠券
  radioChange: function(e){
    var that = this;
    console.log("选择优惠券");
    console.log("选择优惠券" + e.detail.value);
    var index = e.detail.value;
    var canUserCouponList = that.data.canUserCouponList;
    var targetAmount = canUserCouponList[index].targetAmount;
    var couponsLimit = canUserCouponList[index].couponsLimit;
    var name = canUserCouponList[index].name;
    var couponsNo = canUserCouponList[index].couponsNo;
    var myCouponsId = canUserCouponList[index].id;
    console.log("优惠券编号：" + couponsNo);
    that.setData({
      targetAmount: targetAmount,
      couponsLimit: couponsLimit,
      name: name,
      couponsNo: couponsNo,
      myCouponsId: myCouponsId,
    })

  },
  // 选择使用
  userCoupon: function(){
    var that = this;
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      targetAmount: that.data.targetAmount,
      couponsLimit: that.data.couponsLimit,
      name: that.data.name,
      couponsNo: that.data.couponsNo,
      myCouponsId: that.data.myCouponsId,
    })
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
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

  }
})