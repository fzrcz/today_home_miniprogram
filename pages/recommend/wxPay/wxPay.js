// pages/recommend/wxPay/wxPay.js
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
  onLoad: function(options) {
    console.log(11111)
    console.log(options)
    var payParam = options.payParam;
    payParam = payParam.replace("@", "=");
    var objPay = JSON.parse(decodeURIComponent(payParam));
    console.log(22222)
    console.log(objPay)
    var payResult
    wx.requestPayment({
      //相关支付参数
      //"appId": objPay.appId,
      "timeStamp": objPay.timeStamp,
      "nonceStr": objPay.nonceStr,
      //"package": "prepay_id=" + objPay.package,
      "package": objPay.package,
      "signType": objPay.signType,
      "paySign": objPay.paySign,
      //小程序微信支付成功的回调通知

      'success': function(res) {
        var data = {
          // payResult: 1,
          // orderId: objPay.orderId,
          // payNbr: objPay.dealId,
          // businessTypeId: objPay.businessTypeId,
          // goodsId: objPay.goodsId,
          // groupId: objPay.groupId
        }
        console.log("付款成功")
        console.log(objPay)
        var payResult = 1;
        console.log(objPay.payNbr)
        var param = 'payResult=' + payResult + '&orderId=' + objPay.orderId + '&payNbr=' + objPay.payNbr + '&businessTypeId=' + objPay.businessTypeId + '&goodsId=' + objPay.goodsId + '&groupId=' + objPay.groupId + '&productId=' + objPay.productId + '';
        //成功之后拉起微信支付 微信支付完成之后跳转到微信自带的支付成功页面 点击页面上的 ‘确定’ 按钮   返回到首页
          console.log("******************"+app.globalData.netAddress);
        if (objPay.payNbr != null || objPay.payNbr != undefined) {
          if (objPay.businessTypeId == '11'){
            util.doPostForWechat('/cleaningAcarid/miniPayBack?' + param, data, function (res) {
              console.log(res);
            })
          }else{
            util.doPostForWechat('/teamBuying/miniPayBack?' + param, data, function(res) {
              console.log(res);
            })
          }
        }
        wx.redirectTo({
          url: '/pages/recommend/oddjob/orderSuccess/orderSuccess?id=' + objPay.levelid
        })
      },
      //小程序支付失败的回调通知
      'fail': function(res) {
        var data = {
          payResult: 0,
        }
        if (res.errMsg == "requestPayment:fail cancel") {
          console.log("取消支付")
          wx.showToast({
            title: '您已取消支付',
            duration: 2000,
            mask: true
          })
        } else {
          wx.showToast({
            title: '支付失败',
            duration: 2000,
            icon: 'none',
            mask: true
          })
        }
        setTimeout(function() {
          wx.switchTab({
            url: '/pages/recommend/recommend'
          })
        }, 2000)
        console.log("支付失败");
        console.log(res);
      },
      'complete': function(res) {
        console.log(res)
      }

    })
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

  }
})