const app = getApp();
var util = require('../../../../utils/util.js') 
var money = 0
var total = 0
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
    total = options.total
    this.setData({
      total:total
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

  moneyInput: function (e) {
    money = e.detail.value;
    if (parseInt(money) > parseInt(total)){
      this.setData({
        isMore:true,
        money: e.detail.value
      });
    }else{
      this.setData({
        isMore: false,
        money: e.detail.value
      });
    }
    
  },

  withdraw:function(){
    if (parseInt(money)<0 || this.data.isMore){
      wx.showToast({
        title: '请输入正确的提现金额',
        icon: 'none'
      })
      return;
    }
    var data={
      accountId: app.data.accountId,
      money: money
    }
    util.doPost("/housekeeper/" + app.data.openid +"/withdraw", data, function (res) {
      if(res){
        wx.showToast({
          title: '提现成功',
          icon: 'none',
          success:function(e){
            wx.navigateBack({
              delta:1
            })
          }
        })
      }
    })
  }
})