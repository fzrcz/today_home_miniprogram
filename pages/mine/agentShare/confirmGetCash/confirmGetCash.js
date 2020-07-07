// pages/mine/income/confirmGetCash/confirmGetCash.js
var app = getApp();
var util = require('../../../../utils/util.js');
let WxNotificationCenter = require('../../../../utils/WxNotificationCenter')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      balance: options.balance
    })
  },

  // 获取输入的钱
  getInputMoney: function(e) {
    this.setData({
      inputMoney: e.detail.value
    })
  },
  // 确认提现
  confirmGetCash: function() {
    let that = this
    if(this.data.balance <= 0) {
      wx.showToast({
        title: '提现金额不能小于0',
        icon: 'none'
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定要提现' + that.data.balance + '元吗？',
      success: function(res) {
        //点击确定
        if (res.confirm) {
          var data = {
            id: wx.getStorageSync('agentId'),
            commission: that.data.balance
          }
          util.doPost('form',"/business/agent/commissionWithdrawal", data, function (res) {
            if (res.success) {
              WxNotificationCenter.postNotificationName('updateWithdrawal')
              wx.showToast({
                title: '已提交，待审核',
                icon: 'success',
                duration: 1000,
                success: function() {
                  setTimeout(function() {
                    // 提现成功,返回到今日收益界面
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1000);
                }
              })
            } else {
              wx.showToast({
                title: res.reason,
                icon: 'none',
                duration: 2000,
              })
            }
          })

        }
      }
    })
    

    
  },

  // 跳转到提现记录页面
  getCashRecord: function() {
    wx.navigateTo({
      url: '/pages/mine/agentShare/confirmGetCash/getCashRecord/getCashRecord',
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function() {

  // }
})