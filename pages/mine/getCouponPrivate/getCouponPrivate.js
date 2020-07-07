// pages/mine/getCouponPrivate/getCouponPrivate.js
var util = require('../../../utils/util.js')
const app = getApp();
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
  // 获取accountId
  getProductId: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      accountId: e.detail.value
    })
  },
  // 获取优惠券批次
  getSource: function (e) {
    console.log(e.detail.value)
    var that = this;
    var batchIds = e.detail.value;
    batchIds = batchIds.split(',');
    console.log(batchIds)

    var couponsBatchIdList = [];
    // couponsBatchIdList.push(e.detail.value);
    couponsBatchIdList = batchIds;
    that.setData({
      couponsBatchIdList: couponsBatchIdList,
    })
  },


  /**
   * 给某人领取优惠券
   * 1.输入这个人的accountId
   * 2.输入要领取优惠券的批次，支持多批次领取
   *   如果是多批次的话，用逗号隔开，如 3,4 那么就会领取3和4批次的优惠券
   */
  // 点击领取
  generateMinicode: function (e) {
    console.log("点击领取")
    var that = this;
    that.toGetPoster();
  },
  //点击生成海报
  toGetPoster: function (e) {
    var that = this;
    var data = {
      accountId: that.data.accountId,
      type: 1, // 1.系统发放 2.手点击领取
      couponsBatchIds: that.data.couponsBatchIdList,
      // couponsBatchIds: [4],
    }
    console.log("领券传参：", data)
    util.reqLoading(app.globalData.apiUrl, 'MS00205', data, 'GET', '加载中...', function (res2) {
      console.log("独自领券查询优惠券205205，返回：");
      console.log(res2);
      if(res2.data[0].flag){
        wx.showToast({
          title: '领取成功',
          icon: 'success'
        })
      }else{
        wx.showToast({
          title: res2.data[0].massge,
          icon: 'none'
        })
      }
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